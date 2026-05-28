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

## AI Agent Prompt

Use this prompt to continue the schema enhancement work slice by slice.

```text
Read SANITY_SCHEMA_ENHANCEMENT_PLAN.md, SANITY_SCHEMA_ENHANCEMENT_PRD.json, and progress.txt first.

Work in small slices only. Do not start implementation until the current slice is fully understood.

For each slice:
1. Read the files that control the slice.
2. Make the smallest focused change that satisfies the slice.
3. Run the narrowest relevant validation first, then run npm run lint and npm run build if the repository was touched.
4. Update progress.txt with the completed slice and validation results.
5. Commit the slice with one conventional commit message.
6. Move immediately to the next slice only after the current slice is validated and committed.

Rules:
- Start with seoSettings and mediaSettings.
- Then formalize profile and asset metadata.
- Then expand projects and experience.
- Then improve blog metadata, navigation/footer links, and testimonials.
- Then expand siteSettings, content status fields, and preview helpers.
- Do not bundle unrelated tasks into the same slice.
- Do not skip validation or commit steps.
- Update the plan if a slice changes the roadmap.

Stop only when the current slice is complete or a genuine blocker requires user input.
```
