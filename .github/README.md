# PP Namias Portfolio

| Profile | Details |
| --- | --- |
| ![Jhon Keneth Ryan Namias profile image](../public/images/profile/PP%20Namias.png) | **Jhon Keneth Ryan Namias (PP Namias)** · Project Manager @ MASH · Full Stack Engineer & AI Automation Specialist · Manila, Philippines · Available for collaboration · [![Resume](https://img.shields.io/badge/Resume-View%20PDF-db2777?style=for-the-badge)](../public/resume.pdf) [![Book a Call](https://img.shields.io/badge/Book%20a%20Call-Cal.com-111827?style=for-the-badge&logo=calendar&logoColor=white)](https://cal.com/pp-namias) [![Email](https://img.shields.io/badge/Email-pp.namias%40gmail.com-2563eb?style=for-the-badge&logo=gmail&logoColor=white)](mailto:pp.namias@gmail.com) · [![Live Portfolio](https://img.shields.io/badge/Live%20Portfolio-namias.tech-16a34a?style=flat-square&logo=vercel&logoColor=white)](https://namias.tech) [![GitHub](https://img.shields.io/badge/GitHub-PP--Namias-181717?style=flat-square&logo=github)](https://github.com/PP-Namias) [![LinkedIn](https://img.shields.io/badge/LinkedIn-pp--namias-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pp-namias/) ![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square) |

## About this repository

This repository powers [namias.tech](https://namias.tech), a production portfolio built with a modal-first UX, modern animation system, and automated quality checks.

### Highlights

- Homepage-first architecture with modal flows for Resume, Experience, and Booking
- SEO routes for blog content (`/blog`, `/blog/[slug]`)
- AI chat endpoint at `/api/chat` using Gemini
- Dark/light theme support with an accent color system
- CI validation for lint, tests, and production build

## Core stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + Framer Motion + Lucide React
- **Theme:** `next-themes`
- **Content:** `react-markdown`, `remark-gfm`, `rehype-highlight`
- **Testing:** Vitest + Testing Library + jsdom
- **Hosting target:** AWS Amplify (`output: 'standalone'`)

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

## Environment variables

Create a `.env` file in the project root based on `.env.example`:

```bash
GOOGLE_GEMINI_API_KEY=your_key_here
```

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

## Documentation map

- [Contributing Guide](../CONTRIBUTING.md)
- [Security Policy](../SECURITY.md)
- [Support](../SUPPORT.md)
- [Publication Plan](../docs/REPO_PUBLICATION_PLAN.md)
- [Branch Protection Blueprint](../docs/BRANCH_PROTECTION_RULESET.md)
- [Public Repo Settings Checklist](../docs/PUBLIC_REPO_SETTINGS_CHECKLIST.md)
- [Reference Index](../docs/REFERENCE_INDEX.md)

## Design acknowledgment

This project draws design inspiration from [bryllim.com](https://bryllim.com/). All implementation code in this repository is original.

## License

Licensed under the MIT License. See [../LICENSE](../LICENSE).
