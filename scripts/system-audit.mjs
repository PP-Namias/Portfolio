#!/usr/bin/env node
/**
 * Consolidated system audit.
 *
 * Rolls four concerns that were previously spread across separate workflows —
 * or not checked at all — into one machine-readable report:
 *
 *   1. dependency + secret hygiene   (npm audit, outdated deps, tracked .env files)
 *   2. CI/workflow hardening         (unpinned actions, permissions, persist-credentials)
 *   3. chatbot + RAG health          (provider matrix, RAG config, vector index, chat tests)
 *   4. code quality gates            (lint, typecheck, full test suite, react-doctor)
 *
 * This script is deliberately LLM-free and deterministic. `audit-analyze.mjs`
 * consumes its JSON output and adds the Claude-written remediation summary.
 *
 * Usage:
 *   node scripts/system-audit.mjs [--out audit/system-audit.json] [--fast] [--offline]
 *                                  [--expect-secrets] [--strict]
 *
 * Exit code is 0 unless --strict is passed and a `fail` severity finding exists,
 * so the workflow reports without blocking unrelated work by default.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..');

/**
 * Workspaces to dependency-audit. Each is skipped unless it has both a
 * package.json and a lockfile, so an unbuilt workspace (currently portfolio-v2)
 * is reported as skipped rather than silently omitted.
 */
const WORKSPACES = ['.', 'portfolio-v1', 'portfolio-v2', 'studio', 'ai-service'];

/**
 * Tracked `.env` files that are legitimate by name: templates (anything ending
 * in `.example`) and the deliberate canary-token honeypot, whose fake
 * credentials are the entire point of the file.
 */
const ALLOWED_ENV_BASENAMES = new Set(['.env-canary']);

/**
 * Shapes of real credentials. A tracked env file is only a finding when it
 * assigns a value matching one of these — a template full of
 * `your_api_key_here` placeholders is documentation, not a leak.
 */
const SECRET_VALUE_PATTERNS = [
  /^sk-ant-[A-Za-z0-9_-]{20,}$/, // Anthropic
  /^sk-(?:proj-)?[A-Za-z0-9_-]{24,}$/, // OpenAI
  /^AIza[A-Za-z0-9_-]{30,}$/, // Google
  /^sk[A-Za-z0-9]{60,}$/, // Sanity
  /^gh[pousr]_[A-Za-z0-9]{30,}$/, // GitHub
  /^xox[baprs]-[A-Za-z0-9-]{20,}$/, // Slack
  /^[A-Za-z0-9+/_-]{64,}={0,2}$/, // long opaque blob (base64/hex tokens)
];

const SEVERITY_ORDER = ['fail', 'warn', 'info', 'pass'];

/* ------------------------------------------------------------------ *
 * Pure helpers (exported for unit tests)
 * ------------------------------------------------------------------ */

/** Rank a severity so findings can be sorted worst-first. */
export function severityRank(severity) {
  const index = SEVERITY_ORDER.indexOf(severity);
  return index === -1 ? SEVERITY_ORDER.length : index;
}

/** Reduce a list of severities to the worst one present. */
export function worstSeverity(severities) {
  if (severities.length === 0) {
    return 'pass';
  }

  return [...severities].sort((a, b) => severityRank(a) - severityRank(b))[0];
}

/** Whether a tracked env file is legitimate purely by its name. */
export function isAllowedEnvFilename(file) {
  const base = path.basename(file);
  return base.endsWith('.example') || ALLOWED_ENV_BASENAMES.has(base);
}

/**
 * Find assignments whose value looks like a real credential. Commented lines
 * are skipped, so a documented-but-disabled variable is not a finding.
 */
export function findSecretAssignments(content) {
  const findings = [];

  content.split(/\r?\n/).forEach((line, index) => {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?)\s*$/);

    if (!match) {
      return;
    }

    const [, key, rawValue] = match;
    const value = rawValue.replace(/^['"]/, '').replace(/['"]$/, '');

    if (SECRET_VALUE_PATTERNS.some((pattern) => pattern.test(value))) {
      findings.push({ key, line: index + 1 });
    }
  });

  return findings;
}

