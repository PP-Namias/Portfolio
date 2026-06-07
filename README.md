<table>
  <tr>
    <td width="160" align="center" valign="top">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://cdn.sanity.io/images/nl0qw78w/production/bc6de55c01aa5a25389620f72ee4176a3ce33d9b-1024x1024.png">
        <img src="https://cdn.sanity.io/images/nl0qw78w/production/bc6de55c01aa5a25389620f72ee4176a3ce33d9b-1024x1024.png" width="140" height="140" alt="Jhon Keneth Ryan Namias" style="border-radius:50%">
      </picture>
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
  <a href="#quality--security">Quality & Security</a> ·
  <a href="#core-stack">Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#project-structure">Structure</a> ·
  <a href="#scripts">Scripts</a> ·
  <a href="#environment">Environment</a> ·
  <a href="#license">License</a>
</p>

### Highlights

- **Modal-first UX** — Resume, Experience, Booking, and Project Detail modals with smooth transitions
- **Sanity-powered content** — All runtime data served from Sanity CMS with GROQ queries and multi-layer caching
- **Secure media gateway** — `/api/media/[...path]` proxies Sanity assets with optional HMAC signing
- **AI chat** — Gemini-driven assistant at `/api/chat` with preset responses for common queries
- **Performance** — Multi-tier caching (L1 in-memory, L2 Upstash Redis, L3 CDN), ISR, SWR, image optimization
- **Dark/light theme** — `next-themes` with accent color system
- **Automated CI/CD** — 19 GitHub workflows for validation, security scanning, and deployment

---

## Quality & Security

| Check | Tool | Threshold | CI Location |
|---|---|---|---|
| Lint | ESLint 9 (flat config) | 0 errors | `pr-validation.yml` |
| Types | `tsc --noEmit` | 0 errors | `pr-validation.yml` |
| Tests | Vitest + Testing Library | 278/278 passed | `pr-validation.yml` |
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
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS + Framer Motion + Lucide React |
| **Theme** | `next-themes` with accent color picker |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Content rendering** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Data fetching** | SWR (client) + multi-layer cache (L1 in-memory → L2 Upstash Redis → L3 CDN) |
| **Media delivery** | Secure gateway at `/api/media/[...path]` with HMAC verification |
| **AI** | Gemini 2.0 Flash via `/api/chat` with multi-provider failover |
| **Testing** | Vitest + Testing Library + jsdom (31 files, 278 tests) |
| **Hosting** | Cloudflare Workers via OpenNext |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

### Development

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production build locally |

### Quality

| Script | Description |
|---|---|
| `npm run lint` | Run ESLint across `src` and `studio` |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run doctor` | Run react-doctor quality analysis |
| `npm run doctor:json` | Export report as JSON |
| `npm run doctor:check` | Fail CI on any finding |

### Sanity CMS

| Script | Description |
|---|---|
| `npm run sanity:dry-run` | Preview import plan without writing |
| `npm run sanity:import` | Run import with idempotent upserts |
| `npm run sanity:parity` | Compare source counts vs dataset |
| `npm run sanity:parity:strict` | Parity check (non-zero on mismatch) |
| `npm run sanity:readiness` | Readiness-only check |
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
# Core
NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity tokens
SANITY_API_READ_TOKEN=your_sanity_read_token
SANITY_API_WRITE_TOKEN=your_sanity_write_token
SANITY_STUDIO_DEPLOY_TOKEN=your_studio_deploy_token
SANITY_REVALIDATE_SECRET=your_revalidate_secret
SANITY_MEDIA_GATEWAY_SECRET=your_media_gateway_secret

# AI Chat
GOOGLE_GEMINI_API_KEY=your_key_here

# Caching (optional)
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token

# Cloudflare
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=4bd772a73fb69e405e81422ee07a34a6

# Site
NEXT_PUBLIC_SITE_URL=https://namias.jkrbn99.workers.dev
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-studio-url.sanity.studio
```

Keep real values in `.env.local` only. Use `.env.example` as the template. Store deployment credentials in GitHub Actions secrets.

### Secure media gateway

Sanity assets are proxied through the server-side gateway at `/api/media/[...path]` instead of exposing raw Sanity CDN URLs. An optional HMAC-SHA256 signing secret (`SANITY_MEDIA_GATEWAY_SECRET`) verifies every request.

### Cloudflare deployment

- **Root app** — deploys via `opennextjs-cloudflare` to Cloudflare Workers
- **Studio** — deploys from `studio/` as its own Sanity application
- Set `NEXT_PUBLIC_SANITY_STUDIO_URL` to link the `/studio` landing page to the hosted editor

---

## Project structure

```
Portfolio/
├── .github/                  # 19 CI/CD workflows, templates, governance
├── .agents/                  # OpenCode agent skills (11 skills)
├── docs/                     # Documentation (performance, security, react-doctor, studio)
├── studio/                   # Sanity Studio CMS (21 schema types, 42 skills)
├── scripts/                  # Sanity import, migration, and seed scripts
├── functions/                # Sanity Functions (scheduled-publish, broken-refs, auto-tag)
├── public/                   # Static assets (favicon, OG image, robots.txt, service worker)
├── src/
│   ├── app/                  # App Router: pages, API routes (11), layout, providers
│   │   ├── api/              # chat, media, resume, sanity webhook, cache health, etc.
│   │   ├── blog/             # Blog list and [slug] detail pages
│   │   └── studio/           # Sanity Studio landing page
│   ├── components/           # UI components (27), sections (12), CMS, SEO
│   ├── hooks/                # useAccentColor, useCarousel, useCmsContent, etc.
│   ├── lib/                  # Cache, media gateway, SWR config, feature flags
│   ├── types/                # Shared TypeScript interfaces
│   └── middleware.ts         # Rate limiting
├── tests/                    # 31 test files (components, hooks, API, lib)
├── prd.json                  # Active product requirement documents
├── next.config.js
├── tailwind.config.ts
├── eslint.config.mjs
└── package.json
```

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
