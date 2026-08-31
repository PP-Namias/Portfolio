#!/usr/bin/env node
/**
 * Claude-powered analysis layer for the system audit.
 *
 * Reads the deterministic report produced by `scripts/system-audit.mjs` and asks
 * Claude to separate the urgent findings from the noise and propose a fix order.
 * The raw collectors stay LLM-free so the audit itself is reproducible; this
 * script only interprets what they found.
 *
 * Like `scripts/ai-triage.mjs`, it degrades gracefully: with no ANTHROPIC_API_KEY
 * it emits a GitHub notice and exits 0. A missing key must never fail the audit.
 *
 * Usage:
 *   node scripts/audit-analyze.mjs [--in audit/system-audit.json] [--out audit/audit-analysis.md]
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..');

const DEFAULT_MODEL = 'claude-opus-5';
const MAX_OUTPUT_TOKENS = 8000;

const SYSTEM_PROMPT = `You are a senior platform engineer reviewing an automated audit of a
Next.js portfolio monorepo (portfolio-v1 app, Sanity studio, a LangGraph ai-service, and ~25
GitHub Actions workflows).

You are given the raw JSON report from a deterministic audit script. Your job is to make it
actionable, not to restate it.

Write a markdown report with exactly these sections:

## Verdict
One paragraph: is the system healthy, degraded, or broken? Say which finding drove that call.

## Fix now
Findings that are genuinely urgent — security exposure, broken builds, a chatbot that cannot
answer. For each: what is wrong, why it matters, and the concrete first step. Omit the section
entirely if nothing qualifies.

## Fix soon
Real problems that are not urgent. Same format, briefer.

## Noise
Findings that look alarming but are not worth acting on, and why. Being explicit about what to
ignore is as valuable as the fix list.

## Suggested order
A numbered list of the work in the order you would do it, with a rough effort estimate each.

Rules:
- Be specific. Name files, workspaces, and workflow names from the report.
- Do not invent findings that are not in the JSON.
- If a section has nothing in it, say so in one line rather than padding.
- No preamble and no closing summary. Start with "## Verdict".`;

function parseArgs(argv) {
  return {
    in: argv.includes('--in') ? argv[argv.indexOf('--in') + 1] : 'audit/system-audit.json',
    out: argv.includes('--out') ? argv[argv.indexOf('--out') + 1] : 'audit/audit-analysis.md',
  };
}

function resolvePath(candidate) {
  return path.isAbsolute(candidate) ? candidate : path.join(REPO_ROOT, candidate);
}

function notice(message) {
  console.log(`::notice::${message}`);
}

/**
 * Trim the report down to what the model needs. The full workflow scan can carry
 * hundreds of per-line findings; the rule counts and worst offenders are enough
 * to reason about, and keeping the payload small keeps the call cheap.
 */
export function compactReport(report) {
  return {
    generatedAt: report.generatedAt,
    commit: report.commit,
    severity: report.severity,
    sections: (report.sections ?? []).map((section) => {
      const compacted = {
        id: section.id,
        title: section.title,
        severity: section.severity,
        summary: section.summary,
        details: section.details,
      };

      if (section.id === 'workflow-hardening') {
        const workflows = section.data?.workflows ?? [];

        compacted.data = {
          byRule: section.data?.byRule ?? {},
          worstWorkflows: workflows
            .filter((workflow) => workflow.findings.length > 0)
            .sort((a, b) => b.findings.length - a.findings.length)
            .slice(0, 8)
            .map((workflow) => ({
              workflow: workflow.workflow,
              findingCount: workflow.findings.length,
              rules: [...new Set(workflow.findings.map((finding) => finding.rule))],
            })),
        };

        return compacted;
      }

      compacted.data = section.data;
      return compacted;
    }),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const inPath = resolvePath(options.in);

  if (!fs.existsSync(inPath)) {
    notice(`No audit report at ${options.in}; run scripts/system-audit.mjs first. Skipping analysis.`);
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    notice('ANTHROPIC_API_KEY is not set; skipping Claude audit analysis. The raw report is still available.');
    return;
  }

  const report = JSON.parse(fs.readFileSync(inPath, 'utf8'));
  const payload = compactReport(report);

  const client = new Anthropic();

  // Streaming keeps a large max_tokens from hitting the request timeout.
  const stream = client.messages.stream({
    model: process.env.AUDIT_ANALYSIS_MODEL?.trim() || DEFAULT_MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: SYSTEM_PROMPT,
    // This is a batch job run on a schedule, so correctness beats latency.
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high' },
    messages: [
      {
        role: 'user',
        content: `Audit report JSON:\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``,
      },
    ],
  });

  const message = await stream.finalMessage();

  if (message.stop_reason === 'refusal') {
    notice(`Claude declined to analyze the audit (${message.stop_details?.category ?? 'unspecified'}).`);
    return;
  }

  const analysis = message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();

  if (!analysis) {
    notice('Claude returned an empty analysis; leaving the raw report as-is.');
    return;
  }

  const outPath = resolvePath(options.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const document = `# Audit Analysis\n\nModel: \`${message.model}\` · Commit: \`${report.commit}\` · Severity: **${report.severity}**\n\n${analysis}\n`;
  fs.writeFileSync(outPath, document);

  console.log(document);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${document}\n`);
  }

  console.error(`[audit-analyze] analysis written to ${outPath}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    // An analysis failure must not fail the audit workflow.
    console.log(`::warning::Claude audit analysis failed: ${error instanceof Error ? error.message : String(error)}`);
  });
}
