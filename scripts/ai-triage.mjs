#!/usr/bin/env node
/**
 * ai-triage.mjs — LLM-informed issue/PR triage loop.
 *
 * Classifies issues and pull requests, assigns a priority tier, flags
 * potential duplicates against open items, and applies GitHub labels.
 * Uses an OpenAI-compatible endpoint (OPENAI_API_KEY), Anthropic
 * (ANTHROPIC_API_KEY), or Google Gemini (GEMINI_API_KEY, free tier
 * supported). Falls back to a deterministic keyword classifier when
 * the LLM call fails so the loop never hard-fails.
 *
 * Env: GITHUB_EVENT_PATH, GH_TOKEN, OPENAI_API_KEY | ANTHROPIC_API_KEY |
 *      GEMINI_API_KEY | any combination, LLM_API_BASE (optional,
 *      OpenAI-compatible), LLM_MODEL / GEMINI_MODEL (optional).
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const TRIAGE_LABELS = [
  'bug',
  'feature',
  'documentation',
  'question',
  'p0-critical',
  'p1-high',
  'p2-medium',
  'p3-low',
  'duplicate',
];

const BOT_ACTORS = /^(dependabot|renovate|github-actions)(\[bot\])?$/i;

function gh(args, input) {
  const options = { encoding: 'utf8', env: process.env };
  if (input) {
    const dir = mkdtempSync(join(tmpdir(), 'triage-'));
    const file = join(dir, 'payload.json');
    writeFileSync(file, input);
    args = [...args, '--input', file];
  }
  try {
    return JSON.parse(execFileSync('gh', ['api', ...args], options));
  } catch (err) {
    const message = err.stderr ? err.stderr.toString() : String(err);
    console.error(`gh failed: ${args.join(' ')} — ${message.slice(0, 500)}`);
    return null;
  }
}

function tokens(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function bigrams(list) {
  const set = new Set();
  for (let i = 0; i < list.length - 1; i += 1) {
    set.add(`${list[i]} ${list[i + 1]}`);
  }
  return set;
}

function similarityScore(aText, bText) {
  const a = bigrams(tokens(aText));
  const b = bigrams(tokens(bText));
  if (a.size === 0 || b.size === 0) return 0;
  let overlap = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const gram of small) {
    if (large.has(gram)) overlap += 1;
  }
  return overlap / Math.min(a.size, b.size);
}

function deterministicClassify(title, body) {
  const haystack = `${title} ${body}`.toLowerCase();
  const has = (words) => words.some((w) => haystack.includes(w));
  if (has(['security', 'cve', 'vulnerability', 'p0', 'down', 'outage'])) {
    return { classification: 'bug', priority: 'p0-critical' };
  }
  if (has(['crash', 'error', 'fail', 'bug', 'broken', 'regression', 'exception', 'not working', 'doesn\u2019t work', 'does not work'])) {
    return { classification: 'bug', priority: 'p1-high' };
  }
  if (has(['add', 'implement', 'support', 'new feature', 'enhance', 'would be nice', 'improve', 'feat'])) {
    return { classification: 'feature', priority: 'p2-medium' };
  }
  if (has(['documentation', 'readme', 'typo', 'doc', 'guide', 'example', 'comment'])) {
    return { classification: 'documentation', priority: 'p3-low' };
  }
  if (has(['how do', 'how to', 'is it possible', 'can i', 'question', 'help'])) {
    return { classification: 'question', priority: 'p3-low' };
  }
  return { classification: 'question', priority: 'p3-low' };
}

async function llmClassify(prompt) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (openaiKey) {
    const base = (process.env.LLM_API_BASE || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = process.env.LLM_MODEL || 'gpt-4o-mini';
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 400,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI-compatible API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices[0].message.content;
  }

  if (anthropicKey) {
    const model = process.env.LLM_MODEL || 'claude-3-5-haiku-latest';
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.content[0].text;
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 400,
          responseMimeType: 'application/json',
        },
      }),
    });
    if (!res.ok) throw new Error(`Gemini API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error(`Gemini API returned no text; ${JSON.stringify(data).slice(0, 300)}`);
    return text;
  }

  throw new Error('no LLM API key configured (expected OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY)');
}

function parseResult(raw) {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(cleaned);
  const classification = TRIAGE_LABELS.includes(parsed.classification) ? parsed.classification : 'question';
  const priority = TRIAGE_LABELS.includes(parsed.priority) ? parsed.priority : 'p2-medium';
  return {
    classification,
    priority,
    summary: String(parsed.summary || '').slice(0, 280),
    duplicate: parsed.duplicate === true,
  };
}

const SYSTEM_PROMPT = `You are a repository triage assistant. Classify a GitHub issue or pull request.

Respond with ONLY a JSON object of this exact shape:
{"classification": "bug|feature|documentation|question", "priority": "p0-critical|p1-high|p2-medium|p3-low", "summary": "<one sentence, max 280 chars>", "duplicate": true|false}

Rules:
- classification: bug = defect/incorrect behavior; feature = new capability or enhancement; documentation = docs/typos/examples; question = asks how to do something.
- priority: p0-critical only for security or production-down situations; p1-high for reproducible bugs or broken core functionality; p2-medium for standard features or bugs with workarounds; p3-low for questions, trivial fixes, documentation.
- duplicate: true ONLY when the provided open-item candidate list contains an item describing the same problem with high confidence. Otherwise false.
- The duplicateCandidates list may be empty; then duplicate must be false.
- Do not invent labels outside the allowed values. Respond with valid JSON only, nothing else.`;

function buildPrompt(kind, title, body, candidates) {
  const candidateLines = candidates
    .slice(0, 8)
    .map((c) => `- #${c.number}: ${c.title} (similarity ${(c.score * 100).toFixed(0)}%)`)
    .join('\n');
  return [
    `Kind: ${kind}`,
    `Title: ${title}`,
    `Body:\n${body.slice(0, 4000) || '(empty)'}`,
    candidateLines ? `duplicateCandidates:\n${candidateLines}` : 'duplicateCandidates: (none)',
  ].join('\n\n');
}

async function main() {
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const actor = event.actor || '';
  if (BOT_ACTORS.test(actor)) {
    console.log(`Skipping bot actor: ${actor}`);
    process.exit(0);
  }

  const isPr = Boolean(event.pull_request);
  const item = isPr ? event.pull_request : event.issue;
  if (!item) {
    console.log('No issue or pull_request payload; skipping.');
    process.exit(0);
  }

  const { number, title, body, html_url: url } = item;
  const owner = event.repository.owner.login;
  const repo = event.repository.name;
  const kind = isPr ? 'pull request' : 'issue';
  const action = event.action || '';

  const existingLabels = (item.labels || []).map((l) => l.name);
  const alreadyTriaged = existingLabels.some((l) =>
    ['bug', 'feature', 'documentation', 'question'].includes(l),
  );
  if (action === 'edited' && alreadyTriaged) {
    console.log(`#${number} already triaged; skipping re-triage on edit.`);
    process.exit(0);
  }

  const open = gh([
    `repos/${owner}/${repo}/issues`,
    '-f',
    'state=open',
    '-f',
    'per_page=100',
  ]) || [];
  const candidates = open
    .filter((i) => i.number !== number && i.title)
    .map((i) => ({
      number: i.number,
      title: i.title,
      score: similarityScore(`${title} ${body}`, `${i.title} ${i.body || ''}`),
    }))
    .filter((c) => c.score >= 0.35)
    .sort((a, b) => b.score - a.score);

  const prompt = buildPrompt(kind, title, body, candidates);

  let result;
  try {
    result = parseResult(await llmClassify(prompt));
  } catch (err) {
    console.warn(`LLM classify failed (${err.message}); using deterministic fallback.`);
    result = { ...deterministicClassify(title, body), summary: '' };
    result.duplicate = candidates.length > 0 ? candidates[0].score >= 0.55 : false;
  }

  if (result.duplicate && candidates.length > 0) {
    const top = candidates[0];
    result.summary = `Potential duplicate of #${top.number} (similarity ${(top.score * 100).toFixed(0)}%). ${result.summary}`.trim();
  }

  const toApply = [...new Set([result.classification, result.priority, result.duplicate ? 'duplicate' : null, ...existingLabels])].filter(
    (l) => l && TRIAGE_LABELS.includes(l),
  );

  if (toApply.length > 0) {
    const labels = [...new Set(toApply)];
    gh(
      ['-X', 'POST', `repos/${owner}/${repo}/issues/${number}/labels`, ...labels.flatMap((l) => ['-f', `labels[]=${l}`])],
    ) && console.log(`Applied labels on #${number}: ${labels.join(', ')}`);
  }

  if (action !== 'edited') {
    const safeUrl = url.replace(/['\\]/g, '');
    const body = [
      `## AI Triage`,
      ``,
      `- **Classification**: ${result.classification}`,
      `- **Priority**: ${result.priority}`,
      `- **Duplicate**: ${result.duplicate ? 'yes' : 'no'}`,
      result.summary ? `- **Summary**: ${result.summary}` : '',
      ``,
      `Posted by the AI Triage loop — labels applied; human review still required.`,
      ``,
      `---`,
      `_Triage report for [${kind} #${number}](${safeUrl})._`,
      ``,
    ].join('\n');
    gh(
      ['-X', 'POST', `repos/${owner}/${repo}/issues/${number}/comments`],
      JSON.stringify({ body }),
    ) && console.log(`Posted triage comment on #${number}`);
  }

  console.log(
    JSON.stringify({
      number,
      kind,
      classification: result.classification,
      priority: result.priority,
      duplicate: result.duplicate,
      labels: toApply,
      source: result.summary.startsWith('Potential duplicate') ? 'llm+duplicate' : 'llm-or-fallback',
    }),
  );
}

main().catch((err) => {
  console.error(`AI triage failed gracefully: ${err.message}`);
  process.exit(0);
});