# PP Namias Portfolio

| Profile | Details |
| --- | --- |
| <img src="https://cdn.sanity.io/images/nl0qw78w/production/bc6de55c01aa5a25389620f72ee4176a3ce33d9b-256x256.png" width="120" height="120" alt="Jhon Keneth Ryan Namias"> | **Jhon Keneth Ryan Namias (PP Namias)** <br /> Project Manager @ MASH · Full Stack Engineer & AI Automation Specialist · Manila, Philippines <br /> [![Book a Call](https://img.shields.io/badge/Book%20a%20Call-Cal.com-111827?style=for-the-badge&logo=calendar&logoColor=white)](https://cal.com/pp-namias) [![Email](https://img.shields.io/badge/Email-pp.namias%40gmail.com-2563eb?style=for-the-badge&logo=gmail&logoColor=white)](mailto:pp.namias@gmail.com) [![Live Portfolio](https://img.shields.io/badge/Live%20Portfolio-namias.tech-16a34a?style=flat-square&logo=vercel&logoColor=white)](https://namias.tech) [![GitHub](https://img.shields.io/badge/GitHub-PP--Namias-181717?style=flat-square&logo=github)](https://github.com/PP-Namias) [![LinkedIn](https://img.shields.io/badge/LinkedIn-pp--namias-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pp-namias/) ![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square) ![react-doctor](https://img.shields.io/badge/react--doctor-100%2F100-22c55e?style=flat-square) |

## About

Production portfolio for [namias.tech](https://namias.tech) — a modal-first, Sanity-driven Next.js application with an advanced animation system, secure media gateway, AI chat, and automated CI/CD quality gates.

### Quality gates

| Check | Tool | Threshold | Where |
|---|---|---|---|
| Lint | ESLint 9 (flat config) | 0 errors | `.github/workflows/pr-validation.yml` |
| Type | `tsc --noEmit` | 0 errors | `.github/workflows/pr-validation.yml` |
| Tests | Vitest + Testing Library | 29/29 files, 266/266 tests | `.github/workflows/pr-validation.yml` |
| **React quality** | **react-doctor 0.4.0** | **100/100 (0 findings)** | **`.github/workflows/react-doctor.yml`** |

### Security posture

| Badge | Status |
|---|---|
| [![Security Posture](https://img.shields.io/badge/Security%20Posture-98%2F100-22c55e?style=flat-square)](./docs/security/dashboard.md) | 98/100 — zero exploitable vulnerabilities |
| [![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PP-Namias/Portfolio/badge)](https://scorecard.dev/viewer/?uri=github.com/PP-Namias/Portfolio) | OpenSSF Scorecard weekly scan |
| [![CI/CD Gate](https://img.shields.io/badge/CI%2FCD%20Gate-7%20tools-0ea5e9?style=flat-square)](./docs/security/pipeline.md) | Gitleaks, OSV-Scanner, Trivy, zizmor, Checkov, Cosign, Scorecard |
| [![PentestAgent](https://img.shields.io/badge/PentestAgent-25%20playbooks-0891b2?style=flat-square)](./docs/security/pentestagent/PR_NOTES.md) | 25 playbooks covering OWASP Top 10 |
| [![Security.txt](https://img.shields.io/badge/security.txt-present-64748b?style=flat-square)](./public/.well-known/security.txt) | Vulnerability disclosure policy deployed |
| [![API Headers](https://img.shields.io/badge/Headers-verified-16a34a?style=flat-square)](https://namias.tech/api/security-headers) | Real-time header verification endpoint |

Security is a first-class feature. The site is continuously tested via [PentestAgent](https://github.com/GH05TCREW/pentestagent) with a seven-stage CI/CD pipeline on every PR and push to `main`. See [`docs/security/dashboard.md`](./docs/security/dashboard.md).

## Core stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + Framer Motion + Lucide React
- **Theme:** `next-themes` with accent color system
- **CMS:** Sanity v3 (Studio + Content Lake + CDN)
- **Content:** `react-markdown`, `remark-gfm`, `rehype-highlight`
- **Data fetching:** SWR (client) + multi-layer cache (in-memory L1, Upstash Redis L2, CDN L3)
- **Media:** Secure media gateway at `/api/media/[...path]`
- **AI:** Gemini-powered chat at `/api/chat`
- **Testing:** Vitest + Testing Library + jsdom (266 tests)
- **Hosting:** Cloudflare Workers via OpenNext

## Local development

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

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run sanity:dry-run` | Preview Sanity import plan |
| `npm run sanity:import` | Run Sanity import with upserts |
| `npm run sanity:parity` | Compare source counts vs dataset |
| `npm run sanity:parity:strict` | Parity check (non-zero on mismatch) |
| `npm run sanity:readiness` | Readiness-only check |
| `npm run doctor` | Run react-doctor quality analysis |
| `npm run doctor:json` | Export report as JSON |
| `npm run cloudflare:build` | Build for Cloudflare Workers |
| `npm run cloudflare:dev` | Preview in Wrangler |
| `npm run cloudflare:deploy` | Build and deploy to Workers |
| `npm --prefix studio run dev` | Start Sanity Studio locally |

## Environment variables

Create `.env.local` from the template in `.env.example`:

```bash
GOOGLE_GEMINI_API_KEY=your_key_here
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=nl0qw78w
SANITY_STUDIO_DATASET=production
NEXT_PUBLIC_SITE_URL=https://namias.jkrbn99.workers.dev
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-sanity-studio-url.sanity.studio
SANITY_API_READ_TOKEN=your_sanity_read_token
SANITY_API_WRITE_TOKEN=your_sanity_write_token
SANITY_STUDIO_DEPLOY_TOKEN=your_studio_deploy_token
SANITY_REVALIDATE_SECRET=your_revalidate_secret
SANITY_MEDIA_GATEWAY_SECRET=your_media_gateway_secret
SANITY_CUTOVER_ENABLED=true
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=4bd772a73fb69e405e81422ee07a34a6
```

Keep real values in `.env.local` only. Use `.env.example` as the template. Put deployment credentials in GitHub Actions secrets.

### Secure media gateway

Sanity-hosted images and files are routed through the app's server-side media gateway (`/api/media/[...path]`) instead of exposing raw Sanity CDN URLs. An optional HMAC signing secret (`SANITY_MEDIA_GATEWAY_SECRET`) adds verification.

### Cloudflare deployment

- Root app deploys via `opennextjs-cloudflare`
- Studio deploys from `studio/` as its own Sanity app
- Add `NEXT_PUBLIC_SANITY_STUDIO_URL` to link the `/studio` landing page to the hosted editor

## Quality checks

```bash
npm run lint
npm run build
npm run test
```

CI workflows in `.github/workflows/` enforce equivalent checks on every PR.

## Project structure

```
Portfolio/
├── .github/                  # Workflows, templates, governance
├── .agents/                  # OpenCode agent skills
├── docs/                     # Documentation (performance, security, studio)
├── studio/                   # Sanity Studio CMS package
├── scripts/                  # Sanity import/migration scripts
├── functions/                # Sanity Functions (scheduled-publish, broken-refs)
├── public/                   # Static assets (favicon, OG image, robots.txt, SW)
├── src/
│   ├── app/                  # Routes, layout, providers, API routes
│   ├── components/           # Layout, sections (12), UI (27), CMS, SEO
│   ├── hooks/                # Custom React hooks (6)
│   ├── lib/                  # Utilities, cache layers, feature flags
│   ├── types/                # Shared TypeScript types
│   └── middleware.ts         # Rate limiting
├── tests/                    # Test files (29 files, 266 tests)
├── prd.json                  # Active product requirement documents
├── next.config.js
├── tailwind.config.ts
├── eslint.config.mjs
└── package.json
```

## Design acknowledgment

This project draws design inspiration from [bryllim.com](https://bryllim.com/). All implementation code in this repository is original.

## License

Licensed under the MIT License. See [LICENSE](LICENSE).
