<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan B. Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan B. Namias</h1>
      <p><b>AI & Machine Learning Engineer</b> · <b>Full Stack Engineer</b> · <b>Automation Specialist</b><br/>Manila, Philippines</p>
      <p>
        <a href="https://namias.tech"><img src="https://img.shields.io/badge/Live%20Portfolio-namias.tech-16a34a?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Portfolio"></a>
        <a href="https://cal.com/pp-namias"><img src="https://img.shields.io/badge/Book%20a%20Call-Cal.com-111827?style=for-the-badge&logo=calendar&logoColor=white" alt="Book a Call"></a>
        <a href="mailto:pp.namias@gmail.com"><img src="https://img.shields.io/badge/Email-pp.namias%40gmail.com-2563eb?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
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

<p align="center">
  <a href="./.github/README.ko.md">한국어</a> ·
  <a href="./.github/README.es.md">Español</a> ·
  <a href="./.github/README.fr.md">Français</a> ·
  <a href="./.github/README.ja.md">日本語</a> ·
  <a href="./.github/README.zh.md">中文</a>
</p>

---

## About

The production portfolio for [namias.tech](https://namias.tech) — a modal-first, Sanity-driven Next.js application featuring a modern animation system, a secure media gateway, an AI assistant, and automated CI/CD quality gates.

## Author

**Jhon Keneth Ryan B. Namias** is an AI and Machine Learning Engineer, Full Stack Engineer, and Automation Specialist based in Manila, Philippines. He designs intelligent, production-grade web applications at the intersection of machine learning, cloud architecture, and automated workflows — from conversational AI and content pipelines to containerized multi-service deployments.

---

## Architecture & Tech Stack

### Monorepo structure

```
Portfolio/
├── portfolio-v1/    Current production portfolio (Next.js 16, Sanity CMS, Tailwind)
├── portfolio-v2/    Next-generation redesign (in progress)
├── ai-service/      Hono + LangGraph AI assistant service
├── studio/          Sanity Studio CMS (21 schema types)
├── scripts/         Sanity import and migration scripts
├── functions/       Sanity Functions
├── docs/            Documentation (security, performance, PRDs, MCP)
├── .agents/         Agent skills and subagents
├── .github/         CI/CD workflows and governance
└── .k8s/            Kubernetes manifests
```

| Project | Status | Stack |
|---------|--------|-------|
| **portfolio-v1** | Live at [namias.tech](https://namias.tech) | Next.js 16, React 18, Tailwind, Sanity, Cloudflare/Vercel |
| **portfolio-v2** | Skeleton | Next.js 16, React 19, Tailwind v4, Sanity CMS |
| **ai-service** | Live | Hono + LangGraph (TypeScript) |

### Core stack

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
| **AI** | Hono + LangGraph assistant with multi-provider failover |
| **Testing** | Vitest + Testing Library + jsdom (122 files, 1,107 tests) |
| **Hosting** | Vercel (primary) + Cloudflare Workers via OpenNext (standby) |

### Highlights

- **Modal-first UX** — Resume, Experience, Booking, and Project Detail modals with smooth transitions
- **Sanity-powered content** — All runtime data served from Sanity CMS with GROQ queries and multi-layer caching
- **Secure media gateway** — `/api/media/[...path]` proxies Sanity assets with HMAC signing
- **AI chat** — LangGraph assistant with persistent thread history
- **Performance** — Multi-tier caching (L1 in-memory, L2 Upstash Redis, L3 CDN), ISR, SWR, image optimization
- **Dark/light theme** — `next-themes` with accent color system
- **Automated CI/CD** — 20 GitHub workflows for validation, security scanning, and deployment

---

## Getting Started

### Local development

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker (recommended)

```bash
# 1. Environment (template -> real values)
cp .env.docker.example .env.docker   # fill in tokens and keys

# 2a. Development (hot reload, volume-mounted)
docker compose up --build

# 2b. Production (multi-stage builds + nginx proxy on :8080)
docker compose -f docker-compose.prod.yml up --build
```

### Local routing (Docker)

| URL | Container service | Stack | Internal port |
| --- | ----------------- | ----- | -------------- |
| `http://localhost:8080/` | `nginx` (reverse proxy) | Nginx 1.27 | 80 |
| `http://localhost:8080/api/ai/*` | `ai-service` (via proxy) | Hono + LangGraph | 8787 |
| `http://localhost:3000` | `portfolio-v1` (Next.js standalone) | Next.js 16 | 3000 |
| `http://localhost:8787` | `ai-service` | Hono + LangGraph + tsx | 8787 |
| `http://localhost:3333` | `studio` (Sanity CMS) | Sanity + Vite | 3333 |

Hot-reload mounts: `./portfolio-v1:/app`, `./ai-service:/app`, `./studio:/app` (anonymous `node_modules` volumes). AI thread history persists in the `ai-data` named volume. Portfolio v2 is excluded from Docker, Compose, K8s, and CI/CD — it is work-in-progress.

### Windows prerequisites

Docker Desktop's Linux engine runs on WSL2, which requires the **Virtual Machine Platform** Windows feature. On Windows 10/11 enable it once (admin PowerShell) and reboot:

```powershell
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

---

## Deployment

### Kubernetes

```bash
# 1. Secrets (never commit populated values)
cp .k8s/secrets-template.yaml .k8s/secrets.yaml
#    fill the base64 values, then:
kubectl apply -f .k8s/secrets.yaml

# 2. Apply the stack
kubectl apply -f .k8s/namespace.yaml
kubectl apply -f .k8s/configmap.yaml
kubectl apply -f .k8s/deployments.yaml
kubectl apply -f .k8s/services.yaml
kubectl apply -f .k8s/ingress.yaml   # needs an nginx Ingress controller + TLS secret `namias-tech-tls`
```

Ingress routing: `/` → `portfolio-v1:3000` (Prefix), `/api/ai/*` → `ai-service:8787` with `rewrite-target: /api/$2` (regex capture, `ImplementationSpecific`). Studio stays internal (ClusterIP) because its SPA assets are root-absolute.

### Dual deployment model

`deploy-frontends.yml` runs Vercel and Cloudflare jobs **in parallel** on every push to `main`. Both jobs deploy `portfolio-v1`; Vercel uses the prebuilt output (`vercel build --prod --prebuilt`) and Cloudflare uses `wrangler deploy` against the existing `wrangler.jsonc` config. Either provider can serve as primary DNS (currently `namias.tech` → Vercel) with the other as a warm standby.

### CI/CD (GitHub Actions)

| Workflow | Trigger | What it does |
| -------- | ------- | ------------ |
| `ci.yml` | PR → `main` | Matrix quality gate: lint + typecheck + tests for `portfolio-v1`, `ai-service`, `studio` |
| `deploy-frontends.yml` | push → `main` | Parallel dual deploy: **Vercel** (CLI, prebuilt) + **Cloudflare Pages/Workers** (wrangler) |
| `docker-publish.yml` | push → `main` (ai/studio paths) | Buildx builds `ghcr.io/pp-namias/{ai-service,studio}` with gha layer cache, tagged `sha-*` + `latest` |

### Required repository secrets

| Secret | Used by | Purpose |
| ------ | ------- | ------- |
| `VERCEL_TOKEN` | deploy-frontends | Vercel auth |
| `VERCEL_ORG_ID` | deploy-frontends | Vercel org scope |
| `VERCEL_PROJECT_ID` | deploy-frontends | Vercel project scope |
| `CLOUDFLARE_API_TOKEN` | deploy-frontends | Wrangler auth (Workers/Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | deploy-frontends | Cloudflare account scope |
| `GHCR_PAT` (optional) | docker-publish | Defaults to `GITHUB_TOKEN`; only needed for cross-repo push |

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

The studio package lives in [`studio/`](./studio/) with its own `package.json`, 21 schema files, 5 custom actions, 42 skill markdown files, and seed data scripts.

---

## Quality Gates

```bash
npm run lint          # ESLint — 0 errors expected
npx tsc --noEmit      # TypeScript strict typecheck
npm run test -- --run # Vitest — 122 files, 1,107 tests, all green
npm run doctor:check  # react-doctor — 100/100 score
```

All four gates run in CI (`ci.yml`) and are enforced locally by the pre-push hook.

## Automated Problem Detection

When monitored workflows fail, automation posts a problem report with suggested solutions on the related PR (or as a repository issue when no PR is linked).

- Detection workflow: `problem-detection-advisor.yml`
- Approval gate: `remediation-approval-gate.yml`

To approve remediation reruns, comment on the PR:

```text
/approve-remediation
```

Only repository owners, members, or collaborators can approve remediation reruns.

---

## Design Acknowledgment

This project draws design inspiration from [bryllim.com](https://bryllim.com/). All implementation code in this repository is original.

## License

Licensed under the MIT License. See [LICENSE](LICENSE).
