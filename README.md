<p align="center">
  <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" alt="Jhon Keneth Ryan Namias" width="160" style="border-radius: 50%;">
</p>

<h1 align="center">PP Namias Portfolio</h1>

<p align="center">
  A modal-first, Sanity-driven Next.js portfolio with AI chat, secure media gateway, and automated CI/CD.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#features">Features</a> ·
  <a href="docs/security/dashboard.md">Security</a> ·
  <a href="docs/prd/prd.media-signature-fix.json">Architecture</a> ·
  <a href="https://namias.tech">Live Site</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react--doctor-100%2F100-22c55e?style=flat-square" alt="react-doctor 100/100">
  <img src="https://img.shields.io/badge/Security%20Posture-98%2F100-22c55e?style=flat-square" alt="Security 98/100">
  <img src="https://img.shields.io/badge/Tests-410%2F410-22c55e?style=flat-square" alt="410 tests passing">
  <img src="https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript strict">
  <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square" alt="MIT License">
</p>

<p align="center">
  <img src="assets/screenshots/home.png" alt="Portfolio Home" width="800">
</p>

---

## Quick Start

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sanity Studio runs separately on [http://localhost:3333](http://localhost:3333):

```bash
cd studio && pnpm install && pnpm run dev
```

Deployment, environment variables, and Cloudflare setup live in the [deployment guide](./docs/prd/prd.media-signature-fix.json).

## Features

- **Modal-first UX** — Resume, Experience, Booking, and Project Detail modals with Framer Motion transitions.
- **Sanity CMS** — 21 schema types, GROQ queries, multi-layer cache, visual editing, real-time preview.
- **Secure media gateway** — HMAC-signed image proxy at `/api/media/[...path]` with 7-day TTL and unsigned fallback.
- **AI chat** — Gemini-powered assistant with multi-provider failover (Gemini → OpenAI) and preset responses.
- **Dark/light theme** — `next-themes` with 8 accent color options.
- **Gallery** — Masonry grid with lightbox navigation and keyboard support.
- **Blog** — MDX content with code highlighting, reading time, and SEO-optimized meta.
- **Certifications** — Filterable grid with lightbox detail view and issuer badges.
- **Performance** — ISR on all content pages, SWR for client data, image optimization via Sanity CDN.
- **CI/CD** — 19 GitHub workflows: lint, typecheck, 410 tests, react-doctor, PentestAgent, Trivy, CodeQL.

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

<!-- Drop your screenshots into assets/screenshots/ -->

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + Framer Motion + Lucide React |
| CMS | Sanity v3 (Studio + Content Lake + CDN) |
| Data | SWR + multi-layer cache (memory → Upstash Redis → CDN) |
| AI | Gemini 2.0 Flash with OpenAI failover |
| Hosting | Cloudflare Workers via OpenNext |
| CI/CD | GitHub Actions (19 workflows) |
| Testing | Vitest + Testing Library (410 tests) |

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all 410 tests
npm run doctor       # react-doctor quality check
npm run cloudflare:deploy  # Deploy to Cloudflare Workers
```

## Security

Continuously tested via [PentestAgent](https://github.com/GH05TCREW/pentestagent) with 25 playbooks covering OWASP Top 10. Seven-stage CI/CD pipeline on every PR. Full details in [`docs/security/dashboard.md`](./docs/security/dashboard.md).

| Check | Tool | Status |
|---|---|---|
| Security Posture | PentestAgent + Trivy + CodeQL | [98/100](./docs/security/dashboard.md) |
| React Quality | react-doctor 0.4.0 | [100/100](./docs/react-doctor/scoreboard.md) |
| CI/CD Gate | Gitleaks, OSV-Scanner, Trivy, zizmor, Checkov, Cosign | All passing |

## Star History

<a href="https://www.star-history.com/?repos=PP-Namias/Portfolio&type=date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=PP-Namias/Portfolio&type=date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=PP-Namias/Portfolio&type=date" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=PP-Namias/Portfolio&type=date" />
 </picture>
</a>

## License

MIT -- see [LICENSE](LICENSE).
