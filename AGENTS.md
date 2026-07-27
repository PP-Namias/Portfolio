# Agent guide

This file is the entry point for any agent (opencode, future coding agents, or human contributors) working on the PP Namias portfolio. It captures the repo's working agreements, the available skills, and the most common workflows.

## Skills

### Content Management

- `add-an-experience`, `add-a-project`, `add-a-certification`, `add-a-blog-post` — content workflows
- `update-the-hero` — hero block editing
- `blog-create`, `blog-edit`, `blog-review`, `blog-sync`, `blog-publish` — local-first blog content lifecycle
- `sanity-data-operations` — Sanity schema changes, data migrations, debugging queries, revalidation
- `sanity-schema-validator` — validates Sanity schemas against best practices, catches common issues
- `sanity-content-audit` — audits Sanity content for completeness, consistency, and quality
- `sanity-migration-helper` — helps write, validate, and run Sanity data migrations safely
- `sanity-groq-optimizer` — analyzes and optimizes GROQ queries for better performance
- `sanity-backup-restore` — backup and restore Sanity content and schemas

### Frontend Development

- `frontend-design` — build beautiful, responsive, accessible UIs with React, Tailwind, and Framer Motion
- `ui-ux-pro-max` — design system intelligence
- `component-api-scaffolding` — create React components, API routes, SWR hooks, context providers
- `pwa-service-worker` — service worker management, offline support, PWA manifest, cache strategies
- `react-patterns` — advanced React patterns, hooks, and best practices
- `nextjs-app-router` — Next.js App Router patterns, data fetching, and optimization

### Quality & Testing

- `run-react-doctor` — how to read the react-doctor report, the 12-rule catalog, the score model
- `fix-react-doctor-finding` — step-by-step fix workflow for one finding
- `code-review` — systematic review of TypeScript, React, accessibility, performance, and security
- `testing-workflow` — write and maintain tests with Vitest and React Testing Library
- `accessibility-audit` — audit and fix WCAG 2.1 AA accessibility issues
- `performance-optimization` — improve Core Web Vitals, load times, and runtime performance
- `performance-auditing` — Lighthouse audits, bundle analysis, image/font optimization, Core Web Vitals

### Security & DevOps

- `run-pentestagent` — how to set up, configure, and run PentestAgent AI security scans against the portfolio
- `deployment-infrastructure` — deploy to Vercel/Cloudflare, manage env vars, troubleshoot builds, rollbacks
- `debugging-error-tracking` — systematic debugging for console errors, hydration, network, performance
- `seo-optimization` — meta tags, JSON-LD structured data, sitemaps, social previews

### AI Chatbot

- `ai-chatbot` — LangGraph chatbot: graph engine, tools, SSE streaming, thread management, persistence. Core files in `src/lib/chat/`, `src/hooks/use-chat-stream.ts`, thread API routes, `ChatPanel`/`ThreadSidebar`/`FloatingHub` UI. Gate behind feature flags in `src/lib/features.ts`. Docs at `portfolio-v1/docs/chatbot/ARCHITECTURE.md`.

### API & Backend

- `api-design` — REST API patterns, validation, error handling, rate limiting
- `webhook-design` — webhook implementation, signature verification, event-driven architecture

### Infrastructure & DevOps

- `cloudflare-workers` — Cloudflare Workers with OpenNext adapter, R2, KV, D1, edge computing
- `code-migration` — framework and library migration strategies (Next.js 16, Sanity, OpenNext)
- `dependency-audit` — security vulnerability scanning, licensing, maintenance
- `opennext-cloudflare` — deploy Next.js to Cloudflare Workers using OpenNext adapter
- `nextjs-16-migration` — migrate from Next.js 15 to 16 and handle breaking changes

### Security

- `csp-security-headers` — configure Content Security Policy and security headers
- `canary-token-system` — manage canary token honeypot system for detecting scanners

### Analytics & Features

- `analytics-integration` — Umami analytics setup, tracking, and insights
- `feature-flags` — feature flags for gradual rollouts and A/B testing

### Documentation & Quality

- `technical-writing` — documentation, READMEs, developer guides
- `orchestrator` — coordinate multi-step tasks across multiple skills
- `impeccable` — quick repo-hygiene and consistency checks
- `git` — git workflow, branch strategy, commit hygiene
- `content-review` — review copy and documentation for clarity
- `ci-cd-security` — CI/CD pipeline security and automation

### OpenCode & MiMo v2.5 Optimization

- `mimo-workflow` — optimized workflows for OpenCode IDE with MiMo v2.5 free model
- `opencode-optimization` — optimize OpenCode IDE configuration and workflows
- `fullstack-workflow` — end-to-end full-stack development workflow for Next.js
- `typescript-advanced` — advanced TypeScript patterns and type safety

