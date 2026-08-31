# System Audit

One scheduled job that answers "is this repo healthy right now?" without you
opening 25 workflow runs. It has two halves:

- **`scripts/system-audit.mjs`** — deterministic collectors, no LLM. Writes
  `audit/system-audit.json` and a markdown summary.
- **`scripts/audit-analyze.mjs`** — reads that JSON and asks Claude to separate
  the urgent findings from the noise and propose a fix order.

The split is deliberate: the collectors must be reproducible and diffable, so
nothing in them depends on a model. The model only interprets.

## Running it locally

```bash
node scripts/system-audit.mjs
```

Options:

| Flag | Effect |
| --- | --- |
| `--fast` | Skip the slow quality gates (lint, typecheck, full test suite, react-doctor) |
| `--offline` | Skip the Upstash vector-index reachability probe |
| `--out <path>` | Write the JSON somewhere other than `audit/system-audit.json` |
| `--expect-secrets` | Treat missing chat/RAG credentials as a failure rather than `info`. CI passes this; local runs should not |
| `--strict` | Exit non-zero when the overall severity is `fail` |

A quick pass while iterating:

```bash
node scripts/system-audit.mjs --fast --offline
```

Then the Claude layer:

```bash
node scripts/audit-analyze.mjs
```

`audit/` is gitignored, so runs never dirty the working tree.

## What each collector checks

### 1. Dependency + secret hygiene

- `npm audit --json` across every workspace that has both a package.json and a
  lockfile: root, `portfolio-v1`, `studio`, `ai-service`. Critical or high
  advisories are a `fail`; moderate is a `warn`. A workspace without a lockfile
  (currently `portfolio-v2`) is reported as skipped by name — silently omitting
  it would read as "clean".
- Every tracked `.env*` file is checked for **real credential values**, not just
  for existing. Templates (anything ending in `.example`) and the deliberate
  `.env-canary` honeypot are allowed by name. Everything else is read and matched
  against known credential shapes (Anthropic, OpenAI, Google, Sanity, GitHub,
  Slack, and long opaque tokens).

  This distinction matters: `portfolio-v1/.env.vercel` is tracked on purpose as a
  deployment template full of placeholders. A name-only rule would flag it every
  week and train you to ignore the section. **Findings report the variable name
  and line number only — never the value.**

### 2. CI/workflow hardening

Scans every file in `.github/workflows/` for three properties the repo's existing
workflows already follow, so drift shows up as soon as it appears:

| Rule | Why |
| --- | --- |
| `unpinned-action` | A third-party action on a mutable tag can change under you. Local (`./`) and `docker://` refs are exempt. |
| `missing-top-level-permissions` | Without an explicit block the job inherits the default token scope. |
| `checkout-persists-credentials` | `actions/checkout` without `persist-credentials: false` leaves the token in `.git/config` for every later step. |

This reports only. `zizmor`, `checkov`, and `gitleaks` remain the authoritative
gates — this exists so the state is visible in one place.

### 3. Chatbot + RAG health

- Which chat providers are configured, and which one `CHAT_PROVIDER_ORDER`
  actually resolves to as primary. No configured provider is a `fail` under
  `--expect-secrets`, and `info` otherwise (see below).
- Whether RAG has what it needs. Note that `GOOGLE_GEMINI_API_KEY` is required
  **even when Claude answers** — Anthropic ships no embeddings API, so
  `src/lib/rag/embedder.ts` stays on `gemini-embedding-001`.
- Upstash vector index reachability and vector count.
- The `src/__tests__/chat` and `src/__tests__/rag` suites.

### 4. Code quality gates

`lint`, `tsc --noEmit`, the full vitest run, and the react-doctor score, rolled
into one section. Skipped entirely under `--fast`.

## The workflow

`.github/workflows/system-audit.yml` runs on:

- a weekly cron (Mondays 03:00 UTC),
- every push to `dev`,
- `workflow_dispatch` (with a `fast` input).

It uploads `audit/` as an artifact, writes the summary to the run summary, and —
on scheduled runs only — comments the report onto a single rolling issue labelled
`system-audit` rather than opening a new issue each week.

### Pausing it

The workflow checks for the `loop-pause-all` label before doing anything, the
same kill switch `daily-triage.yml` honours. Creating that label pauses every
automated loop in the repo at once:

```bash
gh label create loop-pause-all --description "Pause all automated loops"
```

Delete the label to resume.

### Why CI passes --expect-secrets

A developer laptop exports no provider keys, so without this flag a local run
would report `fail` every time and the severity would stop meaning anything. CI
injects the secrets and passes the flag, so there a missing key really is a
failure. Locally the same condition is reported as `info` with a note.

### Secrets it expects

`ANTHROPIC_API_KEY` is the only one the analysis layer needs. Without it the
audit still runs and the analysis step emits a notice and exits 0 — a missing key
must never fail the audit. `GOOGLE_GEMINI_API_KEY`, `OPENAI_API_KEY`,
`UPSTASH_VECTOR_URL`, and `UPSTASH_VECTOR_TOKEN` are used for presence checks and
the vector probe.

## Extending it

Collectors are plain functions returning a section object:

```js
{ id, title, severity, summary, details: string[], data: object }
```

`severity` is one of `fail` | `warn` | `info` | `pass`; the overall report takes
the worst. Keep the pure logic in an exported function so it can be unit-tested —
see `portfolio-v1/src/__tests__/scripts/system-audit.test.ts`, which imports the
helpers directly and never shells out.
