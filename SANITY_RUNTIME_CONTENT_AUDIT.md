# SANITY-FULL-001 Runtime Content Source Audit

Last updated: 2026-05-27
Slice ID: SANITY-FULL-001
Status: Complete

## Goal

Audit and map all current runtime content sources in the portfolio app to identify what is already Sanity-driven and what still depends on local JSON/public assets.

## Scope

Included:
- Runtime content fetch and provider flow
- Local JSON fallback behavior
- Runtime local media path usage (`/images/*`, `/resume.pdf`)
- Environment wiring for Sanity project/dataset

Excluded:
- Full refactor/cutover implementation (future slices)
- Deletion of legacy content files (future slices)

## Files Audited

Core runtime and content flow:
- `src/lib/cms-content.server.ts`
- `src/lib/cms-content.shared.ts`
- `src/lib/cms-data.ts`
- `src/hooks/useCmsContent.tsx`
- `src/app/layout.tsx`
- `src/app/providers.tsx`

Runtime UI/media usage checkpoints:
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/ProjectsSection.tsx`
- `src/components/sections/CertificationsSection.tsx`
- `src/components/sections/GallerySection.tsx`
- `src/components/ui/ProjectCard.tsx`
- `src/components/ui/ProjectDetailModal.tsx`
- `src/components/ui/HubMenu.tsx`
- `src/components/ui/ChatPanel.tsx`
- `src/components/ui/ResumeModal.tsx`
- `src/app/api/resume/route.ts`

Studio and environment alignment:
- `studio/sanity.config.ts`
- `studio/sanity.cli.ts`
- `.env`
- `.env.example`
- `.env.local`

## Current Runtime Data Architecture (Observed)

1. `src/app/layout.tsx` calls `getCmsContent()` from `src/lib/cms-content.server.ts`.
2. Result is injected via `CmsContentProvider` in `src/app/providers.tsx`.
3. Sections/components read content from `useCmsContent()`.
4. If Sanity core documents are missing/unavailable, `getCmsContent()` returns `fallbackCmsContent` from `src/lib/cms-content.shared.ts`.
5. `fallbackCmsContent` is built from local JSON files in `portfolio-resources/data/*.json`.

Conclusion:
- Runtime is Sanity-first, but still explicitly dual-source due to fallback JSON path.

## Content Source Mapping (Runtime)

| Domain | Primary Runtime Source | Fallback Source | Notes |
| --- | --- | --- | --- |
| Profile | Sanity `profile` document | `portfolio-resources/data/profile.json` | Hard dependency: fallback kicks in when `profile` or `techStack` missing. |
| Experiences | Sanity `experience` | `portfolio-resources/data/experiences.json` | Normalized in server mapper. |
| Projects | Sanity `project` | `portfolio-resources/data/projects.json` | UI still builds local image paths for project media. |
| Certifications | Sanity `certification` | `portfolio-resources/data/certifications.json` | Section keeps local fallback image constant path. |
| Gallery | Sanity `galleryImage` | `portfolio-resources/data/gallery.json` | UI still references local gallery image paths. |
| Tech Stack | Sanity `techStack` | `portfolio-resources/data/technologies.json` | Required for non-fallback return path. |
| Blog posts | Sanity `post` | `portfolio-resources/data/blog.json` | Cover image currently mapped to `/images/blog/*` local path. |
| Memberships | Sanity `membership` | `portfolio-resources/data/memberships.json` | Fallback retained via shared content. |
| Recommendations | Sanity `recommendation` | `portfolio-resources/data/recommendations.json` | Fallback retained via shared content. |
| Social links | Sanity `heroSection.socialLinks` | `portfolio-resources/data/socials.json` | Runtime mapping normalizes icon/platform. |
| Resume | Sanity `resume` API route | `/resume.pdf` | Explicit local fallback remains active by design. |

## Runtime Local Asset Dependencies Still Present

Direct `/images/*` usage in runtime code:
- Profile images:
  - `src/components/sections/HeroSection.tsx`
  - `src/components/ui/HubMenu.tsx`
  - `src/components/ui/ChatPanel.tsx`
- Project images:
  - `src/components/sections/ProjectsSection.tsx`
  - `src/components/ui/ProjectCard.tsx`
  - `src/components/ui/ProjectDetailModal.tsx`
- Certification images:
  - `src/components/sections/CertificationsSection.tsx`
- Gallery images:
  - `src/components/sections/GallerySection.tsx`
- Blog cover mapping to local path:
  - `src/lib/cms-content.server.ts`

Direct `/resume.pdf` local fallback:
- `src/app/api/resume/route.ts`
- `src/components/ui/ResumeModal.tsx`

## Legacy Local JSON Dependency Surface

Primary fallback dependency chain:
- `src/lib/cms-content.server.ts` -> `src/lib/cms-content.shared.ts` -> `portfolio-resources/data/*.json`

Legacy compatibility module:
- `src/lib/cms-data.ts` imports all `portfolio-resources/data/*.json` and is re-exported by `src/data/*.ts`.
- `src/data/*.ts` is still consumed broadly in tests.
- Runtime direct `@/data/*` usage is mostly removed, but one runtime import remains in `src/components/sections/HeroSection.tsx`.

## Environment and Connection Check

Observed values are aligned across `.env`, `.env.example`, and `.env.local` for:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_CUTOVER_ENABLED=true`

Studio config resolves project/dataset through:
- `SANITY_STUDIO_PROJECT_ID` fallback to `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `SANITY_STUDIO_DATASET` fallback to `NEXT_PUBLIC_SANITY_DATASET`

Conclusion:
- Canonical project/dataset wiring is consistent for current local setup.

## Key Findings (Actionable for Next Slices)

1. Sanity is already the primary read path, but fallback JSON is still runtime-active.
2. Multiple production UI paths still rely on local `/images/*` assembly instead of Sanity asset URLs.
3. Blog cover mapping currently forces local `public/images/blog/*` path construction.
4. Resume flow still intentionally retains `/resume.pdf` fallback.
5. Legacy `src/lib/cms-data.ts` and `src/data/*.ts` remain for compatibility/tests and must be removed in later cleanup slices.

## Recommended Slice Follow-up Order

1. SANITY-FULL-002: finalize schema/type parity and asset URL contract per content type.
2. SANITY-FULL-003: harden parity report and add strict runtime-read readiness checks.
3. SANITY-FULL-004 onward: section-by-section runtime cutover from local image paths to Sanity asset URLs.
4. SANITY-FULL-009+: remove fallback JSON and legacy `src/data` bridge after parity and smoke gates.

## Acceptance Check for SANITY-FULL-001

- Runtime source inventory documented: yes.
- Local JSON fallback chain identified: yes.
- Local media path dependencies identified: yes.
- Env/studio connection mapping captured: yes.
- Next slices informed by concrete findings: yes.