## Subagents

Specialized agents for different domains. Use the right agent for the task.

| Agent        | File                            | Purpose                                   |
| ------------ | ------------------------------- | ----------------------------------------- |
| **Frontend** | `.agents/subagents/frontend.md` | React, Next.js, Tailwind, Framer Motion   |
| **Backend**  | `.agents/subagents/backend.md`  | API routes, server logic, data operations |
| **Content**  | `.agents/subagents/content.md`  | Sanity CMS, schemas, GROQ queries         |
| **Security** | `.agents/subagents/security.md` | Security audits, vulnerability scanning   |
| **DevOps**   | `.agents/subagents/devops.md`   | Deployment, CI/CD, monitoring             |
| **AI**       | `.agents/skills/ai-chatbot/SKILL.md` | LangGraph chatbot, tools, streaming, threads |

## Workflows

Standardized workflows for common tasks. Follow these for consistency.

| Workflow          | File                                         | When to Use                      |
| ----------------- | -------------------------------------------- | -------------------------------- |
| **Bug Fix**       | `.agents/workflows/bug-fix.md`               | Finding and fixing bugs          |
| **Feature Dev**   | `.agents/workflows/feature-development.md`   | Implementing new features        |
| **Code Review**   | `.agents/workflows/code-review.md`           | Reviewing code changes           |
| **Portfolio Dev** | `.agents/workflows/portfolio-development.md` | Portfolio-specific development   |
| **MiMo Prompts**  | `.agents/workflows/mimo-prompt-guide.md`     | Optimizing prompts for MiMo v2.5 |

## Home page sections

- `BlogSection` (`src/components/sections/BlogSection.tsx`) — compact list of the latest 3 blog posts shown side-by-side with `CertificationsSection` on the home page. Gated by `IS_BLOG_VISIBLE` in `src/lib/features.ts`. Plan: `docs/prd/prd.blog.json`.
- `ProjectsSectionRevamped` (`src/components/sections/ProjectsSectionRevamped.tsx`) — dual-tab project index (Live Projects / Showcase) with flat cards, sliding tab indicator, expand/collapse, and keyboard navigation. Gated by `IS_PROJECTS_REVAMP_ENABLED` in `src/lib/features.ts`. When disabled, the original `ProjectsSection` renders. Plan: `docs/prd/prd.projects-revamp.json`.
- `ProjectDetailPage` (`src/components/sections/ProjectDetailPage.tsx`) — full detail page for showcase projects at `/projects/[slug]`. Includes hero image, challenge/solution/result, highlights, tech stack, gallery, and JSON-LD structured data. ISR-cached with 1-hour revalidation.

## React quality gate

- Tool: `react-doctor@0.5.8` (pinned to exact version in `package.json`)
- Config: `doctor.config.json` at the repo root
- Scripts: `npm run doctor`, `npm run doctor:json`, `npm run doctor:check`, `npm run doctor:baseline`, `npm run doctor:diff`
- CI gate: `.github/workflows/react-doctor.yml` (threshold = 0 findings = 100/100)
- Scoreboard: `docs/react-doctor/scoreboard.md`
- Find the canonical fix pattern for each rule in the `run-react-doctor` skill

If you change code in `src/**` and the score drops, follow `fix-react-doctor-finding` and commit the fix in the same PR.

## Security testing (PentestAgent)

