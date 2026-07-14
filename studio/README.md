# Architecture notes

The Sanity Studio at `namias-cms.sanity.studio` is the editorial surface for the portfolio. It is built with:

- **Sanity 4.22** with a custom structure, presentation tool, and vision tool.
- **TypeScript** end-to-end, no `.js` files in `studio/` except eslint config and runner scripts.
- **React 19** and **styled-components** for the studio shell.

## Plugin stack

- `structureTool` - replaces the default navigation with a curated content map.
- `presentationTool` - previews and Visual Editing on `namias.tech`.
- `visionTool` - GROQ playground.

## Document actions

1. `perspectiveSwitcherAction` - cookie-based perspective switcher (published / drafts / previewDrafts).
2. `createPublishAndRefreshAction` - wraps the default publish action to call the revalidation webhook.

## Document badges

- Draft / Live
- Scheduled
- Stale (30+ days untouched)
- Expiring soon (certification within 90 days)
- Featured

## Validations

Centralized in `studio/validation/rules.ts`:
- `headlineLength` - SEO-friendly character bounds.
- `httpsOnly` - url fields prefer https.
- `dateOrder` - cross-field date validation.
- `uniqueSlug` - slug shape and uniqueness.
- `requireAltText` - 4+ char alt on every image.
- `summaryLength` - tunable per type.

## Sanity Functions

- `scheduled-publish/` - runs every 5 min, promotes posts/projects with `publishAt <= now`.
- `broken-refs/` - runs every 6h, counts broken references per document.
- `auto-tag-images/` - stubs an image-tagging pipeline triggered on `sanity.imageAsset.create`.

## Real-time

- Marketing site uses `next-sanity` Live Content API in `src/sanity/lib/live.ts`.
- `<SanityField>` component tags every renderable field with `data-sanity="<docId>.<type>.<path>"` for Visual Editing overlay targeting.
- `?sanity-edit=1` on the marketing site enables the popover and pop-in links to the studio.
