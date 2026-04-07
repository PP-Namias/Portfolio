# PP Namias Portfolio

A modern, production-ready portfolio built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, deployed with AWS-oriented workflows and GitHub automation.

- **Owner:** Jhon Keneth Ryan Namias (PP Namias)
- **Live site:** [https://namias.tech](https://namias.tech)
- **Repository:** [https://github.com/PP-Namias/Portfolio](https://github.com/PP-Namias/Portfolio)

## What this project includes

- Modal-first portfolio experience (resume, experience details, booking)
- Blog listing and blog post pages (`/blog`, `/blog/[slug]`)
- AI chat API endpoint (`/api/chat`) using Gemini
- Light/dark themes with accent color system
- CI workflows for quality, security, and production health checks

## Core stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS + Framer Motion + Lucide React
- **Theme:** `next-themes`
- **Content rendering:** `react-markdown`, `remark-gfm`, `rehype-highlight`
- **Testing:** Vitest + Testing Library + jsdom
- **Hosting:** AWS Amplify (`next.config.js` uses `output: 'standalone'`)

## Quick start

### Prerequisites

- Node.js 18+
- npm

### Local setup

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
- `npm run start` — run production server
- `npm run lint` — run ESLint (Next.js config)
- `npm run test` — run Vitest once
- `npm run test:watch` — run Vitest in watch mode

## Environment variables

Create a `.env` file in project root using `.env.example`:

```bash
GOOGLE_GEMINI_API_KEY=your_key_here
```

## Quality and validation

Run these before opening a PR:

```bash
npm run lint
npm run build
npm run test
```

CI workflows in `.github/workflows/` enforce the same checks for pushes and pull requests.

## Deployment notes

- AWS Amplify build config is defined in `amplify.yml`
- Next.js standalone output is enabled in `next.config.js`
- Production health checks are automated via GitHub Actions

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

- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Support](SUPPORT.md)
- [Publication Plan](docs/REPO_PUBLICATION_PLAN.md)
- [Branch Protection Blueprint](docs/BRANCH_PROTECTION_RULESET.md)
- [Public Repo Settings Checklist](docs/PUBLIC_REPO_SETTINGS_CHECKLIST.md)
- [Reference Index](docs/REFERENCE_INDEX.md)

## Design acknowledgment

This project draws design inspiration from [bryllim.com](https://bryllim.com/). All implementation code in this repository is original.

## License

Licensed under the MIT License. See [LICENSE](LICENSE).
