# PP Namias Portfolio

| Profile | Details |
| --- | --- |
| ![Jhon Keneth Ryan Namias profile image](./public/images/profile/PP%20Namias.png) | **Jhon Keneth Ryan Namias (PP Namias)** <br />  Project Manager @ MASH · Full Stack Engineer & AI Automation Specialist · Manila, Philippines · Available for collaboration [![Resume](https://img.shields.io/badge/Resume-View%20PDF-db2777?style=for-the-badge)](./public/resume.pdf) [![Book a Call](https://img.shields.io/badge/Book%20a%20Call-Cal.com-111827?style=for-the-badge&logo=calendar&logoColor=white)](https://cal.com/pp-namias) [![Email](https://img.shields.io/badge/Email-pp.namias%40gmail.com-2563eb?style=for-the-badge&logo=gmail&logoColor=white)](mailto:pp.namias@gmail.com) [![Live Portfolio](https://img.shields.io/badge/Live%20Portfolio-namias.tech-16a34a?style=flat-square&logo=vercel&logoColor=white)](https://namias.tech) [![GitHub](https://img.shields.io/badge/GitHub-PP--Namias-181717?style=flat-square&logo=github)](https://github.com/PP-Namias) [![LinkedIn](https://img.shields.io/badge/LinkedIn-pp--namias-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pp-namias/) ![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square) ![react-doctor](https://img.shields.io/badge/react--doctor-100%2F100-22c55e?style=flat-square) |

## About this repository

This repository powers [namias.tech](https://namias.tech), a production portfolio built with a modal-first UX, modern animation system, and automated quality checks.

### Quality gates

| Check | Tool | Threshold | Where |
|---|---|---|---|
| Lint | ESLint 9 (flat config) | 0 errors | `.github/workflows/pr-validation.yml` |
| Type | `tsc --noEmit` | 0 errors | `.github/workflows/pr-validation.yml` |
| Tests | Vitest + Testing Library | 29/29 files, 266/266 tests | `.github/workflows/pr-validation.yml` |
| **React quality** | **react-doctor 0.2.16** | **100/100 (0 findings)** | **`.github/workflows/react-doctor.yml`** |

The react-doctor gate was introduced in the clinic slice. See [`docs/react-doctor/scoreboard.md`](./docs/react-doctor/scoreboard.md) for the journey from 91/100 baseline to 100/100, [`docs/react-doctor/PR_NOTES.md`](./docs/react-doctor/PR_NOTES.md) for the slice narrative, and [`.agents/skills/run-react-doctor/SKILL.md`](./.agents/skills/run-react-doctor/SKILL.md) for the runbook.

### Security posture

| Badge | Status |
|-------|--------|
| [![Security Posture](https://img.shields.io/badge/Security%20Posture-98%2F100-22c55e?style=flat-square)](./docs/security/dashboard.md) | 98/100 — zero exploitable vulnerabilities |
| [![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PP-Namias/Portfolio/badge)](https://scorecard.dev/viewer/?uri=github.com/PP-Namias/Portfolio) | OpenSSF Scorecard weekly scan |
| [![CI/CD Gate](https://img.shields.io/badge/CI%2FCD%20Gate-7%20tools-0ea5e9?style=flat-square)](./docs/security/pipeline.md) | Gitleaks, OSV-Scanner, Trivy, zizmor, Checkov, Cosign, Scorecard |
| [![PentestAgent](https://img.shields.io/badge/PentestAgent-25%20playbooks-0891b2?style=flat-square)](./docs/security/pentestagent/PR_NOTES.md) | 25 playbooks covering OWASP Top 10 |
| [![Security.txt](https://img.shields.io/badge/security.txt-present-64748b?style=flat-square)](./public/.well-known/security.txt) | Vulnerability disclosure policy deployed |
| [![API Headers](https://img.shields.io/badge/Headers-verified-16a34a?style=flat-square)](https://namias.tech/api/security-headers) | Real-time header verification endpoint |

Security is a first-class feature of this portfolio. The site is continuously tested via [PentestAgent](https://github.com/GH05TCREW/pentestagent), an AI agent framework for black-box security testing. The CI/CD pipeline runs a seven-stage security gate (Gitleaks, OSV-Scanner, Trivy, zizmor, Checkov, Cosign, Scorecard) on every PR and every push to `main`. See [`docs/security/dashboard.md`](./docs/security/dashboard.md) for the full posture dashboard, [`docs/security/pipeline.md`](./docs/security/pipeline.md) for the seven-stage gate, and [`.well-known/security.txt`](./public/.well-known/security.txt) for the disclosure policy.



## About this repository

This repository powers [namias.tech](https://namias.tech), a production portfolio built with a modal-first UX, modern animation system, and automated quality checks.

### Highlights

- Homepage-first architecture with modal flows for Resume, Experience, and Booking
- Fully Sanity-driven content: all runtime reads are backed by Sanity CMS with controlled media delivery
- Secure media gateway at `/api/media/[...path]` for Sanity-backed images and assets
- AI chat endpoint at `/api/chat` using Gemini
- Dark/light theme support with an accent color system
- CI validation for lint, tests, and production build

## Core stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + Framer Motion + Lucide React
- **Theme:** `next-themes`
- **CMS:** Sanity v3 (Studio + Content Lake + CDN)
- **Content:** `react-markdown`, `remark-gfm`, `rehype-highlight`
- **Testing:** Vitest + Testing Library + jsdom
- **Hosting target:** Cloudflare Workers via OpenNext

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

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run start` — run production build locally
- `npm run lint` — run ESLint
- `npm run test` — run Vitest once
- `npm run test:watch` — run Vitest in watch mode
- `npm run sanity:dry-run` — preview Sanity import plan without writing
- `npm run sanity:import` — run Sanity import with idempotent upserts
- `npm run sanity:parity` — compare expected source counts vs dataset counts
- `npm run sanity:parity:strict` — same parity report, returns non-zero on mismatch
- `npm run sanity:readiness` — readiness-only check (no count comparisons)
- `npm run cloudflare:build` — build and adapt the app for Cloudflare Workers
- `npm run cloudflare:dev` — preview the production build in Wrangler
- `npm run cloudflare:deploy` — build and deploy to Cloudflare Workers
- `npm --prefix studio run dev` — start Sanity Studio locally

## Environment variables

Create a `.env.local` file in the project root for real secrets and keep `.env` aligned for local tooling. Use `.env.example` as the template:

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

`.env.local` overrides `.env` for private values, and the Sanity migration runner loads both files automatically.

### Secure media gateway

Sanity-hosted images and files are routed through the app’s server-side media gateway instead of being exposed as raw backend URLs in the UI.

- Browser-facing route: `/api/media/[...path]`
- Optional signing secret: `SANITY_MEDIA_GATEWAY_SECRET`
- Keep all Sanity credentials server-side only
- Preserve the existing fallback paths while rollout is staged

### Cloudflare deployment

Use the root Cloudflare worker for the portfolio app and the separate `studio/` package for the CMS editor.

- Root app deploys through `opennextjs-cloudflare`
- Studio deploys from `studio/` as its own Sanity app
- Add `NEXT_PUBLIC_SANITY_STUDIO_URL` if you want the `/studio` landing page to open a hosted editor URL directly
- The Cloudflare scripts use the OpenNext Cloudflare adapter for this repo's supported Next.js version

### GitHub secrets map

- `CLOUDFLARE_API_TOKEN` -> Cloudflare Workers API token
- `CLOUDFLARE_ACCOUNT_ID` -> `4bd772a73fb69e405e81422ee07a34a6`
- `SANITY_STUDIO_DEPLOY_TOKEN` -> Sanity deploy token
- `NEXT_PUBLIC_SANITY_PROJECT_ID` -> `nl0qw78w`
- `NEXT_PUBLIC_SANITY_DATASET` -> `production`
- `SANITY_REVALIDATE_SECRET` -> your random secret string
- `NEXT_PUBLIC_SITE_URL` -> deployed worker URL

### Best practice

- Keep real values in `.env.local` only.
- Use `.env.example` as the copy-paste template.
- Put deployment credentials in GitHub Actions secrets, not in the repo.
- If a Cloudflare token was ever shared outside your secret store, revoke it and create a new one before deploy.

## Quality checks

Run before pushing or opening a PR:

```bash
npm run lint
npm run build
npm run test
```

CI workflows in `.github/workflows/` enforce equivalent checks.

## Project structure (high level)

```text
Portfolio/
├── .github/                     # workflows, templates, governance docs
├── docs/                        # publication and repository governance docs
├── portfolio-resources/         # source content and media resources
├── public/                      # static files served by Next.js
├── src/
│   ├── app/                     # routes, layout, providers, API routes
│   ├── components/              # layout, sections, and reusable UI
│   ├── data/                    # typed data modules
│   ├── hooks/                   # custom hooks
│   ├── lib/                     # utilities and feature flags
│   └── types/                   # shared TypeScript types
├── amplify.yml
├── next.config.js
└── package.json
```

## Design acknowledgment

This project draws design inspiration from [bryllim.com](https://bryllim.com/). All implementation code in this repository is original.

## License

Licensed under the MIT License. See [LICENSE](LICENSE).
