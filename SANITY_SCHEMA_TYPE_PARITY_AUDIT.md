# SANITY-FULL-002 Schema and Type Parity Audit + Gap Closure Plan

Last updated: 2026-05-27
Slice ID: SANITY-FULL-002
Status: Complete

## Goal

Verify parity between:
- Sanity Studio schemas (`studio/schemaTypes/*`)
- Runtime CMS mapper (`src/lib/cms-content.server.ts`)
- App type contracts (`src/types/index.ts`)

Then define a concrete gap-closure plan for upcoming implementation slices.

## Scope

Included:
- Field-level schema/type parity for runtime domains
- Mapping transformations in current server loader
- Gaps that block full Sanity-first runtime consistency

Excluded:
- Runtime cutover refactors (future slices)
- Data deletion and fallback removal (future slices)

## Files Audited

Schemas:
- `studio/schemaTypes/profile.ts`
- `studio/schemaTypes/experience.ts`
- `studio/schemaTypes/project.ts`
- `studio/schemaTypes/certification.ts`
- `studio/schemaTypes/galleryImage.ts`
- `studio/schemaTypes/heroSection.ts`
- `studio/schemaTypes/aboutSection.ts`
- `studio/schemaTypes/techStack.ts`
- `studio/schemaTypes/post.ts`
- `studio/schemaTypes/membership.ts`
- `studio/schemaTypes/recommendation.ts`
- `studio/schemaTypes/resume.ts`
- `studio/schemaTypes/siteSettings.ts`
- `studio/schemaTypes/author.ts`
- `studio/schemaTypes/category.ts`
- `studio/schemaTypes/certificationCategory.ts`
- `studio/schemaTypes/certificationIssuer.ts`
- `studio/schemaTypes/galleryCategory.ts`