/**
 * Split a `git ls-files` listing into env files that are fine to commit and
 * ones that need their contents inspected.
 *
 * `readFile` is injected so this stays pure and testable; when omitted, every
 * non-allowlisted file is treated as needing review.
 */
export function classifyEnvFiles(trackedFiles, readFile) {
  const envFiles = trackedFiles.filter((file) => path.basename(file).startsWith('.env'));

  const allowed = [];
  const leaked = [];

  for (const file of envFiles) {
    if (isAllowedEnvFilename(file)) {
      allowed.push(file);
      continue;
    }

    if (!readFile) {
      leaked.push({ file, secrets: [] });
      continue;
    }

    const secrets = findSecretAssignments(readFile(file) ?? '');

    if (secrets.length > 0) {
      leaked.push({ file, secrets });
    } else {
      // Tracked, but every value is a placeholder — a template, not a leak.
      allowed.push(file);
    }
  }

  return { allowed, leaked };
}

/** Normalize `npm audit --json` output into flat counts. */
export function summarizeAuditMetadata(auditJson) {
  const counts = auditJson?.metadata?.vulnerabilities ?? {};

  const critical = counts.critical ?? 0;
  const high = counts.high ?? 0;
  const moderate = counts.moderate ?? 0;
  const low = counts.low ?? 0;
  const info = counts.info ?? 0;

  const severity = critical > 0 || high > 0 ? 'fail' : moderate > 0 ? 'warn' : 'pass';

  return {
    critical,
    high,
    moderate,
    low,
    info,
    total: critical + high + moderate + low + info,
    severity,
  };
}

const SHA_PIN = /^[0-9a-f]{40}$/;

/**
 * Scan one workflow file for the three hardening properties the repo's existing
 * workflows already follow, so drift shows up as soon as it appears.
 */
