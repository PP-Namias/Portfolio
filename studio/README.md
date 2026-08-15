# Namias CMS Studio

Standalone Sanity CMS studio at the repo root. Serves both portfolio-v1 and portfolio-v2 from the same dataset.

## Quick Start

```bash
cd studio
pnpm install
pnpm dev
```

Studio runs at `http://localhost:3333`.

## Configuration

1. Copy `.env.example` to `.env.local`
2. Fill in the required environment variables
3. Run `pnpm dev`

See `.env.shared.example` for all available variables.

## Consumer Setup

### Portfolio V1

Portfolio v1 reads from the same Sanity dataset. Ensure v1 has these env vars:

```bash
# portfolio-v1/.env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
```

### Portfolio V2

Portfolio v2 reads from the same Sanity dataset. Ensure v2 has these env vars:

```bash
# portfolio-v2/.env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
```

## Schema Types

- **Singletons**: profile, siteSettings, techStack, seoSettings, mediaSettings, aboutSection, resume
- **Collections**: project, experience, certification, galleryImage, recommendation, membership, post
- **References**: author, category, certificationCategory, certificationIssuer, galleryCategory

## Studio Features

- **Structure Tool** — curated content navigation
- **Presentation Tool** — visual editing on namias.tech
- **Vision Tool** — GROQ playground
- **Sanity Assist** — AI-powered content suggestions
- **Custom Badges** — draft/live, scheduled, stale, expiring, featured
- **Custom Actions** — publish+refresh, perspective switcher, view on site
- **Inspector Panels** — content health, SEO preview, JSON inspector, data consistency

## Deployment

```bash
pnpm deploy
```

Deploys to Sanity Hosting at `namias-cms.sanity.studio`.

## Development

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript check
```
