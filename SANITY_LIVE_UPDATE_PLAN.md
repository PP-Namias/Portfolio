# Sanity Live Update Implementation Plan

## Goal

Make Sanity CMS changes appear on the website without the user manually refreshing the browser.

This needs two layers:

1. A client-side live refresh path for open tabs.
2. A server-side webhook path for cache invalidation and SEO freshness.

## Recommended Architecture

The current site already fetches all CMS content through a shared server loader in `src/lib/cms-content.server.ts`, and the result is injected into the client tree through `src/app/layout.tsx` and `src/app/providers.tsx`.

That means the least risky approach is:

- keep `getCmsContent()` as the canonical fetch layer,
- add a live listener in the client provider so open pages refresh automatically,
- add a Sanity webhook route so published content revalidates server-rendered routes,
- leave the existing sections in place so they continue reading from `useCmsContent()`.

## File-By-File Plan

### 1. `src/hooks/useCmsContent.tsx`

Current role:

- Provides the CMS data context to the whole app.

Planned change:

- Make the provider refreshable instead of static-only.
- Store CMS content in state so it can be replaced after a live refresh event.
- Expose a refresh function or setter from the provider.

Why this file matters:

- Every CMS-driven section already reads from this hook, so updating this provider updates the whole visible page tree.

### 2. `src/app/providers.tsx`

Current role:

- Wraps the site in `ThemeProvider`, `AccentColorProvider`, `CmsContentProvider`, `ModalProvider`, and `ReactLenis`.

Planned change:

- Mount the live update bridge here so it runs on every route.
- Pass the initial `cmsContent` into the refreshable provider.
- Keep the live listener high in the tree so homepage, blog pages, and modal content all react to the same update signal.

Why this file matters:

- It is the single client entry point for the entire site.

### 3. New file: `src/hooks/useSanityLiveRefresh.ts` or `src/hooks/useCmsLiveRefresh.ts`

Planned role:

- Subscribe to Sanity change events for the published document types used by the site.
- When a relevant document changes, trigger a refresh of the current route.

Recommended behavior:

- Refresh on changes to `profile`, `heroSection`, `techStack`, `experience`, `project`, `certification`, `galleryImage`, `membership`, `recommendation`, `post`, `siteSettings`, and `resume`.
- Ignore unrelated document changes.
- Debounce rapid bursts so repeated edits do not cause unnecessary refresh spam.

Why this file matters:

- This is the piece that makes the open browser tab update without a user refresh.

### 4. New route: `src/app/api/sanity/webhook/route.ts`

Planned role:

- Receive Sanity publish and unpublish webhook calls.
- Verify a shared secret before doing anything else.
- Revalidate the pages that depend on CMS content.

Paths to revalidate:

- `/`
- `/blog`
- `/blog/[slug]`
- `/sitemap.xml`

Why this file matters:

- Live refresh solves open tabs.
- Webhook revalidation solves server cache freshness for new visitors, bots, and shared links.

### 5. `src/lib/cms-content.server.ts`

Current role:

- Central server-side data loader for all Sanity content.

Planned change:

- Keep this as the single source of truth for content fetching.
- If needed, add query tagging or helper functions later so the webhook can target cache invalidation more precisely.

Why this file matters:

- All CMS-driven routes already depend on it: homepage layout, blog list, blog detail pages, sitemap, and the chat API.

### 6. `src/app/layout.tsx`

Current role:

- Fetches CMS content once at the root and passes it into the app providers.

Planned change:

- Usually no structural change is required if the live refresh bridge updates the provider state.
- If Next.js caching interferes with refresh behavior, mark the layout or dependent routes as dynamic in a targeted way rather than rewriting the whole data flow.

Why this file matters:

- It is the top-level server component that seeds the initial CMS state.

### 7. `src/app/blog/page.tsx`

Current role:

- Renders the blog list from `getCmsContent()`.

Planned change:

- No direct component rewrite should be needed.
- The live refresh bridge should cause the route to rerender when a post changes.

Why this file matters:

- Blog listing content must update when posts are published or edited.

### 8. `src/app/blog/[slug]/page.tsx`

Current role:

- Renders the individual blog post page and metadata from `getCmsContent()`.

Planned change:

- No direct UI rewrite should be needed.
- The route should rerender when the relevant post changes.

Why this file matters:

- Open blog posts should update when the CMS content changes, especially title, excerpt, body, and cover image.

### 9. `src/app/sitemap.ts`

Current role:

- Builds sitemap entries from the CMS blog post list.

Planned change:

- Keep it wired to `getCmsContent()` and let webhook revalidation refresh it on publish events.

Why this file matters:

- Search engines and crawlers should not keep stale blog URLs.

### 10. `studio/sanity.config.ts`

Current role:

- Configures the Sanity Studio presentation tool and preview destinations.

Planned change:

- Wire the publish document action so successful publishes ping `src/app/api/sanity/webhook`.
- Keep the existing preview flow separate from the live-update flow.

Why this file matters:

- Editors need a clear preview flow, but preview is not the same as live website refresh.

### 11. Tests to add or update under `src/__tests__/`

Planned coverage:

- Add a webhook route test for secret validation and path revalidation.
- Add a live refresh bridge test that proves a Sanity change causes the provider or router refresh path to fire.
- Keep the existing blog and draft-mode tests passing.

Likely test files:

- `src/__tests__/app/sanity-webhook-route.test.ts`
- `src/__tests__/hooks/useSanityLiveRefresh.test.tsx`
- `src/__tests__/app/draft-mode-route.test.ts` if preview behavior changes

## Components That Should React Without Direct Edits

These components already consume `useCmsContent()`, so they should update automatically once the provider becomes refreshable:

- `src/components/sections/HeroSection.tsx`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/TechStackSection.tsx`
- `src/components/sections/ProjectsSection.tsx`
- `src/components/sections/CertificationsSection.tsx`
- `src/components/sections/ExperienceTimeline.tsx`
- `src/components/sections/RecommendationsCarousel.tsx`
- `src/components/sections/MembershipsSection.tsx`
- `src/components/sections/GallerySection.tsx`
- `src/components/sections/ConnectSection.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/ChatPanel.tsx`
- `src/components/sections/SpeakingSection.tsx`

If any of these later cache CMS data in local component state, they will need a small follow-up change.

## Implementation Order

1. Add the webhook route in `src/app/api/sanity/webhook/route.ts`.
2. Make `src/hooks/useCmsContent.tsx` refreshable.
3. Mount the live refresh bridge in `src/app/providers.tsx`.
4. Add the Sanity listener hook in `src/hooks/useSanityLiveRefresh.ts`.
5. Wire Sanity Studio to the webhook target in `studio/sanity.config.ts`.
6. Add tests for the webhook and refresh flow.
7. Verify blog and sitemap freshness behavior.
8. Run the final end-to-end publish test from Sanity Studio and confirm the open site updates without a manual refresh.

## Environment Variables

The feature should rely on the existing Sanity variables plus one shared secret:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN` if the webhook or preview path needs authenticated access
- `SANITY_REVALIDATE_SECRET` for webhook verification

## Success Criteria

The feature is done when all of these are true:

- Editing and publishing CMS content updates the open browser tab without manual refresh.
- New visits to the homepage and blog routes get fresh server data.
- Webhook requests are rejected without the correct secret.
- Existing preview and blog routes still work.