- Tool: [PentestAgent](https://github.com/GH05TCREW/pentestagent) — AI agent framework for black-box security testing
- Config: `docs/security/pentestagent/config/`
- Playbooks: `docs/security/pentestagent/playbooks/` (recon, XSS, CSRF, SSRF, injection, API fuzz, rate limiting, and more)
- Setup: `scripts/setup-pentestagent.ps1` (Windows) or `scripts/setup-pentestagent.sh` (Unix)
- CI gate: `.github/workflows/pentestagent-ci.yml`, `.github/workflows/pentestagent-scheduled.yml`, `.github/workflows/pentestagent-pr-check.yml`
- Dashboard: `docs/security/dashboard.md`
- Skill: `run-pentestagent`

Local Python 3.8 is insufficient (3.10+ required). The CI pipeline is the primary execution environment. See the `run-pentestagent` skill for setup and playbook execution instructions.

## Commit hygiene

- One commit per story slice; commit every update
- Message subject: `type(scope): <imperative summary>`
- Body: bullet list of what changed, why, and what was verified (vitest run, doctor run, type check, lint)
- Branch protection on `main` forbids merge commits — rebase and ff
- ASCII-safe PR descriptions; use `--body-file` to avoid PowerShell escape corruption

## Code conventions

- TypeScript strict; `npx tsc --noEmit` must pass
- ESLint 9 flat config (`eslint.config.mjs`); `npm run lint` must pass
- No comments in code unless asked
- Follow the patterns established for: SWR for component-scoped data, `<JsonLd>` for JSON-LD, sandbox attribute on every iframe, stable React keys from data, `useMemo` on Context.Provider values

## Blog Content Pipeline

Local-first blog content system. All posts live as `.md` files in `content/blog/`.

### Content directory

- `content/blog/{slug}.md` — one file per post with YAML frontmatter
- Frontmatter schema: `scripts/lib/frontmatter-schema.ts` (zod)
- Types: `src/types/blog.ts` (Frontmatter interface)

### Sync scripts

- `npm run blog:diff` — compare local vs Sanity
- `npm run blog:pull` — pull from Sanity to local
- `npm run blog:push` — push local to Sanity (dry-run by default)
- `npm run blog:import` — one-time import from Sanity

### Workflow

1. Write/edit posts as local MD files (use `blog-create` / `blog-edit` skills)
2. Review with `blog-review` skill
3. Sync with `blog-sync` skill
4. Publish with `blog-publish` skill

## Vercel Web Interface Guidelines

All UI code must follow the [Vercel Web Interface Guidelines](docs/design/vercel-web-interface-guidelines.md).
Key rules:

- Must: Full keyboard support, visible focus rings, `:focus-visible`
- Must: Hit target ≥ 24px (mobile ≥ 44px)
- Must: Loading buttons with spinner & original label
- Must: URL reflects state (deep-link filters/tabs/pagination)
- Must: `touch-action: manipulation` on controls
- Must: Links use `<a>`/`<Link>` (never `<div onClick>`)
- Must: `prefers-reduced-motion` respected
- Must: Animate only `transform`/`opacity`; never `transition: all`
- Must: Images have explicit width/height (prevent CLS)
- Must: Honor `color-scheme` on `<html>` for dark themes
- Never: Disable zoom, block paste, `outline: none` without focus replacement
- Never: `<div>`/`<span>` with click handlers for navigation

Run the review command:

```
curl -fsSL https://vercel.com/design/guidelines/install | bash
```

Full reference: `docs/design/vercel-web-interface-guidelines.md`

## MCP (Model Context Protocol)

MCP servers give your AI agent access to browser DevTools, component libraries, and more. Configuration is at `opencode.json` at the repo root.

### Core MCP Servers

| Server                  | Config key            | Purpose                                                                |
| ----------------------- | --------------------- | ---------------------------------------------------------------------- |
| **Chrome DevTools MCP** | `chrome-devtools`     | Browser debugging, performance traces, screenshots, console inspection |
| **21st.dev Magic MCP**  | `@21st-dev/magic`     | Generate UI components from natural language (API key required)        |
| **Magic UI MCP**        | `@magicuidesign/mcp`  | Animated components (marquee, bento, dock, globe, etc.)                |
| **GitHub MCP**          | `github`              | Issues, PRs, repos, code search, file management                       |
| **Filesystem MCP**      | `filesystem`          | File read/write access with path restrictions                          |
| **Sequential Thinking** | `sequential-thinking` | Structured reasoning for complex problems                              |
| **Memory**              | `memory`              | Knowledge graph memory for persistent context                          |
| **Brave Search**        | `brave-search`        | Web search for documentation and API references                        |
| **Fetch**               | `fetch`               | Fetch and analyze web content                                          |
| **Puppeteer**           | `puppeteer`           | Advanced browser automation and screenshots                            |
| **SQLite**              | `sqlite`              | Local database for caching and analytics                               |
| **Sanity CMS**          | `sanity-cms`          | Direct Sanity CMS operations                                           |
| **Sentry**              | `sentry`              | Error tracking and performance monitoring                              |
| **Vercel**              | `vercel`              | Deployment, edge functions, and analytics                              |
| **Docker**              | `docker`              | Container management                                                   |

### LSP Servers

| Server           | Extensions                               | Purpose                                         |
| ---------------- | ---------------------------------------- | ----------------------------------------------- |
| **TypeScript**   | `.ts, .tsx, .js, .jsx`                   | Intelligent code completion and error detection |
| **ESLint**       | `.ts, .tsx, .js, .jsx`                   | Real-time linting and code quality              |
| **Prettier**     | `.ts, .tsx, .js, .jsx, .css, .json, .md` | Code formatting                                 |
| **Tailwind CSS** | `.ts, .tsx, .js, .jsx, .css`             | Class completion and validation                 |
| **HTML**         | `.html, .htm`                            | Markup validation and completion                |
| **CSS**          | `.css, .scss, .less`                     | Style validation and completion                 |
| **JSON**         | `.json, .jsonc`                          | Schema validation and completion                |
| **Markdown**     | `.md, .mdx`                              | Documentation editing                           |
| **GraphQL**      | `.graphql, .gql`                         | Schema validation and completion                |
| **YAML**         | `.yaml, .yml`                            | Configuration file validation                   |
| **Dockerfile**   | `Dockerfile`                             | Container configuration                         |
| **Prisma**       | `.prisma`                                | Schema validation                               |

## Agent Routing

### By Task Type

| Task              | Primary Skill               | Secondary Skills                                              |
| ----------------- | --------------------------- | ------------------------------------------------------------- |
| **New Component** | `component-api-scaffolding` | `frontend-design`, `ui-ux-pro-max`                            |
| **API Endpoint**  | `api-design`                | `webhook-design`                                              |
| **Bug Fix**       | `debugging-error-tracking`  | `code-review`, `testing-workflow`                             |
| **Performance**   | `performance-optimization`  | `performance-auditing`                                        |
| **Security**      | `run-pentestagent`          | `dependency-audit`, `ci-cd-security`, `csp-security-headers`  |
| **Deployment**    | `deployment-infrastructure` | `cloudflare-workers`, `opennext-cloudflare`, `ci-cd-security` |
| **Content**       | `sanity-data-operations`    | `add-a-project`, `add-a-blog-post`, `sanity-groq-query`       |
| **Testing**       | `testing-workflow`          | `code-review`, `react-doctor`                                 |
| **Documentation** | `technical-writing`         | `content-review`                                              |
| **Analytics**     | `analytics-integration`     | `feature-flags`                                               |

### By Component Area

| Area               | Skills                                                                   |
| ------------------ | ------------------------------------------------------------------------ |
| **Hero Section**   | `update-the-hero`, `frontend-design`, `ui-ux-pro-max`                    |
| **Projects**       | `add-a-project`, `component-api-scaffolding`                             |
| **Blog**           | `add-a-blog-post`, `seo-optimization`                                    |
| **Certifications** | `add-a-certification`                                                    |
| **Experience**     | `add-an-experience`                                                      |
| **Gallery**        | `frontend-design`, `component-api-scaffolding`                           |
| **Contact**        | `api-design`, `webhook-design`                                           |
| **Chatbot**        | `ai-chatbot`, `api-design`, `frontend-design`, `testing-workflow`        |
| **API Routes**     | `api-design`                                                             |
| **Sanity Studio**  | `sanity-schema-validator`, `sanity-data-operations`, `sanity-groq-query` |

## Testing

- 86+ test files, 700+ tests, all green
- Run: `npm run test -- --run`
- Chat tests: `npm run test -- --run src/__tests__/chat/` (graph, tools, persistence), `src/__tests__/api/chat*.test.ts` (routes), `src/__tests__/hooks/use-chat-stream.test.tsx` (streaming hook)
- Test isolation: use `SWRConfig` with `provider: () => new Map()` for any test that exercises a SWR consumer
- When testing chat features, mock feature flags (`IS_LANGGRAPH_ENABLED: false` etc.) to test legacy linear flow
- Studios, scripts, and generated code are excluded from both `tsc` and `eslint` config; they have their own lanes

## Loop Engineering

This repo uses loop engineering patterns (inspired by [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering)). Loops automate maintenance tasks on a cadence.

### Core files

| File              | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `STATE.md`        | Live loop state — what is active, blocked, or watch-listed |
| `LOOP.md`         | Documents all active loops, cadence, and gates             |
| `loop-budget.md`  | Daily token caps per loop                                  |
| `loop-run-log.md` | Append-only run history                                    |

### Active loops

| Loop                   | Cadence      | Workflow                                   | Phase |
| ---------------------- | ------------ | ------------------------------------------ | ----- |
| **Daily Triage**       | 1d weekdays  | `.github/workflows/daily-triage.yml`       | L1    |
| **PR Babysitter**      | on PR events | `.github/workflows/pr-babysitter.yml`      | L2    |
| **Dependency Sweeper** | 6h           | `.github/workflows/dependency-sweeper.yml` | L2    |

### Kill switch

- Label: `loop-pause-all` — when present on the repo, all loop workflows skip execution.
- Resume: remove the label and clear the pause in `STATE.md`.

### Agent behavior

- Read `STATE.md` before starting work to understand what loops are active.
- Append to `loop-run-log.md` after completing automated tasks.
- Respect `loop-budget.md` token caps.
- Use `loop-engineering` skill for detailed instructions.
