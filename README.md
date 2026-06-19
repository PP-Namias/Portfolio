<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan Namias</h1>
      <p><b>Project Manager @ MASH</b> · <b>Full Stack Engineer & AI Automation Specialist</b><br/>Manila, Philippines</p>
      <p>
        <a href="https://cal.com/pp-namias"><img src="https://img.shields.io/badge/Book%20a%20Call-Cal.com-111827?style=for-the-badge&logo=calendar&logoColor=white" alt="Book a Call"></a>
        <a href="mailto:pp.namias@gmail.com"><img src="https://img.shields.io/badge/Email-pp.namias%40gmail.com-2563eb?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
        <a href="https://namias.tech"><img src="https://img.shields.io/badge/Live%20Portfolio-namias.tech-16a34a?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Portfolio"></a>
        <br/>
        <a href="https://github.com/PP-Namias"><img src="https://img.shields.io/badge/GitHub-PP--Namias-181717?style=flat-square&logo=github" alt="GitHub"></a>
        <a href="https://www.linkedin.com/in/pp-namias/"><img src="https://img.shields.io/badge/LinkedIn-pp--namias-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
        <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square" alt="MIT License">
        <img src="https://img.shields.io/badge/react--doctor-100%2F100-22c55e?style=flat-square" alt="react-doctor 100/100">
        <img src="https://img.shields.io/badge/Security%20Posture-98%2F100-22c55e?style=flat-square" alt="Security Posture 98/100">
      </p>
    </td>
  </tr>
</table>

---

## About

