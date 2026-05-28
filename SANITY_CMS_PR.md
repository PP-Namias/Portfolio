# Sanity CMS Full Integration PR

## Summary

This branch completes the portfolio's move to a Sanity-backed CMS architecture. Runtime content, media delivery, previews, and editorial workflows now center on Sanity Studio instead of local JSON fixtures and hardcoded content.

## What Was Added

### Content architecture
- Sanity-backed loaders for profile, hero, about, experience, projects, certifications, gallery, blog, memberships, recommendations, socials, tech stack, and site settings.
- Shared CMS fallback contract for defensive rendering and tests.
- Normalized content mapping in `src/lib/cms-content.server.ts`.

### Schema and Studio
- `seoSettings` singleton for site title, description, canonical URL, social preview images, and robots controls.
- `mediaSettings` singleton for media defaults and fallback guidance.
- Formalized `profile` singleton with avatar, resume, availability, and contact identity fields.
- Richer `project` and `experience` schemas with challenge/solution/result, featured story, status, media metadata, and ordering support.
- Blog post metadata fields including featured, meta title, and meta description.
- Site settings fields for footer copy, blog copy, announcement banner, empty states, and section labels.
- Recommendation editorial fields for featured, relationship, company URL, and avatar.

### Runtime behavior
- Root metadata now reads from `seoSettings`.
- Blog pages use CMS-backed metadata and fallback post data.
- Media URLs route through the secure server-side media gateway.
- Resume flow uses CMS-aware runtime resolution with fallback support.
- Connect section now prioritizes scheduling a meeting instead of email send.

### UX and content delivery
- Booking modal for scheduling meetings via Cal.com.
- Contact modal with topic presets and draft persistence.
- Blog list/detail rendering with CMS-aware fallback posts.
- Centralized footer and blog copy from site settings.
- Consistent icon sizing and action presentation across key surfaces.

### Maintenance and workflows
- Sanity import, parity, and readiness tooling.
- Studio structure, preview, and query pack docs.
- Webhook and media gateway hardening.

## Validation

- `npm run test -- src/__tests__/components/sections-uncovered.test.tsx`
- `npm run test -- src/__tests__/app/blog-uncovered.test.tsx`
- `npm run lint`
- `npm run build`

## Notes

- Legacy migration planning and audit docs were removed to keep the repo cleaner.
- The remaining README and active prompt files cover the operational workflows that still matter.
