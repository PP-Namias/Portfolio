# PR: Portfolio V1 — New Features, AI Chatbot Overhaul & Production Hardening

Single accumulating PR description for branch `dev` (target: `main`, deploy: Vercel https://namias.tech). Every update on this branch lands here so the PR always tells the full story. See "How to update" at the bottom.

## Suggested PR title

```
feat(v1): AI chatbot with real-time streaming + PWA offline support + production security hardening
```

## Impact summary

| # | Headline feature | What it does for visitors |
| - | ---------------- | ------------------------- |
| 1 | **AI chatbot that actually works** | Real-time token streaming answers, remembers conversation context, runs tools (calculator, web search, stock quotes, portfolio Q&A) in a single pass — one call, instant answers |
| 2 | **Privacy-first ephemeral chat** | Conversations auto-clear after 1 hour of inactivity — zero stored history, zero manual cleanup, fresh session every time |
| 3 | **Installable PWA with offline mode** | Full offline support: cached shell, offline fallback page, app icons + web manifest — works without internet |
| 4 | **Production security hardening** | Bot blocking, global rate limiting, canary honeypot routes, strict security headers, timing-safe secrets, Next.js 16.2.12 security line |
| 5 | **Engineered for safety** | 1,043 automated tests, CI quality gates (typecheck, lint, react-doctor), AI code review, commit guardrails |

## What's new — feature catalog

### 1. AI Chatbot (headline feature)

**Real-time streaming answers** (`666d42aa`)
- True token-by-token streaming via Gemini `generateContentStream` — answers appear progressively, not as one delayed blob
- Live-verified: multi-word responses stream in word-by-word
- Robust stream handling: first-chunk timeout, retry-before-first-chunk, no retries after partial output, bounded fallback (config + circuit breaker)
- Provider chain: Gemini → optional OpenAI → smart in-app fallback so the chat always answers

**Multi-turn conversation memory** (`666d42aa`)
- The chatbot remembers what was said earlier in the session — live-verified: "What did I just ask you?" was answered correctly from history
- Session-scoped thread id keeps context without any server-side storage

**AI tool calling in one pass** (`666d42aa`)
- Tools available: calculator, web search, live stock price lookup, portfolio knowledge query
- Single-pass flow: `tool_call` → `executeTool` → `generate` — the tool result is fed back to the model in the same turn and the answer reflects the real computation
- Live-verified: "Calculate 15 plus 30" streams back "15 plus 30 is 45"

**Ephemeral privacy sessions** (`b7dcf82e`)
- Conversations automatically start fresh after 1 hour of inactivity — the welcome message returns on its own
- No saved chat history, no user data retained, no manual cleanup ever needed

**Chat panel UX** (`e6970b1b`, `5efe8140`, `d62ab0a2`)
- Maximize toggle for the chat panel
- Improved system prompt, polished typing indicators, tool-call status feedback
- Resilience: availability detection, graceful error handling, offline-aware behavior

### 2. PWA & Offline experience

- Full offline support: service worker with robust caching strategies (shell, pages, images, fonts) (`dec8dc40`)
- Dedicated `/offline` fallback page so visitors never see a dead screen (`755f9c88`)
- Offline banner that appears only when truly disconnected — silent when browsing cached content (`dc7335a9`, `64367dc0`)
- Installable PWA: web app manifest, apple-touch icons, generated raster icon set (`0d9de0c4`, `ce96d93a`)
- Automated SW asset manifest generation wired into the build pipeline (`b8edad00`)
- `useNetworkStatus` hook + `ServiceWorkerManager` for clean registration/lifecycle (`2a8f3400`, `778a1484`)

### 3. Home page & design

- Streaming SSR home page: per-section progressive HTML rendering as data resolves (`f3ab4cb5`)
- Smart adaptive 2-column layout that stays usable at any viewport height (`2c7cb4cf`)
- Slim site-wide scrollbar with accent thumb (`c64a2c9e`)

### 4. Blog & content

- Cover and in-article images render at natural aspect ratio, centered — no more cropping/distortion (`f9788022`, `c25f3e6d`)
- Blog content pipeline (local-first Markdown ⇄ Sanity sync) with lifecycle skills (create → review → sync → publish) (`53484734`–`315b2435`)

### 5. Security hardening

- Next.js 16.2.12 security patch line upgrade (`39f1635f`)
- Bot blocking with HTTP 418 responses + scan pattern detection (incl. nuclei) (`cbd3adee`, `7ff021bd`, `b4e820cd`)
- Global rate limiting on API routes with in-memory + Upstash Redis backends (`48d5861c`, `3e04e774`, `007b662a`)
- Canary honeypot routes (`/wp-admin-canary`, `/phpmyadmin-canary`, canary robots/sitemap) that detect scanners, with automated test coverage (`73628fbf`, `841111b5`)
- Strict CSP + security headers via `next.config.js` (incl. NEL, CORP, COOP, Permissions-Policy) with route tests (`d1ee2660`)
- Timing-safe admin secret verification for admin APIs (`src/lib/admin.ts`)
- SHA-pinned CI actions, secrets isolated from dependency installs (`e5738ecf`, `eccc30eb`)

### 6. Engineering, quality & developer experience

- **1,043 automated tests across 115 test files** — full suite green; coverage program EPIC-1..11 (`2001d320`)
- Quality gates wired into CI: TypeScript strict, ESLint 9 flat config, react-doctor (100/100 target gate) (`602d9468`)
- CodeRabbit AI code review on every PR (`.coderabbit.yaml` + GitHub App config)
- Commit guardrails: husky pre-commit/commit-msg hooks, commitlint, lint-staged (`cc7ba508`, `97340ea3`)
- Loop engineering: automated maintenance loops (daily triage, PR babysitter, dependency sweeper) with kill switch (`cb214cd0`)
- PentestAgent security testing pipeline + playbooks under `docs/security/pentestagent/`
- Full PRD backlog: `docs/prd/*.json` for chatbot, blog pipeline, react-doctor, loop engineering, system audits (`e6970b1b`, `845b66e6`, `a01c11e6`)

## Deployment to Vercel — verified workflow

### How it deploys

1. Work happens on `dev` (this branch). Every commit is quality-gated (tests, typecheck, lint, react-doctor).
2. Merge `dev` → `main` with a PR (branch protection enforces rebase + fast-forward).
3. GitHub Actions `.github/workflows/deploy.yml` detects `portfolio-v1/**` changes and calls `.github/workflows/vercel-deploy-v1.yml`:
   - Node 22, `npm ci --ignore-scripts`, `npm rebuild`
   - `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod`
4. Live site updates at https://namias.tech.

### Verification already performed (this branch)

- `next build` (the exact Vercel build command from `vercel.json`) — **passes**: compiled clean, TypeScript check passed, 43/43 static pages generated
- `npx tsc --noEmit` — clean
- `npm run lint` — clean (1 pre-existing warning, not a blocker)
- `npm run test -- --run` — 1,043 tests green (115 files)
- `npx react-doctor` — no new findings (59/100, 3 pre-existing warnings, not gated)
- `vercel.json` — framework `nextjs`, `buildCommand: next build`, `installCommand: npm install`, region `hnd1`, clean URLs, security headers
- PWA files (`public/sw.js`, `public/site.webmanifest`) tracked in git — no missing deploy artifacts

### Required GitHub Actions secrets

| Secret | Purpose |
| ------ | ------- |
| `VERCEL_TOKEN` | Vercel API token for CLI deploys |
| `VERCEL_ORG_ID` | Vercel org id (project linking) |
| `VERCEL_PROJECT_ID` | portfolio-v1 project id |

If already set from previous deploys — nothing to do. Check: GitHub → Settings → Secrets and variables → Actions.

### Required Vercel env vars (Dashboard → Settings → Environment Variables)

Authoritative reference: `portfolio-v1/.env.vercel` (the root-level `.env.vercel` is stale — ignore it).

| Var | Needed for |
| --- | ---------- |
| `GOOGLE_GEMINI_API_KEY` (real key) | AI chatbot answers + RAG embeddings — **the one piece that makes the chatbot real in production** |
| `SANITY_API_READ_TOKEN` | CMS content at build + runtime |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` | CMS client (`nl0qw78w` / `production`) |
| `NEXT_PUBLIC_SITE_URL` | `https://namias.tech` — SEO, OG images, security headers |
| `SANITY_REVALIDATE_SECRET` | Sanity webhook revalidation |
| `SANITY_MEDIA_GATEWAY_SECRET` | media gateway route |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` / `NEXT_PUBLIC_UMAMI_DOMAINS` | analytics |
| `CHAT_PROVIDER_TIMEOUT_MS` / `MAX_RETRIES` / `RETRY_BASE_MS` | chat resilience tuning (defaults are safe) |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | optional secondary chat provider |
| `UPSTASH_VECTOR_URL` / `UPSTASH_VECTOR_TOKEN` | optional RAG knowledge base |

### Post-deploy smoke test

1. Open https://namias.tech — home page renders with profile + hero
2. Open the AI chatbot → ask "What can you do?" → tokens stream progressively (real Gemini answer)
3. Ask "Calculate 15 plus 30" → answer includes the computed result (tool flow)
4. Ask "What did I just ask you?" → model recalls the context (multi-turn memory)
5. Confirm no saved-conversations UI appears (ephemeral mode on)
6. Install check: browser shows PWA install prompt / manifest resolves at `/site.webmanifest`
7. `https://namias.tech/api/security-headers` returns the hardened header set
8. Offline: load the site, go offline, reload — cached shell serves

## How to update this file

Every update on `dev` lands in PR.md so the PR description stays complete:

```powershell
# after committing a change:
cd <repo root>
scripts/append-pr-update.ps1          # appends last commit as a dated entry
git add PR.md
git commit -m "docs(pr): update PR.md with latest change"
```

Notes for keeping it smart:

- Keep the **feature catalog** as the source of truth: describe features as what users can now do (positive framing). Do not document removals, deletions, or refactors — only added capabilities.
- Update the **deployment checklist** whenever env vars or the deploy path change.
- When opening the PR, use this file as the description (ASCII-safe): `gh pr create --body-file PR.md`.

### 2026-08-03 - Update

  - 7abfda2a fix(ci): harden dependency installs to satisfy secret-boundary rule
  - pr-validation: npm ci --ignore-scripts in both jobs
  - security-compliance: npm ci --ignore-scripts before build with secrets
  - problem-detection-advisor: drop npm command literals from advice text
  - Reacts to react-doctor build-pipeline-secret-boundary findings; verified
  - npm rebuild removal is safe (sharp/esbuild/fsevents ship prebuilt binaries)
  - Verified: doctor:check 100/100, 1050 tests, tsc, lint
### 2026-08-03 - Update

  - a4cd56d4 feat(studio): add Discord option to social platform dropdown

### 2026-08-03 - Update

  - bb4a1295 fix(hero): remove ambiguous availability indicator
  - Drop the pulsing green dot + 'Available' badge from the hero
  - (location/socials line); the label had no context and conveyed
  - nothing actionable
  - availabilityLabel stays in CMS/state plumbing for future use
  - Verified live: badge gone from SSR; tsc, lint, 33 hero-adjacent
  - tests pass
### 2026-08-04 - Update

  - bd9c9429 docs(realtime): add architecture doc and mark PRD implemented
  - S-5.1: portfolio-v1/docs/REALTIME_SANITY.md - flow diagram, server/client
  - component tables, env vars (SANITY_REVALIDATE_SECRET,
  - NEXT_PUBLIC_SANITY_LIVE_POLL_MS, E2E_CMS_FILE), unit + E2E test
  - commands, dashboard webhook setup recap, known RAG 422 noise note
  - S-5.2: prd.realtime-sanity.json bumped to 1.0.0, all epics/stories/
  - phases marked done, lastUpdated 2026-08-04 (minimal token diff)
  - Verified: JSON parses, no code touched
### 2026-08-05 - Update

  - f03ba670 feat(seo): deploy static og-image.png with absolute OG/Twitter URLs
  - Remove runtime opengraph-image/twitter-image routes (edge Google-Font fetch 500s)
  - Add public/og-image.png (1200x630) rendered by scripts/render-og-image.cjs via Playwright
  - Point root layout, blog/projects layouts, providers, SectionProvider, and fallback
  - seo data at /og-image.png with absolute SITE_URL everywhere
  - Update site title/description to 'Jhon Keneth Ryan B. Namias | Full Stack Engineer &
  - AI Specialist' and root og:image alt to the Person long-form name
  - Delete obsolete public/og-image.svg (invisible to link preview scrapers); gitignore .og-render-tmp/
  - Rewrite og-image.test.ts to validate the static PNG (sig, 1200x630, >= platform mins);
  - fix app-metadata.test.ts mocks (next/font, cms-content, seo.server, per-test features)
  - Verified: vitest 1085 passed, tsc --noEmit, npm run lint, doctor:check 100/100 all green
### 2026-08-05 - Update

  - 7ad17df3 feat(seo): exact-match image alts on hero and profile avatars
  - Hero profile image alt now uses PERSON_IMAGE_ALT
  - ('Jhon Keneth Ryan B. Namias - Full Stack Engineer & AI Automation Specialist'),
  - the exact-match keyword string already used by the Person JSON-LD ImageObject
  - and the root og:image alt, keeping alt text consistent across head and body
  - ChatPanel (header + empty state) and HubMenu floating-hub avatars switched
  - from alt={profile.name} to the same exact-match alt
  - Hero keeps priority + fetchPriority="high" (Next.js priority renders
  - loading="eager" fetchpriority="high" in the DOM)
  - Semantic filenames: repo already ships semantic static assets (og-image.png,
  - icons, favicon); Sanity-hosted images keep hash-based CDN URLs that can only
  - be renamed via CMS asset management, documented as a manual follow-up
  - Update sections-uncovered hero test: assert exact-match alt renders and the
  - img carries fetchpriority="high"
  - Verified: vitest 1085 passed, tsc --noEmit, npm run lint, doctor:check 100/100
### 2026-08-05 - Update

  - 5791368b feat(seo): add robots.txt route explicitly allowing web and AI crawlers
  - Add src/app/robots.ts (Next.js MetadataRoute.Robots):
  - catch-all '*' allow rule
  - explicit allow group for Googlebot, Googlebot-Image, Bingbot, DuckDuckBot
  - explicit allow group for AI/answer-engine crawlers: GPTBot, OAI-SearchBot,
  - PerplexityBot, anthropic-ai, ClaudeBot, Claude-Web, Google-Extended
  - Sitemap directive pointing at https://namias.tech/sitemap.xml
  - Dynamic sitemap.ts already covers all portfolio routes (home, /projects,
  - /blog + posts, and project detail pages when the revamp flag is on)
  - Leave canary honeypot decoys (robots-canary.txt, sitemap-canary.xml) untouched
  - Add robots.test.ts covering catch-all, web crawler group, AI crawler group,
  - and sitemap reference (4 tests)
  - Verified: vitest 1089 passed, tsc --noEmit, npm run lint, doctor:check 100/100
### 2026-08-06 - Update

  - cac3a753 fix(seo): retire stale og-image.svg references and static robots.txt
  - Delete public/robots.txt so the new src/app/robots.ts route serves (static
  - file takes precedence over the route in Next.js; content was stale)
  - sw.js: precache /og-image.png instead of the deleted svg, bump CACHE_VERSION
  - v5 -> v6 so browsers reinstall the service worker and drop the 404 entry
  - generate-sw-manifest.mjs: BASE_ASSETS now /og-image.png
  - next.config.js: images.localPatterns and header route point at og-image.png
  - with immutable caching
  - site.webmanifest: PWA screenshot entry now the real PNG (1200x630)
  - seed-site-settings.ts: Sanity seed uploads og-image.png, not the deleted svg
  - docs/performance/dashboard.md: cache-layer table row updated
  - Pre-PR audit sweep: realtime chain (live route + webhook + useSanityLiveRefresh
  - polling) verified end-to-end with 44 targeted tests; no stale references to
  - og-image.svg / opengraph-image / twitter-image / sw.js in workflows or src
  - Verified: vitest 121 files/1089 passed, tsc --noEmit, npm run lint (0 errors),
  - doctor:check 100/100 all green

### 2026-08-08 - Update

  - 33cbc2e1 chore(hooks): activate husky + lint-staged zero-defect git hooks
  - Root package.json (private dev tooling) + prepare: husky so clones
  - auto-install hooks; pins husky 9.1.7, lint-staged 17.0.8, commitlint
  - 21.1.0, prettier 3.9.0 (all were ad-hoc in root node_modules)
  - Fixed core.hooksPath -> .husky/_ (was pointing at dead .githooks stub
  - that only echoed text; deleted the stub dir)
  - pre-commit: lint-staged only (eslint --fix + prettier --write on staged
  - portfolio-v1 files per .lintstagedrc.json globs) + optional gitleaks;
  - full-project tsc moved out of the commit path for speed
  - pre-push: full tsc --noEmit + full vitest run (1089 tests) gate
  - commit-msg: commitlint conventional commits now actually enforced
  - Dry-run verified: intentional rules-of-hooks violation blocked the
  - commit (husky exit 1, no commit created); corrected file passed
  - Verified: lint-staged + commitlint ran on the setup commit itself

### 2026-08-08 - Update

  - 26674180 feat(seo): add llms.txt for AI crawlers and expand Knowledge Graph JSON-LD
  - public/llms.txt: RAG-optimized Markdown per llms.txt spec (title + > URL
  - blockquote) - identity, roles, Caloocan City PH, full stack + AI automation
  - competencies, Klaro, M.A.S.H., Aeternitas/Wilshire/PhoneCraft roles, education
  - Linked in <head> via metadata alternates.types
  - (<link rel='alternate' type='text/markdown' href='/llms.txt' />)
  - Person JSON-LD: + address (PostalAddress), knowsLanguage, description,
  - disambiguatingDescription, mainEntityOfPage, ImageObject @id
  - WebSite JSON-LD: + inLanguage, publisher/about graph edges to Person
  - knowsAbout expanded: autonomous agents, n8n, IoT, Raspberry Pi, Arduino
  - Verified: vitest 122 files/1098 tests pass, tsc clean, lint 0 errors,
  - doctor 100/100

### 2026-08-08 - Update

  - 0ca0dfe9 feat(docker): containerize monorepo with compose, k8s, and CI/CD
  - Dockerfiles: portfolio-v1 (Next.js standalone, non-root, port 3000),
  - ai-service (Hono+LangGraph, tsx, port 8787, writable .ai-service-data
  - volume, /api/health healthcheck), studio (Sanity, port 3333)
  - Fixed broken COPY context paths in studio/Dockerfile
  - Fixed portfolio-v1/.dockerignore: kept package-lock.json for npm ci,
  - kept scripts/generate-sw-manifest.mjs for the build
  - docker-compose.yml (dev): hot-reload volume mounts, ai-data named
  - volume, shared bridge network, healthchecks, resource limits
  - docker-compose.prod.yml (prod): runner targets, read_only + tmpfs,
  - no-new-privileges, nginx proxy on 8080 routing / -> v1:3000 and
  - /api/ai/* -> ai-service:8787 (/ai stripped, SSE proxy_buffering off)
  - .env.docker.example with full env key set (gitignored .env.docker)
  - Kubernetes: namespace, configmap, secrets-template, deployments,
  - services, ingress (namias.tech, /api/ai regex rewrite, TLS)
  - GitHub Actions: ci.yml matrix gate, deploy-frontends.yml dual
  - Vercel+Cloudflare, docker-publish.yml ghcr.io builds with gha cache
  - README: Cloud Infrastructure & DevOps section (ports, launch
  - commands, k8s, CI/CD table, secrets guide, dual-deploy model)
  - Validated: compose config -q (dev+prod), YAML parse of all k8s and
  - workflow files (deployments/services multi-doc confirmed)

### 2026-08-08 - Update

  - f713b160 fix(git): repair pre-push hook and cover all workspace packages
  - Live dry-run push proved the '/usr/bin/env: bash' transcript was stale;
  - real blocker: a zombie next dev process truncated .next/dev/types typegen
  - files that tsc --noEmit picks up via tsconfig include (TS1435/TS1128)
  - Killed stale node/next processes, rebuilt .next from scratch
  - Extended .husky/pre-push: typechecks portfolio-v1 + ai-service + studio
  - (portfolio-v2 excluded), then full vitest suite
  - Verified: git push --dry-run origin dev passes end to end (3 typechecks
  - + 122 files / 1098 tests, all green)

### 2026-08-08 - Update

  - c1a0c28b chore(git): pin .husky and container files to LF via .gitattributes
  - core.autocrlf=true would check out hooks as CRLF on Windows and
  - resurrect the '/usr/bin/env: bash' shebang failure on other machines
  - .gitattributes pins .husky/*, *.sh, Dockerfile*, **/.dockerignore to
  - text eol=lf; verified pre-push worktree is LF after re-checkout
### 2026-08-09 - Update

  - 554ed340 fix(git): harden husky PATH fallback and enforce LF on husky shims
  - .gitattributes: add .husky/_/* text eol=lf so husky-generated shims
  - stay LF on Windows checkouts (autocrlf=true would otherwise rewrite
  - them to CRLF and break the shebang interpreter)
  - pre-push/pre-commit: resolve node/npx from common Windows install
  - paths (/c/Program Files/nodejs, LOCALAPPDATA nodejs, /usr/local/bin)
  - when PATH is stripped by GUI git clients (VS Code, GitHub Desktop)
  - All hooks audited byte-level: 0 CRLF, #!/bin/sh shebangs
  - Verified: real push fires the full pre-push gate (3 typechecks + 1098
  - tests) and completes without code 127
### 2026-08-09 - Update

  - 4c9e3615 fix(seo): harden utility-route metadata, fix h1 landmarks, wire CMS og:image, upgrade blog schema
  - admin/canary: replace ignored next/head robots meta (App Router drops it) with a server layout exporting metadata; page was crawlable and canonicalized to the home page. Now noindex + unique title
  - offline + studio: give both routes unique titles/descriptions/canonicals (previously inherited home metadata); robots.txt now disallows /admin, /offline, /studio for all crawlers
  - projects/[slug]: align title suffix with the rest of the site; add <main> landmark around the article
  - root layout: og:image/twitter:image now come from Sanity siteSettings (ogImageUrl/twitterImageUrl) with /og-image.png fallback instead of being hardcoded
  - blog posts: JSON-LD upgraded Article -> BlogPosting with mainEntityOfPage, url, publisher; drop fake dateModified
  - error/not-found boundaries under /blog and /projects: h2 -> h1 so every document has exactly one h1
  - Verified: lint 0 errors, tsc clean, 35 affected tests pass, doctor 100/100, curl checks on all routes