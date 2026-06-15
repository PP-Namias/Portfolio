# Agent guide

This file is the entry point for any agent (opencode, future coding agents, or human contributors) working on the PP Namias portfolio. It captures the repo's working agreements, the available skills, and the most common workflows.

## Skills

### Content Management
- `add-an-experience`, `add-a-project`, `add-a-certification`, `add-a-blog-post` — content workflows
- `update-the-hero` — hero block editing
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

### API & Backend
- `api-design` — REST API patterns, validation, error handling, rate limiting
- `database-operations` — database schemas, queries, migrations, data operations
- `webhook-design` — webhook implementation, signature verification, event-driven architecture
- `graphql-api` — GraphQL schema design, resolvers, client integration

### Infrastructure & DevOps
- `cloudflare-workers` — Cloudflare Workers, R2, KV, D1, edge computing
- `performance-monitoring` — APM, error tracking, Core Web Vitals monitoring
- `code-migration` — framework and library migration strategies
- `dependency-audit` — security vulnerability scanning, licensing, maintenance

### Analytics & Features
- `analytics-integration` — user analytics, tracking, insights collection
- `feature-flags` — feature flags for gradual rollouts and A/B testing

### Documentation & Quality
- `technical-writing` — documentation, READMEs, developer guides
- `orchestrator` — coordinate multi-step tasks across multiple skills
- `impeccable` — quick repo-hygiene and consistency checks
- `git` — git workflow, branch strategy, commit hygiene
- `content-review` — review copy and documentation for clarity
- `design` — baseline UI implementation guidance
- `ci-cd-security` — CI/CD pipeline security and automation

### OpenCode & MiMo v2.5 Optimization
- `mimo-workflow` — optimized workflows for OpenCode IDE with MiMo v2.5 free model
- `opencode-optimization` — optimize OpenCode IDE configuration and workflows
- `fullstack-workflow` — end-to-end full-stack development workflow for Next.js
- `typescript-advanced` — advanced TypeScript patterns and type safety

## Home page sections

- `BlogSection` (`src/components/sections/BlogSection.tsx`) — compact list of the latest 3 blog posts shown side-by-side with `CertificationsSection` on the home page. Gated by `IS_BLOG_VISIBLE` in `src/lib/features.ts`. Plan: `docs/prd/prd.blog.json`.
- `ProjectsSectionRevamped` (`src/components/sections/ProjectsSectionRevamped.tsx`) — dual-tab project index (Live Projects / Showcase) with flat cards, sliding tab indicator, expand/collapse, and keyboard navigation. Gated by `IS_PROJECTS_REVAMP_ENABLED` in `src/lib/features.ts`. When disabled, the original `ProjectsSection` renders. Plan: `docs/prd/prd.projects-revamp.json`.
- `ProjectDetailPage` (`src/components/sections/ProjectDetailPage.tsx`) — full detail page for showcase projects at `/projects/[slug]`. Includes hero image, challenge/solution/result, highlights, tech stack, gallery, and JSON-LD structured data. ISR-cached with 1-hour revalidation.

## React quality gate

- Tool: `react-doctor@0.4.0` (pinned to exact version in `package.json`)
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
| Server | Config key | Purpose |
|---|---|---|
| **Chrome DevTools MCP** | `chrome-devtools` | Browser debugging, performance traces, screenshots, console inspection |
| **21st.dev Magic MCP** | `@21st-dev/magic` | Generate UI components from natural language (API key required) |
| **Magic UI MCP** | `@magicuidesign/mcp` | Animated components (marquee, bento, dock, globe, etc.) |
| **GitHub MCP** | `github` | Issues, PRs, repos, code search, file management |
| **Filesystem MCP** | `filesystem` | File read/write access with path restrictions |
| **Sequential Thinking** | `sequential-thinking` | Structured reasoning for complex problems |

### Database & Storage MCPs
| Server | Config key | Purpose |
|---|---|---|
| **Memory** | `memory` | Knowledge graph memory for persistent context |
| **SQLite** | `sqlite` | Local SQLite database for caching and analytics |
| **Redis** | `redis` | Redis cache management and session storage |
| **PostgreSQL** | `postgres` | PostgreSQL database for production data |