export function analyzeWorkflowSource(name, content) {
  const lines = content.split(/\r?\n/);
  const findings = [];

  // A top-level `permissions:` block sits at column 0.
  const hasTopLevelPermissions = lines.some((line) => /^permissions:\s*$/.test(line));

  if (!hasTopLevelPermissions) {
    findings.push({
      severity: 'warn',
      rule: 'missing-top-level-permissions',
      message: 'No top-level `permissions:` block; the workflow inherits default token scope.',
    });
  }

  lines.forEach((line, index) => {
    const usesMatch = line.match(/^\s*-?\s*uses:\s*([^\s#]+)/);

    if (!usesMatch) {
      return;
    }

    const reference = usesMatch[1];

    // Local composite actions and docker refs have no SHA to pin.
    if (reference.startsWith('./') || reference.startsWith('docker://')) {
      return;
    }

    const ref = reference.split('@')[1];

    if (!ref || !SHA_PIN.test(ref)) {
      findings.push({
        severity: 'warn',
        rule: 'unpinned-action',
        line: index + 1,
        message: `\`${reference}\` is not pinned to a full commit SHA.`,
      });
    }

    if (!/actions\/checkout@/.test(reference)) {
      return;
    }

    // Look ahead for this step's `with:` block and require the credential opt-out.
    const lookahead = lines.slice(index + 1, index + 12).join('\n');
    const nextStepStarts = lookahead.search(/^\s*-\s+(name|uses):/m);
    const stepBody = nextStepStarts === -1 ? lookahead : lookahead.slice(0, nextStepStarts);

    if (!/persist-credentials:\s*false/.test(stepBody)) {
      findings.push({
        severity: 'warn',
        rule: 'checkout-persists-credentials',
        line: index + 1,
        message: 'actions/checkout without `persist-credentials: false` leaves the token on disk.',
      });
    }
  });

  return {
    workflow: name,
    severity: worstSeverity(findings.map((finding) => finding.severity)),
    findings,
  };
}

/** Which chat providers are configured, given an environment snapshot. */
export function buildProviderMatrix(env) {
  const order = (env.CHAT_PROVIDER_ORDER || 'claude,gemini,openai')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  const configured = {
    claude: Boolean(env.ANTHROPIC_API_KEY),
    gemini: Boolean(env.GOOGLE_GEMINI_API_KEY),
    openai: Boolean(env.OPENAI_API_KEY),
  };

  const primary = order.find((provider) => configured[provider]) ?? null;

  return {
    order,
    configured,
    primary,
    multiProviderEnabled: ['1', 'true', 'yes', 'on'].includes(
      (env.CHAT_MULTI_PROVIDER_ENABLED || '').toLowerCase()
    ),
    severity: primary ? 'pass' : 'fail',
  };
}

/** Whether RAG retrieval has everything it needs to run. */
export function buildRagMatrix(env) {
  const required = {
    UPSTASH_VECTOR_URL: Boolean(env.UPSTASH_VECTOR_URL),
    UPSTASH_VECTOR_TOKEN: Boolean(env.UPSTASH_VECTOR_TOKEN),
    // Embeddings are Gemini-only; Anthropic ships no embeddings API.
    GOOGLE_GEMINI_API_KEY: Boolean(env.GOOGLE_GEMINI_API_KEY),
  };

  const missing = Object.entries(required)
    .filter(([, present]) => !present)
    .map(([key]) => key);

  return {
    required,
    missing,
    severity: missing.length === 0 ? 'pass' : 'warn',
  };
}

/** Render the report as the markdown written to the CI step summary. */
export function renderMarkdown(report) {
  const lines = [
    '# System Audit',
    '',
    `Generated: ${report.generatedAt}`,
    `Commit: \`${report.commit}\``,
    '',
    '| Section | Status | Summary |',
    '| --- | --- | --- |',
  ];

  for (const section of report.sections) {
    lines.push(`| ${section.title} | ${section.severity} | ${section.summary} |`);
  }

  lines.push('', `**Overall: ${report.severity}**`, '');

  for (const section of report.sections) {
    if (!section.details?.length) {
      continue;
    }

    lines.push(`## ${section.title}`, '');
    for (const detail of section.details) {
      lines.push(`- ${detail}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/* ------------------------------------------------------------------ *
 * Command execution
 * ------------------------------------------------------------------ */

/**
 * Run a command and capture its result without throwing. Audit collectors must
 * record failures as findings rather than aborting the whole run.
 */
function run(command, args, options = {}) {
  try {
    const stdout = execFileSync(command, args, {
      cwd: options.cwd ?? REPO_ROOT,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
      // npm and npx are batch shims on Windows that Node refuses to exec
      // directly. Every argument here is a hardcoded literal, so routing
      // through the interpreter introduces no injection surface.
      shell: process.platform === 'win32',
      ...options,
    });

    return { ok: true, stdout, code: 0 };
  } catch (error) {
    return {
      ok: false,
      stdout: error.stdout?.toString() ?? '',
      stderr: error.stderr?.toString() ?? error.message,
      code: typeof error.status === 'number' ? error.status : 1,
    };
  }
}

function parseJsonLoose(text) {
  if (!text?.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    // npm sometimes prefixes JSON with warnings; recover the outermost object.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start === -1 || end <= start) {
      return null;
    }

    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

function workspaceExists(workspace) {
  return fs.existsSync(path.join(REPO_ROOT, workspace, 'package.json'));
}

/** `npm audit` needs a lockfile; without one the workspace cannot be audited. */
function workspaceIsAuditable(workspace) {
  return (
    workspaceExists(workspace) &&
    fs.existsSync(path.join(REPO_ROOT, workspace, 'package-lock.json'))
  );
}

/* ------------------------------------------------------------------ *
 * Collector 1 — dependency + secret hygiene
 * ------------------------------------------------------------------ */

function collectDependencyHygiene() {
  const details = [];
  const severities = [];
  const workspaces = {};
  const skipped = [];

  for (const workspace of WORKSPACES) {
    if (!workspaceIsAuditable(workspace)) {
      // Named explicitly: a silently omitted workspace reads as "clean".
      skipped.push(workspace);
      continue;
    }

    const cwd = path.join(REPO_ROOT, workspace);
    const result = run('npm', ['audit', '--json'], { cwd });
    const parsed = parseJsonLoose(result.stdout);

    if (!parsed) {
      workspaces[workspace] = { error: 'npm audit produced no parsable output', severity: 'warn' };
      severities.push('warn');
      details.push(`\`${workspace}\`: npm audit could not be parsed.`);
      continue;
    }

    const summary = summarizeAuditMetadata(parsed);
    workspaces[workspace] = summary;
    severities.push(summary.severity);

    details.push(
      `\`${workspace}\`: ${summary.total} advisories ` +
        `(critical ${summary.critical}, high ${summary.high}, moderate ${summary.moderate}).`
    );
  }

  if (skipped.length > 0) {
    details.push(
      `Not dependency-audited (no lockfile): ${skipped.map((name) => `\`${name}\``).join(', ')}.`
    );
  }

  const tracked = run('git', ['ls-files']);
  const trackedFiles = tracked.stdout.split(/\r?\n/).filter(Boolean);

  const envFiles = classifyEnvFiles(trackedFiles, (file) => {
    try {
      return fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
    } catch {
      return '';
    }
  });

  if (envFiles.leaked.length > 0) {
    severities.push('fail');

    for (const leak of envFiles.leaked) {
      // Report the variable names only — never the values.
      details.push(
        `**\`${leak.file}\` is tracked and assigns real-looking credentials:** ` +
          `${leak.secrets.map((secret) => `\`${secret.key}\` (line ${secret.line})`).join(', ')}`
      );
    }
  } else {
    details.push(
      `No tracked \`.env\` file assigns a real-looking credential ` +
        `(${envFiles.allowed.length} template/canary files checked).`
    );
  }

  const severity = worstSeverity(severities);

  return {
    id: 'dependency-hygiene',
    title: 'Dependency + secret hygiene',
    severity,
    summary: `${Object.keys(workspaces).length} workspaces audited, ${envFiles.leaked.length} env file(s) with real credentials`,
    details,
    data: { workspaces, skipped, envFiles },
  };
}

