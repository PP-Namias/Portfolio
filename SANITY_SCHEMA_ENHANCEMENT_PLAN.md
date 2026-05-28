# Sanity Schema Enhancement Plan

Last updated: 2026-05-28  
Project: PP Namias Portfolio (`namias.tech`)

## Goal

Expand the Sanity content model so the portfolio is easier to manage, safer to maintain, and more flexible for future editorial updates.

## Priority Order

### 1. `seoSettings` singleton

Why first:
- Controls site-wide metadata and search presentation.
- Reduces duplicated SEO logic in app code.

Suggested fields:
- site title
- site description
- canonical URL
- OG image
- Twitter card image
- noindex / nofollow toggles
- structured data defaults

### 2. `mediaSettings` singleton

Why second:
- Standardizes image behavior across the site.
- Helps keep media metadata and fallbacks consistent.

Suggested fields:
- default alt text guidance
- fallback images
- image quality presets
- aspect ratio presets
- allowed media kinds
- caption / credit defaults

### 3. `profile` singleton

Why third:
- Gives the app one canonical owner profile source.
- Prevents contact and identity data from drifting across sections.

Suggested fields:
- name
- role/title
- bio/summary
- avatar
- contact methods
- social links
- resume link
- availability label

### 4. Asset metadata enrichment

Why fourth:
- Improves accessibility and editorial quality.
- Makes gallery, project, and blog images more reusable.

Suggested fields:
- alt text
- caption
- credit
- source
- license
- focal point/hotspot
- dominant color

### 5. Richer `projects`

Why fifth:
- Projects are a primary portfolio showcase.
- They benefit from more editorial structure and stronger storytelling.

Suggested fields:
- featured flag
- hero media
- impact metrics
- challenge / solution / result
- external links
- tech stack
- sort order
- status / content state

### 6. Richer `experience`

Why sixth:
- Experience content is high-value for credibility.
- Better structure improves modal content and future filtering.

Suggested fields:
- achievements
- impact bullets
- tools/tech
- location
- company logo
- media gallery
- featured story

### 7. Blog SEO/editor fields

Why seventh:
- Blog posts need stronger publishing controls and metadata.

Suggested fields:
- reading time
- cover alt
- excerpt
- canonical slug
- published date
- featured flag
- related posts
- author/category references

### 8. Navigation and footer link management

Why eighth:
- Centralizes global UI links and reduces hardcoded duplication.

Suggested fields:
- primary nav links
- footer links
- social links placement
- quick action links

### 9. Testimonials / recommendations

Why ninth:
- Replaces placeholder-heavy content with editorially managed entries.

Suggested fields:
- quote
- name
- title
- company
- avatar/logo
- relationship context
- featured flag

### 10. `siteSettings` expansion

Why tenth:
- Lets non-structural copy live in one place.

Suggested fields:
- section copy
- CTA labels
- empty states
- badge text
- legal/footer copy
- announcement banner

### 11. Content status fields

Why eleventh:
- Makes editorial intent explicit across collections.

Suggested fields:
- draft
- published
- archived
- featured
- pinned

### 12. Revalidation / preview helpers

Why last:
- Supports operational workflows after content structure is stable.

Suggested fields:
- preview path
- sync markers
- editorial notes for revalidation
- webhook documentation fields

## Recommended Implementation Phases

### Phase 1
- Add `seoSettings`.
- Add `mediaSettings`.
- Add or formalize `profile`.

### Phase 2
- Enrich asset metadata across media-bearing schemas.
- Expand `projects` and `experience`.

### Phase 3
- Improve blog metadata and social/navigation centralization.
- Replace placeholder recommendations with real editorial content.

### Phase 4
- Expand `siteSettings`.
- Add consistent status/visibility fields.
- Add preview and revalidation support fields.

## Acceptance Criteria

- Site SEO can be managed without code changes.
- Media defaults are consistent across all image consumers.
- Profile/contact data has a single canonical source.
- Projects and experience are richer and easier to edit.
- Blog posts can be published with better SEO and editorial metadata.
- Navigation/footer links are no longer duplicated in code.
- Testimonials can be managed as real content instead of placeholders.
- Revalidation and preview workflows remain documented.

## Suggested Next Slice

1. Add `seoSettings` and `mediaSettings` schemas.
2. Add `profile` schema adoption in the runtime data layer.
3. Expand project and experience schemas.
4. Add navigation/footer and blog metadata improvements.