### Cloud & Infrastructure MCPs
| Server | Config key | Purpose |
|---|---|---|
| **AWS** | `aws` | AWS services (S3, Lambda, CloudFront) |
| **Cloudflare** | `cloudflare` | Cloudflare Workers, R2, KV, D1 |
| **Vercel** | `vercel` | Vercel deployment and edge functions |
| **Docker** | `docker` | Container management and optimization |
| **Kubernetes** | `kubernetes` | Kubernetes cluster management |

### Monitoring & Analytics MCPs
| Server | Config key | Purpose |
|---|---|---|
| **Sentry** | `sentry` | Error tracking and performance monitoring |
| **Performance** | `performance` | Core Web Vitals monitoring |
| **Analytics** | `analytics` | User analytics and insights |
| **Monitoring** | `application` | Application monitoring and alerting |

### Integration MCPs
| Server | Config key | Purpose |
|---|---|---|
| **Slack** | `slack` | Team notifications and collaboration |
| **Notion** | `notion` | Documentation and project management |
| **Linear** | `linear` | Issue tracking and sprints |
| **Figma** | `figma` | Design-to-code workflows |
| **Sanity CMS** | `sanity-cms` | Direct Sanity CMS operations |

### Payment & Business MCPs
| Server | Config key | Purpose |
|---|---|---|
| **Stripe** | `stripe` | Payment processing and subscriptions |
| **Email** | `email` | Email sending and templates |
| **SMS** | `sms` | SMS notifications and 2FA |
| **CRM** | `crm` | Customer relationship management |

### Development Tools MCPs
| Server | Config key | Purpose |
|---|---|---|
| **Code Generation** | `code-generation` | Auto-generate code from specs |
| **Code Review** | `code-review` | Automated code review |
| **Testing** | `testing` | Test generation and coverage |
| **Documentation** | `documentation` | Auto-generate docs |
| **Security Scan** | `security-scan` | Vulnerability scanning |
| **Performance Scan** | `performance-scan` | Performance analysis |

### Content & Media MCPs
| Server | Config key | Purpose |
|---|---|---|
| **Image Processing** | `image-processing` | Image optimization and conversion |
| **PDF** | `pdf` | PDF generation and manipulation |
| **Video** | `video` | Video processing and streaming |
| **Audio** | `audio` | Audio processing and voice |
| **Translation** | `translation` | Multi-language translation |

Setup guides: `docs/mcp/overview.md` | `docs/mcp/chrome-devtools-mcp.md` | `docs/mcp/magic-mcp.md`

## Agent Routing

### By Task Type

| Task | Primary Skill | Secondary Skills |
|------|---------------|------------------|
| **New Component** | `component-api-scaffolding` | `frontend-design`, `ui-ux-pro-max` |
| **API Endpoint** | `api-design` | `database-operations`, `webhook-design` |
| **Bug Fix** | `debugging-error-tracking` | `code-review`, `testing-workflow` |
| **Performance** | `performance-optimization` | `performance-auditing`, `performance-monitoring` |
| **Security** | `run-pentestagent` | `dependency-audit`, `ci-cd-security` |
| **Deployment** | `deployment-infrastructure` | `cloudflare-workers`, `ci-cd-security` |
| **Content** | `sanity-data-operations` | `add-a-project`, `add-a-blog-post` |
| **Testing** | `testing-workflow` | `code-review`, `react-doctor` |
| **Documentation** | `technical-writing` | `content-review` |
| **Analytics** | `analytics-integration` | `feature-flags`, `performance-monitoring` |

### By Component Area

| Area | Skills |
|------|--------|
| **Hero Section** | `update-the-hero`, `frontend-design`, `ui-ux-pro-max` |
| **Projects** | `add-a-project`, `component-api-scaffolding` |
| **Blog** | `add-a-blog-post`, `seo-optimization` |
| **Certifications** | `add-a-certification` |
| **Experience** | `add-an-experience` |
| **Gallery** | `frontend-design`, `component-api-scaffolding` |
| **Contact** | `api-design`, `webhook-design` |
| **API Routes** | `api-design`, `database-operations` |
| **Sanity Studio** | `sanity-schema-validator`, `sanity-data-operations` |

## Testing

- 42 test files, 381 tests, all green
- Run: `npm run test -- --run`
- Test isolation: use `SWRConfig` with `provider: () => new Map()` for any test that exercises a SWR consumer
- Studios, scripts, and generated code are excluded from both `tsc` and `eslint` config; they have their own lanes