/* ------------------------------------------------------------------ *
 * Collector 2 — CI/workflow hardening
 * ------------------------------------------------------------------ */

function collectWorkflowHardening() {
  const workflowDir = path.join(REPO_ROOT, '.github', 'workflows');

  if (!fs.existsSync(workflowDir)) {
    return {
      id: 'workflow-hardening',
      title: 'CI/workflow hardening',
      severity: 'warn',
      summary: 'No .github/workflows directory found',
      details: [],
      data: {},
    };
  }

  const files = fs
    .readdirSync(workflowDir)
    .filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'));

  const results = files.map((file) =>
    analyzeWorkflowSource(file, fs.readFileSync(path.join(workflowDir, file), 'utf8'))
  );

  const byRule = {};
  for (const result of results) {
    for (const finding of result.findings) {
      byRule[finding.rule] = (byRule[finding.rule] ?? 0) + 1;
    }
  }

  const flagged = results.filter((result) => result.findings.length > 0);

  const details = flagged
    .sort((a, b) => b.findings.length - a.findings.length)
    .slice(0, 10)
    .map((result) => `\`${result.workflow}\`: ${result.findings.length} finding(s) — ` +
      `${[...new Set(result.findings.map((finding) => finding.rule))].join(', ')}`);

  if (flagged.length > 10) {
    details.push(`…and ${flagged.length - 10} more workflow(s) with findings.`);
  }

  return {
    id: 'workflow-hardening',
    title: 'CI/workflow hardening',
    severity: worstSeverity(results.map((result) => result.severity)),
    summary: `${flagged.length}/${files.length} workflows flagged`,
    details,
    data: { byRule, workflows: results },
  };
}

