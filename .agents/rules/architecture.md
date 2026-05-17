---
trigger: always_on
---

# Architecture

## Intent

Maintain a focused single-repo architecture for the portfolio website, with clear separation between routes, sections, UI primitives, data modules, and Sanity tooling.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Theme**: next-themes
- **Scroll**: Lenis
- **CMS**: Sanity
- **Testing**: Vitest and Playwright

## Project Tree

```text
.
├── .agents/
├── portfolio-resources/
├── public/
├── sanity/
├── scripts/
├── src/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── studio/
├── tests/
└── package.json
```

## Rules

- MUST keep the main experience in `src/app/page.tsx` and section components.
- MUST use modal overlays for expanded homepage content, except the Projects section's click-through behavior.
- MUST keep blog content in SEO-friendly routes only.
- MUST keep Sanity-related logic in dedicated data, schema, and migration files.

## Guidelines

- Use `portfolio-resources/data/*.json` as the source of truth.
- Mirror asset changes into `public/images`.
- Keep component boundaries small and composable.
- Keep server-side data fetching out of client-only sections unless a component genuinely needs interactivity.

## Checks

- No duplicate route shells or hidden page trees.
- No cross-layer imports that skip `src/data`, `src/hooks`, or `src/lib`.
- No stale content paths when the source JSON or asset folders move.

## Anti-patterns

- Adding a new route for content that belongs in a modal.
- Duplicating content in both `src/data` and `portfolio-resources/data`.
- Mixing Sanity migration code into presentation components.