Production portfolio for [namias.tech](https://namias.tech) — a modal-first, Sanity-driven Next.js application with a modern animation system, secure media gateway, AI-powered chat, and automated CI/CD quality gates.

<p>
  <a href="#screenshots">Screenshots</a> ·
  <a href="#highlights">Highlights</a> ·
  <a href="#quality--security">Quality & Security</a> ·
  <a href="#core-stack">Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#project-structure">Structure</a> ·
  <a href="#scripts">Scripts</a> ·
  <a href="#environment">Environment</a> ·
  <a href="#license">License</a>
</p>

---

## Screenshots

<!-- Drop your screenshots into assets/screenshots/ and update the filenames below -->

<p align="center">
  <img src="assets/screenshots/home.png" alt="Portfolio Home" width="800" />
  <br/>
  <em>Home — Hero with animated role rotator, profile photo, and floating hub menu</em>
</p>

<table>
  <tr>
    <td align="center">
      <img src="assets/screenshots/projects.png" alt="Projects Section" width="400" />
      <br/>
      <em>Projects — 3D card grid with hover transforms and category filters</em>
    </td>
    <td align="center">
      <img src="assets/screenshots/blog.png" alt="Blog Section" width="400" />
      <br/>
      <em>Blog — Cover images, reading time, and MDX-rendered content</em>
    </td>
  </tr>
</table>

---

## Highlights

- **Modal-first UX** — Resume, Experience, Booking, and Project Detail modals with smooth Framer Motion transitions
- **Sanity-powered content** — All runtime data served from Sanity CMS with GROQ queries and multi-layer caching (in-memory, Upstash Redis, CDN)
- **Secure media gateway** — `/api/media/[...path]` proxies Sanity assets with HMAC-SHA256 signing, 7-day TTL, unsigned fallback
- **AI chat** — Gemini-powered assistant at `/api/chat` with multi-provider failover (Gemini → OpenAI) and preset responses
- **Dark/light theme** — `next-themes` with 8 accent color options
- **Gallery** — Masonry grid with lightbox navigation and keyboard support
- **Certifications** — Filterable grid with lightbox detail view and issuer badges
- **Blog** — MDX content with code highlighting, reading time, and SEO-optimized meta
- **Performance** — ISR on all content pages, SWR for client data, image optimization via Sanity CDN
- **Automated CI/CD** — 19+ GitHub workflows: lint, typecheck, tests, react-doctor, PentestAgent, Trivy, CodeQL, deployment

---

## Quality & Security

| Check | Tool | Threshold | Status |
|---|---|---|---|
| Lint | ESLint 9 (flat config) | 0 errors | `pr-validation.yml` |
| Types | `tsc --noEmit` | 0 errors | `pr-validation.yml` |
| Tests | Vitest + Testing Library | 410/410 passed | `pr-validation.yml` |
| React quality | react-doctor 0.4.0 | 100/100 (0 findings) | `react-doctor.yml` |

| Badge | Status |
|---|---|
| [![Security Posture](https://img.shields.io/badge/Security%20Posture-98%2F100-22c55e?style=flat-square)](./docs/security/dashboard.md) | 98/100 — zero exploitable vulnerabilities |
| [![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PP-Namias/Portfolio/badge)](https://scorecard.dev/viewer/?uri=github.com/PP-Namias/Portfolio) | Weekly OpenSSF Scorecard scan |
| [![CI/CD Gate](https://img.shields.io/badge/CI%2FCD%20Gate-7%20tools-0ea5e9?style=flat-square)](./docs/security/pipeline.md) | Gitleaks, OSV-Scanner, Trivy, zizmor, Checkov, Cosign, Scorecard |
| [![PentestAgent](https://img.shields.io/badge/PentestAgent-25%20playbooks-0891b2?style=flat-square)](./docs/security/pentestagent) | 25 playbooks covering OWASP Top 10 |
| [![security.txt](https://img.shields.io/badge/security.txt-present-64748b?style=flat-square)](./public/.well-known/security.txt) | Vulnerability disclosure policy deployed |
| [![API Headers](https://img.shields.io/badge/Headers-verified-16a34a?style=flat-square)](https://namias.tech/api/security-headers) | Real-time header verification endpoint |

Security is a first-class feature — continuously tested via [PentestAgent](https://github.com/GH05TCREW/pentestagent) with a seven-stage CI/CD pipeline on every PR and push to `main`. Full details in [`docs/security/dashboard.md`](./docs/security/dashboard.md). See [`docs/react-doctor/scoreboard.md`](./docs/react-doctor/scoreboard.md) for the react-doctor journey from 91/100 to 100/100.

---

## Core stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS + Framer Motion + Lucide React |
| **Theme** | `next-themes` with accent color picker |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Content rendering** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Data fetching** | SWR (client) + multi-layer cache (L1 in-memory → L2 Upstash Redis → L3 CDN) |
| **Media delivery** | Secure gateway at `/api/media/[...path]` with HMAC verification |
| **AI** | Gemini 2.0 Flash via `/api/chat` with multi-provider failover |
| **Testing** | Vitest + Testing Library + jsdom (43 files, 410 tests) |
| **Hosting** | Cloudflare Workers via OpenNext |
| **CI/CD** | GitHub Actions (19 workflows) |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm
- Sanity project (for CMS data)

### Setup

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To start Sanity Studio separately:

```bash
cd studio
pnpm install
pnpm run dev
```

Open [http://localhost:3333](http://localhost:3333).

---

## Project structure

```
Portfolio/
├── .github/                  # 19 CI/CD workflows, templates, governance
├── .agents/                  # OpenCode agent skills & subagents
├── assets/screenshots/       # README screenshots
├── docs/                     # PRDs, performance, security, react-doctor
├── studio/                   # Sanity Studio (21 schema types, 42 skills)
├── scripts/                  # Sanity import, migration, and seed scripts
├── functions/                # Sanity Functions (scheduled-publish, broken-refs, auto-tag)
├── public/                   # Static assets (favicon, OG, robots.txt, service worker)
├── src/
│   ├── app/                  # App Router: pages, API routes (11), layout, providers
│   │   ├── api/              # chat, media, resume, sanity webhook, cache, canary
│   │   ├── blog/             # Blog list and [slug] detail pages
│   │   ├── projects/         # Project detail pages ([slug])
│   │   └── studio/           # Sanity Studio landing page
│   ├── components/
│   │   ├── sections/         # 12 section components (Hero, Projects, Blog, Gallery, etc.)
│   │   └── ui/               # 27 reusable UI components (Modal, Card, OptimizedImage, etc.)
│   ├── hooks/                # useAccentColor, useCarousel, useCmsContent, etc.
│   ├── lib/                  # Cache, media gateway, feature flags, CMS helpers
│   ├── types/                # Shared TypeScript interfaces
│   └── middleware.ts         # Rate limiting, security headers
├── prd.json                  # Active product requirement documents
├── next.config.js
├── tailwind.config.ts
├── eslint.config.mjs
└── package.json
```

---

## Scripts

### Development

| Script | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Create production build |
| `npm run start` | Run production build locally |

### Quality

| Script | Description |
|---|---|
| `npm run lint` | Run ESLint across `src` and `studio` |
| `npm run test` | Run all 410 tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run doctor` | Run react-doctor quality analysis |
| `npm run doctor:check` | Fail CI on any finding |

### Sanity CMS

| Script | Description |
|---|---|
| `npm run sanity:dry-run` | Preview import plan without writing |
| `npm run sanity:import` | Run import with idempotent upserts |
| `npm run sanity:parity` | Compare source counts vs dataset |
| `npm --prefix studio run dev` | Start Sanity Studio locally |

### Cloudflare deployment

| Script | Description |
|---|---|
| `npm run cloudflare:build` | Build and adapt for Cloudflare Workers |
| `npm run cloudflare:dev` | Preview production build in Wrangler |
| `npm run cloudflare:deploy` | Build and deploy to Cloudflare Workers |

---

## Environment

Create `.env.local` from the template in `.env.example`:

```bash
cp .env.example .env.local
```

### Required variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name |
| `SANITY_API_READ_TOKEN` | Sanity API read token |
| `SANITY_API_WRITE_TOKEN` | Sanity API write token |
| `SANITY_MEDIA_GATEWAY_SECRET` | HMAC secret for signing media URLs |
| `GOOGLE_GEMINI_API_KEY` | Gemini API key for chat |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token for deployment |

### Optional variables

| Variable | Description |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL (L2 cache) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami analytics website ID |
| `OPENAI_API_KEY` | OpenAI key (secondary chat provider) |

Keep real values in `.env.local` only. Store deployment credentials in GitHub Actions secrets.

### Cloudflare Worker secrets

Set these via `wrangler secret put <NAME>` (not in `.env`):

- `SANITY_MEDIA_GATEWAY_SECRET` — must match local value
- `SANITY_REVALIDATE_SECRET` — for on-demand ISR

---

## Sanity CMS

The portfolio is fully backed by [Sanity v3](https://www.sanity.io/) — the editorial surface lives at **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)**.

| Feature | Details |
|---|---|
| **Studio** | Sanity v3 with React 19, custom structure, presentation tool, vision tool |
| **Schema types** | 21 document types (profile, hero, about, experience, project, certification, blog, gallery, site settings, etc.) |
| **Plugins** | `structureTool`, `presentationTool`, `visionTool`, `assist`, custom skills tool, saved queries |
| **Document actions** | Perspective switcher, publish-and-refresh (revalidation webhook), view-on-site, open-in-presentation |
| **Document badges** | Draft/Live, Scheduled, Stale (30+ days), Expiring soon, Featured |
| **Validations** | Centralized rules: SEO-friendly headline length, HTTPS-only URLs, cross-field date order, unique slugs, alt text requirement |
| **Sanity Functions** | `scheduled-publish` (5-min cron), `broken-refs` (6-h cron), `auto-tag-images` (on asset create) |
| **Visual Editing** | `next-sanity` Live Content API + `<SanityField>` component with `data-sanity` attributes for overlay targeting |
| **Real-time preview** | Presentation tool with draft mode via `/api/draft-mode` |

---

## Automated problem detection

When monitored workflows fail, automation posts a problem report with suggested solutions on the related PR (or as a repository issue when no PR is linked).

- Detection workflow: `problem-detection-advisor.yml`
- Approval gate: `remediation-approval-gate.yml`

To approve remediation reruns, comment on the PR:

```text
/approve-remediation
```

Only repository owners, members, or collaborators can approve remediation reruns.

---

## Design acknowledgment

This project draws design inspiration from [bryllim.com](https://bryllim.com/). All implementation code in this repository is original.

---

## License

Licensed under the MIT License. See [LICENSE](LICENSE).
