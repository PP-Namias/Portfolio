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

<p align="center">
  <a href="./docs/README_ja.md">日本語</a> ·
  <a href="./docs/README_zh.md">中文</a> ·
  <a href="./docs/README_ko.md">한국어</a> ·
  <a href="./docs/README_es.md">Español</a> ·
  <a href="./docs/README_fr.md">Français</a> ·
  <a href="./docs/README_de.md">Deutsch</a> ·
  <a href="./docs/README_pt.md">Português</a> ·
  <a href="./docs/README_ru.md">Русский</a>
</p>

<p align="center">
  <img src="assets/screenshots/home.png" alt="Portfolio Home" width="800">
</p>

---

## About

Production portfolio for [namias.tech](https://namias.tech) — a modal-first, Sanity-driven Next.js application with a modern animation system, secure media gateway, AI chat, and automated CI/CD quality gates.

### Monorepo Structure

```
Portfolio/
├── portfolio-v1/    ← Current portfolio (Next.js 15, Sanity CMS, Tailwind)
├── portfolio-v2/    ← Next-gen redesign (in progress)
├── docs/            ← Shared docs (security, MCP)
├── .github/         ← CI/CD workflows (target portfolio-v1/)
└── .agents/         ← Agent skills and subagents
```

| Project | Status | Stack |
|---------|--------|-------|
| **portfolio-v1** | Live at [namias.tech](https://namias.tech) | Next.js 15, React 18, Tailwind, Sanity, Cloudflare |
| **portfolio-v2** | Skeleton | Next.js 15, React 19, Tailwind v4, Sanity CMS |

```bash
# Work on v1
cd portfolio-v1 && npm install && npm run dev

# Work on v2
cd portfolio-v2 && npm install && npm run dev
```

### Highlights

- **Modal-first UX** — Resume, Experience, Booking, and Project Detail modals with smooth transitions
- **Sanity-powered content** — All runtime data served from Sanity CMS with GROQ queries and multi-layer caching
- **Secure media gateway** — `/api/media/[...path]` proxies Sanity assets with optional HMAC signing
- **AI chat** — Gemini-driven assistant at `/api/chat` with preset responses for common queries
- **Performance** — Multi-tier caching (L1 in-memory, L2 Upstash Redis, L3 CDN), ISR, SWR, image optimization
- **Dark/light theme** — `next-themes` with accent color system
- **Automated CI/CD** — 19 GitHub workflows for validation, security scanning, and deployment

---

## Screenshots

<table>
  <tr>
    <td align="center">
      <img src="assets/screenshots/projects.png" alt="Projects" width="400">
      <br>
      <em>Projects — 3D card grid with hover transforms</em>
    </td>
    <td align="center">
      <img src="assets/screenshots/blog.png" alt="Blog" width="400">
      <br>
      <em>Blog — Cover images and MDX content</em>
    </td>
  </tr>
</table>

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
| **Testing** | Vitest + Testing Library + jsdom (410 tests) |
| **Hosting** | Cloudflare Workers via OpenNext |

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

## Getting started

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
Portfolio/
├── .github/                  # 19 CI/CD workflows, templates, governance
├── .agents/                  # OpenCode agent skills
├── docs/                     # Documentation (performance, security, studio)
├── studio/                   # Sanity Studio CMS (21 schema types)
├── scripts/                  # Sanity import and migration scripts
├── functions/                # Sanity Functions
├── public/                   # Static assets (favicon, OG image, SW)
├── src/
│   ├── app/                  # App Router: pages, API routes, layout
│   │   ├── api/              # chat, media, resume, webhook, cache
│   │   ├── blog/             # Blog list and [slug] pages
│   │   └── studio/           # Studio landing page
│   ├── components/           # UI (27), sections (12), CMS, SEO
│   ├── hooks/                # 6 custom React hooks
│   ├── lib/                  # Cache, media gateway, SWR config
│   ├── types/                # TypeScript interfaces
│   └── middleware.ts         # Rate limiting
├── tests/                    # 43 test files (410 tests)
├── next.config.js
├── tailwind.config.ts
├── eslint.config.mjs
└── package.json
```

---

## Quality checks

```bash
npm run lint      # ESLint — 0 errors expected
npm run test      # Vitest — 410 tests, all green
npm run doctor    # react-doctor — 100/100 score
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

## License

Licensed under the MIT License. See [LICENSE](LICENSE).