Runtime and contracts:
- `src/lib/cms-content.server.ts`
- `src/types/index.ts`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/ConnectSection.tsx`
- `src/components/sections/SpeakingSection.tsx`

## Parity Matrix

| Domain | Schema status | Runtime mapper status | Type contract status | Parity result |
| --- | --- | --- | --- | --- |
| Profile | `profile` schema present (`fullName`, highlights, education) | Mapped to `Profile` with name transform (`fullName` -> `name`) | `Profile` complete for current usage | Partial parity (transform-based) |
| Experience | `experience` schema present (`role`, `location`, `workModel`, `employmentType`, `tags`) | Mapped to app fields (`position`, `country`, `modality`, `type`, `technologies`) | `Experience` includes `relatedProjects` not sourced from schema | Partial parity (field-name drift) |
| Project | `project` schema present but no `detailUrl`, `processUrl`, `previewVideoUrl` | Sets `detailURL` from `liveUrl`; `processURL` null; no preview video mapping | `Project` expects optional `detailURL`, `processURL`, `previewVideoURL` | Gap (missing schema fields) |
| Certification | `certification` schema has issuer/category refs, tags, image, `credentialUrl` | Maps issuer title, image filename/url, tags | `Certification` lacks `credentialUrl`/category metadata | Partial parity (extra schema fields unused) |
| Gallery | `galleryImage` schema has media metadata + image + category | Maps title/mediaType/tags/date/media file/path | `GalleryItem` omits category/alt | Partial parity (extra schema fields unused) |
| Tech stack | `techStack` schema aligns to `name/logo/category/proficiency` | Directly mapped | `Technology` aligns | Full parity (current contract) |
| Social links | `heroSection.socialLinks` supports `platform`, `icon`, `url`, `whatsappNumber`, `placements` | Mapper requires `url` and ignores `whatsappNumber` fallback logic | `SocialLink` derived fields (`label`, `featured`) are mapper-generated | Gap (WhatsApp path can be dropped) |
| Blog post | `post` schema includes slug/body/tags/author/categories/image/path | Mapper returns app blog shape; still rewrites cover image to local `/images/blog/*` | `BlogPost` lacks author/categories/featured | Partial parity + media-path gap |
| Membership | `membership` schema aligns (`name`, `url`, `joinedAt`) | Direct mapping | Type aligns | Full parity |
| Recommendation | `recommendation` schema aligns (`quote`, `name`, `title`, `company`) | Direct mapping | Type aligns | Full parity |
| Resume | `resume` schema supports `resumeFile`, `resumeUrl`, `isActive` | API route reads active resume with local fallback | No dedicated shared type for API payload | Partial parity |
| About singleton | `aboutSection` schema exists | Not used by runtime sections | No app type contract | Gap (schema exists, runtime unused) |
| Site settings singleton | `siteSettings` schema exists | Not used by runtime sections | No app type contract | Gap (schema exists, runtime unused) |
| Blog taxonomies | `author`, `category` schemas exist | Queried in posts but not surfaced to app types/components | No app-level taxonomy type usage in `BlogPost` | Partial parity |

## Confirmed Gap List

### High priority gaps

1. Project URL parity gap
- Missing in schema: explicit `detailUrl`, `processUrl`, `previewVideoUrl`.
- Runtime currently infers `detailURL` from `liveUrl` and drops `processURL`.

2. Hero social link WhatsApp gap
- Schema allows `whatsappNumber` without `url`.
- Runtime `mapSocialLink` requires `url`; WhatsApp-only records can be skipped.

3. Blog media path gap
- Runtime maps blog cover image to local `/images/blog/*` paths.
- This is incompatible with final Sanity-only media objective.

### Medium priority gaps

4. Experience naming drift
- Schema: `role/location/workModel/employmentType/tags`.
- App type: `position/country/modality/type/technologies`.
- Works via transform but increases maintenance cost.

5. About/Site settings runtime gap
- `aboutSection` and `siteSettings` exist in Studio but are not consumed by runtime.

6. Taxonomy visibility gap
- `author` and `category` are queried but not exposed in `BlogPost` contract.

### Low priority / deferred

7. Certification extra metadata
- `credentialUrl` and category references exist in schema but are not in app contract.

8. Gallery extra metadata
- Category and alt are present in schema but not in app contract.

## Gap Closure Plan

## Track A: Contract alignment (schema <-> mapper <-> app types)

1. Add missing project URL fields to `project` schema:
- `detailUrl` (url/string)
- `processUrl` (url/string)
- `previewVideoUrl` (url/string)

2. Update runtime mapper in `cms-content.server.ts`:
- Map new project URL fields directly to app contract.
- Stop deriving `detailURL` from `liveUrl` as default behavior once data is populated.

3. Decide naming normalization approach for experience:
- Option 1: Keep schema names and transform in mapper (current).
- Option 2: Introduce app-normalized fields in schema.
- Recommendation: keep transform mapping for backward compatibility; document clearly.

## Track B: Runtime adoption of existing singleton schemas

4. Integrate `aboutSection` into `AboutSection` rendering path.
5. Integrate `siteSettings` labels/copy into section headers and CTA labels.

## Track C: Media and social-link correctness

6. Update social-link mapping logic:
- Derive WhatsApp URL from `whatsappNumber` when `platform === 'whatsapp'` and URL is empty.

7. Update blog image mapping to Sanity-first asset URL behavior:
- Prefer `mainImage.asset->url` from Sanity.
- Keep temporary fallback only while migration gate remains active.

## Track D: Optional enrichment

8. Extend `BlogPost` contract if needed for author/categories UI features.
9. Extend `Certification` and `GalleryItem` contracts only if UI needs these fields.

## Proposed Execution Order

1. SANITY-FULL-003: parity-report hardening + explicit checks for missing project URL fields and hero social integrity.
2. SANITY-FULL-004: profile/hero/about contract adoption and singleton runtime usage.
3. SANITY-FULL-005: project + experience + certification contract alignment.
4. SANITY-FULL-006/007: gallery/blog/resume/social refinements and media path cleanup.

## Exit Criteria for SANITY-FULL-002

- Schema/type parity matrix documented: yes.
- Gap list prioritized by impact: yes.
- Closure plan split by implementation tracks: yes.
- Next-slice dependencies and order clarified: yes.
