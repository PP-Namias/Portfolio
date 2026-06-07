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

Production portfolio for [namias.tech](https://namias.tech) — a modal-first, Sanity-driven Next.js application with a modern animation system, secure media gateway, AI chat, and automated CI/CD quality gates.

### Highlights

- **Modal-first UX** — Resume, Experience, Booking, and Project Detail modals with smooth transitions
- **Sanity-powered content** — All runtime data served from Sanity CMS with GROQ queries and multi-layer caching
- **Secure media gateway** — `/api/media/[...path]` proxies Sanity assets with optional HMAC signing
- **AI chat** — Gemini-driven assistant at `/api/chat` with preset responses for common queries
- **Performance** — Multi-tier caching (L1 in-memory, L2 Upstash Redis, L3 CDN), ISR, SWR, image optimization
- **Dark/light theme** — `next-themes` with accent color system
- **Automated CI/CD** — 19 GitHub workflows for validation, security scanning, and deployment

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
| **Testing** | Vitest + Testing Library + jsdom (278 tests) |
| **Hosting** | Cloudflare Workers via OpenNext |

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
├── tests/                    # 31 test files
├── next.config.js
├── tailwind.config.ts
├── eslint.config.mjs
└── package.json
```

---

## Quality checks

```bash
npm run lint      # ESLint — 0 errors expected
npm run test      # Vitest — 278 tests, all green
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

Licensed under the MIT License. See [LICENSE](../LICENSE).