/* ------------------------------------------------------------------ *
 * Collector 3 — chatbot + RAG health
 * ------------------------------------------------------------------ */

async function checkVectorIndex(env, offline) {
  if (offline) {
    return { skipped: true, reason: 'offline mode' };
  }

  if (!env.UPSTASH_VECTOR_URL || !env.UPSTASH_VECTOR_TOKEN) {
    return { skipped: true, reason: 'vector credentials not configured' };
  }

  try {
    const response = await fetch(`${env.UPSTASH_VECTOR_URL.replace(/\/$/, '')}/info`, {
      headers: { Authorization: `Bearer ${env.UPSTASH_VECTOR_TOKEN}` },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return { reachable: false, status: response.status };
    }

    const payload = await response.json();

    return {
      reachable: true,
      vectorCount: payload?.result?.vectorCount ?? payload?.vectorCount ?? null,
      dimension: payload?.result?.dimension ?? payload?.dimension ?? null,
    };
  } catch (error) {
    return { reachable: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function collectChatbotHealth({ fast, offline, expectSecrets }) {
  const env = process.env;
  const providers = buildProviderMatrix(env);
  const rag = buildRagMatrix(env);
  const vectorIndex = await checkVectorIndex(env, offline);

  // A developer laptop has no provider keys exported, so treating "nothing
  // configured" as a failure would make `fail` the default local outcome and
  // train everyone to ignore the severity. Only CI, which injects secrets,
  // passes --expect-secrets and gets a hard failure.
  const configSeverity = (severity) =>
    expectSecrets || severity === 'pass' ? severity : 'info';

  const details = [
    `Provider order: ${providers.order.join(' → ')}; primary configured provider: ` +
      `${providers.primary ?? '**none**'}.`,
    `Configured: ${Object.entries(providers.configured)
      .map(([name, ok]) => `${name}=${ok ? 'yes' : 'no'}`)
      .join(', ')}.`,
    rag.missing.length === 0
      ? 'RAG environment complete.'
      : `RAG environment missing: ${rag.missing.join(', ')}.`,
  ];

  if (vectorIndex.skipped) {
    details.push(`Vector index check skipped (${vectorIndex.reason}).`);
  } else if (vectorIndex.reachable) {
    details.push(
      `Vector index reachable — ${vectorIndex.vectorCount ?? 'unknown'} vectors, ` +
        `dimension ${vectorIndex.dimension ?? 'unknown'}.`
    );
  } else {
    details.push(`Vector index unreachable (${vectorIndex.error ?? `HTTP ${vectorIndex.status}`}).`);
  }

  const severities = [configSeverity(providers.severity), configSeverity(rag.severity)];

  if (!expectSecrets && !providers.primary) {
    details.push(
      'No provider credentials in this environment — run with --expect-secrets ' +
        '(as CI does) to treat missing configuration as a failure.'
    );
  }
  let chatTests = { skipped: true, reason: '--fast' };

  if (!fast && workspaceExists('portfolio-v1')) {
    const result = run('npx', ['vitest', 'run', 'src/__tests__/chat', 'src/__tests__/rag'], {
      cwd: path.join(REPO_ROOT, 'portfolio-v1'),
    });

    chatTests = { skipped: false, passed: result.ok, exitCode: result.code };
    severities.push(result.ok ? 'pass' : 'fail');
    details.push(`Chat + RAG test suites: ${result.ok ? 'passed' : 'FAILED'}.`);
  }

  if (!vectorIndex.skipped && !vectorIndex.reachable) {
    severities.push('warn');
  }

  return {
    id: 'chatbot-health',
    title: 'Chatbot + RAG health',
    severity: worstSeverity(severities),
    summary: `primary=${providers.primary ?? 'none'}, rag=${rag.missing.length === 0 ? 'ok' : 'incomplete'}`,
    details,
    data: { providers, rag, vectorIndex, chatTests },
  };
}

/* ------------------------------------------------------------------ *
 * Collector 4 — code quality gates
 * ------------------------------------------------------------------ */

function collectCodeQuality({ fast }) {
  if (fast) {
    return {
      id: 'code-quality',
      title: 'Code quality gates',
      severity: 'info',
      summary: 'skipped (--fast)',
      details: ['Quality gates skipped because --fast was passed.'],
      data: { skipped: true },
    };
  }

  const cwd = path.join(REPO_ROOT, 'portfolio-v1');

  if (!workspaceExists('portfolio-v1')) {
    return {
      id: 'code-quality',
      title: 'Code quality gates',
      severity: 'warn',
      summary: 'portfolio-v1 not found',
      details: [],
      data: {},
    };
  }

  const gates = {
    lint: run('npm', ['run', 'lint'], { cwd }),
    typecheck: run('npx', ['tsc', '--noEmit'], { cwd }),
    tests: run('npx', ['vitest', 'run'], { cwd }),
    reactDoctor: run('npx', ['react-doctor', '--json'], { cwd }),
  };

  const doctorReport = parseJsonLoose(gates.reactDoctor.stdout);
  const doctorScore = doctorReport?.score ?? doctorReport?.summary?.score ?? null;

  const data = {
    lint: { passed: gates.lint.ok },
    typecheck: { passed: gates.typecheck.ok },
    tests: { passed: gates.tests.ok },
    reactDoctor: { score: doctorScore, ran: gates.reactDoctor.ok },
  };

  const details = [
    `Lint: ${gates.lint.ok ? 'passed' : 'FAILED'}.`,
    `Typecheck: ${gates.typecheck.ok ? 'passed' : 'FAILED'}.`,
    `Tests: ${gates.tests.ok ? 'passed' : 'FAILED'}.`,
    `react-doctor score: ${doctorScore ?? 'unavailable'}.`,
  ];

  // A failing gate is a hard failure; a missing react-doctor score is not.
  const severity = worstSeverity([
    gates.lint.ok ? 'pass' : 'fail',
    gates.typecheck.ok ? 'pass' : 'fail',
    gates.tests.ok ? 'pass' : 'fail',
  ]);

  return {
    id: 'code-quality',
    title: 'Code quality gates',
    severity,
    summary: `lint=${gates.lint.ok ? 'ok' : 'fail'}, types=${gates.typecheck.ok ? 'ok' : 'fail'}, tests=${gates.tests.ok ? 'ok' : 'fail'}`,
    details,
    data,
  };
}

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */

function parseArgs(argv) {
  return {
    out: argv.includes('--out') ? argv[argv.indexOf('--out') + 1] : 'audit/system-audit.json',
    fast: argv.includes('--fast'),
    offline: argv.includes('--offline'),
    expectSecrets: argv.includes('--expect-secrets'),
    strict: argv.includes('--strict'),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const commit = run('git', ['rev-parse', 'HEAD']).stdout.trim() || 'unknown';

  const sections = [
    collectDependencyHygiene(),
    collectWorkflowHardening(),
    await collectChatbotHealth(options),
    collectCodeQuality(options),
  ];

  const report = {
    generatedAt: new Date().toISOString(),
    commit,
    severity: worstSeverity(sections.map((section) => section.severity)),
    sections,
  };

  const outPath = path.isAbsolute(options.out) ? options.out : path.join(REPO_ROOT, options.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

  const markdown = renderMarkdown(report);
  console.log(markdown);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  }

  console.error(`\n[system-audit] report written to ${outPath} (severity: ${report.severity})`);

  if (options.strict && report.severity === 'fail') {
    process.exitCode = 1;
  }
}

// Only run when invoked directly, so the pure helpers stay importable in tests.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error('[system-audit] fatal:', error);
    process.exitCode = 1;
  });
}
