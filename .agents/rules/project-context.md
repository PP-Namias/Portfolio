---
trigger: always_on
---

# Project Context

## The Why

This is the official portfolio of Jhon Keneth Ryan Namias (PP Namias). The site presents projects, experience, certifications, gallery media, blog content, and an AI-assisted contact flow for the domain `namias.tech`.

## The System

- **App**: Single Next.js 15 portfolio application with App Router in `src/app`.
- **UI**: Section components live in `src/components/sections`; shared primitives live in `src/components/ui`.
- **Data**: Typed data modules in `src/data` consume `portfolio-resources/data/*.json`.
- **Assets**: Public imagery is mirrored from `portfolio-resources/assets/images` to `public/images`.
- **Sanity**: Schema, migration, and standalone studio files live in `sanity/`, `scripts/`, and `studio/`.
- **Validation**: Repository scripts are `npm run lint`, `npm run build`, `npm run test`, and `npm run test:e2e`.

## Decision Making Context

Technical decisions should prioritize reliability, performance, accessibility, and premium presentation. Every UI change must preserve the existing modal-first system, the Projects hover-first image-zoom-only behavior, and the light/dark token strategy.

## Awareness Rules

- MUST keep `portfolio-resources/data` as the source of truth for content.
- MUST keep `public/images` aligned with the source assets.
- MUST keep Sanity schema, migration scripts, and typed data modules in sync when content models change.
- MUST avoid creating unnecessary routes or extra layout shells.
