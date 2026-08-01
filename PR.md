# PR: Portfolio V1 — dev branch updates

Single accumulating PR description for branch `dev` (target: `main`). Every update on this branch is appended to this file so the PR always tells the full story. See "How to update" at the bottom.

## Summary

This PR brings the latest Portfolio V1 work to `main` and deploys it to Vercel (https://namias.tech). The branch contains the full monorepo (portfolio-v1, portfolio-v2, studio, ai-service) plus all V1 changes since `b11d8442` — AI chatbot overhaul, PWA/offline support, home page streaming layout fixes, blog image fixes, and a large test coverage program.

Full commit list: `git log main..dev --oneline`

## Changelog (accumulated updates)

### 2026-08-02 — Chatbot: streaming, memory, hidden threading, hourly auto-reset

- `b7dcf82e` fix(chat): hide conversation/threading UI and auto-reset chat every hour
  - `IS_CHAT_THREADING_ENABLED=false` — Conversations toggle + sidebar no longer render anywhere (code stays gated, no user-facing conversation list)
  - FloatingHub clears chat messages after 1 hour of inactivity; the welcome message returns automatically, no manual delete needed
  - Tests: session-scoped thread id, no threads API calls, hourly reset covered
- `666d42aa` fix(chat): working AI chatbot — real streaming, multi-turn memory, single-pass tools, threading UI
  - PRD: `docs/prd/prd.chatbot.json` (6 verified defects + fix plan)
  - `streamWithGemini()` via `generateContentStream` — real progressive tokens, first-chunk timeout, retry-before-first-chunk only
  - Graph tool flow: single LLM call per tool turn (`tool_call` → `executeTool` → `generate`), tool output fed back into the model (was: up to 5 calls, output ignored)
  - Multi-turn memory: session thread id + conversation history sent with each request (verified live: "What did I just ask you?" answered correctly)
  - Threading backend (threads API routes + persistence) kept behind the flag
  - `.env.vercel`: chat env block added (Gemini key is a placeholder — real key must be set in Vercel dashboard)
  - Tests: 1045 green at time of commit
- `e6970b1b` feat(chat): add maximize toggle and remove clear-chat trash button

### Earlier on this branch (from `b11d8442`)

- AI chatbot UI/UX overhaul (`5efe8140`, `d62ab0a2`, `e6970b1b`) — system prompt, modal/resume fixes, booking duration fix (`ae4dabeb`), resume caching (`62a09edd`)
- PWA: full offline experience — service worker with robust caching, `/offline` page, offline banner, manifest + icons, SW manifest generation in build (`dec8dc40` … `dc7335a9`)
- Home page: streaming SSR sticky 2-column layout (`f3ab4cb5`), sticky disabled when exceeding viewport (`2c7cb4cf`), count badges removed (`1e5b7e37`), slim scrollbar (`c64a2c9e`)
- Blog: cover/in-article images at natural aspect ratio (`f9788022`, `c25f3e6d`)
- Security: Next.js 16.2.12 upgrade (`39f1635f`), bot blocking, rate limiting, canary routes, CSP hardening
- Tests: large coverage program (EPIC-1..11) — 115 test files, 1043 tests green
- Dev workflow guardrails: husky pre-commit/commit-msg hooks, commitlint, lint-staged, loop engineering (STATE.md/LOOP.md), CodeRabbit config

## Deployment to Vercel — verified workflow

### How it deploys

1. Work happens on `dev`. Commits are quality-gated (tests, tsc, lint, react-doctor).
2. Merge `dev` → `main` via PR (rebase + fast-forward; branch protection forbids merge commits).
3. GitHub Actions `.github/workflows/deploy.yml` detects `portfolio-v1/**` changes and calls `.github/workflows/vercel-deploy-v1.yml`:
   - Node 22, `npm ci --ignore-scripts`, `npm rebuild`
   - `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod`
4. Live site updates at https://namias.tech.

### Verification already done (this branch)

- `next build` (the exact Vercel build command from `vercel.json`) passes locally — compiled in ~30s, 43 static pages generated, no errors
- `npx tsc --noEmit` — clean
- `npm run lint` — clean (1 pre-existing warning in Analytics.test.tsx, not a blocker)
- `npm run test -- --run` — 1043 tests / 115 files green
- `npx react-doctor` — unchanged score (59/100, 3 pre-existing warnings, not gated on threshold)
- `vercel.json` — framework `nextjs`, `buildCommand: next build`, `installCommand: npm install`, regions `hnd1`, clean URLs, security headers
- PWA: `public/sw.js` + `site.webmanifest` tracked in git; `sw-assets.json` is generated and not referenced at runtime (no deploy gap)

### Required GitHub Actions secrets (Settings → Secrets and variables → Actions)

| Secret | Purpose |
| ------ | ------- |
| `VERCEL_TOKEN` | Vercel API token (full access or limited-scope deploy) |
| `VERCEL_ORG_ID` | Vercel team/project org id (`vercel pull` links the project) |
| `VERCEL_PROJECT_ID` | The portfolio-v1 Vercel project id |

If these are already set from previous deploys, nothing to do.

### Required Vercel env vars (Dashboard → Settings → Environment Variables)

Authoritative reference file: `portfolio-v1/.env.vercel` (do not copy the root `.env.vercel` — it is stale). Critical ones for the chatbot and site:

| Var | Value | Needed for |
| --- | ----- | ---------- |
| `GOOGLE_GEMINI_API_KEY` | real key (never commit) | AI chatbot answers + RAG embeddings |
| `SANITY_API_READ_TOKEN` | real token | CMS content at build + runtime |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `nl0qw78w` | CMS client |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | CMS client |
| `NEXT_PUBLIC_SITE_URL` | `https://namias.tech` | SEO/OG images, security headers |
| `SANITY_REVALIDATE_SECRET` | real secret | Sanity webhook revalidation |
| `SANITY_MEDIA_GATEWAY_SECRET` | real secret | media gateway route |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` / `_DOMAINS` | real values | analytics |
| `CHAT_PROVIDER_*` | defaults in file | chat provider fallback tuning |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | optional | secondary chat provider |
| `UPSTASH_VECTOR_URL` / `UPSTASH_VECTOR_TOKEN` | optional | RAG knowledge base |

### Post-deploy smoke test

1. Open https://namias.tech — home page renders with profile + hero
2. Open the AI chatbot, ask "What can you do?" — tokens stream progressively (real Gemini answer, not canned text)
3. Ask "Calculate 15 plus 30" — tool flow returns "45" in one pass
4. Ask a follow-up "What did I just ask?" — model remembers (multi-turn memory)
5. Verify no "Conversations" button appears in the chat panel
6. Check https://namias.tech/api/security-headers returns the header set
7. Offline test: load the site, disconnect, reload — PWA serves cached shell

## How to update this file

Every update on `dev` should land in PR.md so the PR description stays complete:

```powershell
# after committing a change:
cd <repo root>
scripts/append-pr-update.ps1          # appends last commit to PR.md
git add PR.md
git commit -m "docs(pr): update PR.md with latest change"
```

The script appends a dated, bulleted entry built from the latest commit message. You may edit the entry before committing if more context is needed.

### 2026-08-02 - Update

  - b7dcf82e fix(chat): hide conversation/threading UI and auto-reset chat every hour
  - IS_CHAT_THREADING_ENABLED=false: Conversations toggle + sidebar no longer
  - render anywhere (gated code stays for future re-enable)
  - FloatingHub: clears messages after 1h of inactivity, fresh welcome message
  - reappears; no manual delete required from users
  - ChatPanel.streaming test rewritten for hidden threading (session thread id,
  - no threads API calls); new FloatingHub test covers the hourly reset
  - Verified: 1043 tests green, tsc --noEmit clean, eslint clean