# Performance Optimization Plan

Last updated: 2026-05-28
Project: PP Namias Portfolio (`namias.tech`)

## Goal

Make the website and Sanity Studio feel instant by reusing already-fetched data, reducing duplicate image work, and shrinking the amount of data each view needs to render.

## Current Hypothesis

The slow experience is likely caused by three things:

1. Many sections read from the same CMS payload, so the app benefits from stronger shared caching and normalized view models.
2. Several pages render many remote images, which can bottleneck the network and browser decode path.
3. Some client surfaces still do more work than necessary on first paint, especially when the same content is re-derived in multiple components.

## Non-Negotiable Constraints

1. Keep the current modal-first architecture.
2. Keep the minimal route set.
3. Do not reintroduce local content fixtures as a runtime source of truth.
4. Preserve Sanity as the source of truth.
5. Keep the solution safe for both the website and the Sanity Studio.

## Optimization Principles

1. Fetch once, reuse everywhere.
2. Normalize content into shared view models before it reaches the UI.
3. Prefer server-side caching and request deduplication over client-side refetching.
4. Load only the images needed for the current viewport.
5. Make heavy media optional and progressively enhanced.

## Phase 1 — Baseline and Hotspot Audit

### Objective

Measure where time is going before changing architecture.

### Tasks

1. Profile homepage and Studio startup with the network panel.
2. Identify the slowest CMS queries and the largest image requests.
3. Record first-contentful-paint, largest-contentful-paint, and total image request count for the homepage.
4. Separate slow data fetches from slow image decode/render costs.

### Output

1. A short hotspot list for data queries.
2. A short hotspot list for media requests.
3. A baseline numbers table for comparison after each slice.

## Phase 2 — Shared CMS Payload Reuse

### Objective

Load the core CMS payload once and let all sections consume the same normalized object.

### Tasks

1. Keep `getCmsContent()` as the single server entry point.
2. Add request-level caching/deduplication so repeated reads during one render do not re-query Sanity.
3. Normalize repeated values into one shared content shape before it reaches the provider.
4. Keep `CmsContentProvider` as the single client-side source for all sections.
5. Avoid re-deriving lists such as social links, tech groups, and filtered collections inside multiple components.

### Target Outcome

1. One CMS payload per page load.
2. Zero duplicate fetches for the same page render.
3. Consistent data shape across hero, sections, modals, and footer.

## Phase 3 — Image Pipeline Cleanup

### Objective

Reduce the cost of fetching and decoding remote images.

### Tasks

1. Use Sanity image URLs with explicit width/quality variants wherever the same asset appears in multiple sizes.
2. Keep `priority` only for above-the-fold visuals.
3. Lazy-load gallery, certification, and secondary project media.
4. Ensure aspect ratios are known ahead of time to avoid layout shift.
5. Prefer placeholders or lightweight fallback UI over extra image requests.
6. Deduplicate repeated image lookups by resolving each asset once per render path.

### Target Outcome

1. Fewer image requests during initial load.
2. Faster decode for the hero and project surfaces.
3. Lower layout shift from image containers.

## Phase 4 — Section-Level Render Simplification

### Objective

Reduce client work on the homepage.

### Tasks

1. Move static content derivation into shared helpers or server-side transforms.
2. Keep client components focused on interaction, not data shaping.
3. Remove duplicate transforms for repeated arrays such as social links and certifications.
4. Memoize only where it removes repeated expensive work, not by default.
5. Avoid loading the same content in multiple nested components when a parent can pass it down.

### Target Outcome

1. Fewer re-renders on the home page.
2. Less CPU time spent preparing content.
3. Cleaner separation between data shaping and rendering.

## Phase 5 — Studio Startup and Asset Efficiency

### Objective

Keep Sanity Studio responsive even with content-heavy schemas.

### Tasks

1. Reduce initial preview weight in list views and document panes.
2. Avoid loading large image previews until the user opens a document.
3. Keep schema projections narrow for list views.
4. Ensure the studio does not prefetch more asset data than needed.
5. Review any custom studio tooling for unnecessary startup work.

### Target Outcome

1. Faster Studio launch.
2. Faster document opening.
3. Less network traffic for list browsing.

## Phase 6 — Delivery and Caching Rules

### Objective

Make the browser and CDN do more work for us.

### Tasks

1. Verify cache headers for static assets and remote image URLs.
2. Keep immutable assets cached aggressively when possible.
3. Use long-lived caching for repeated content that changes infrequently.
4. Confirm image optimization settings match the actual remote media patterns.

### Target Outcome

1. Faster repeat visits.
2. Fewer redundant downloads.
3. Better perceived speed on mobile connections.

## Execution Slices

### Active Slice 1 — Performance Foundation

This is the first implementation slice to ship next.

Scope:

1. Add the CMS caching/dedup layer.
2. Optimize homepage image loading.
3. Trim Sanity Studio preview payloads.

Expected result:

1. One shared CMS fetch path for the page.
2. Fewer image requests and less decode work on the homepage.
3. Lighter Studio document/list payloads.

| ID | Slice | Result |
| --- | --- | --- |
| OPT-001 | Add CMS caching and shared payload reuse | Reuse one payload across the page |
| OPT-002 | Optimize homepage image loading | Fewer requests and faster decode |
| OPT-003 | Trim Sanity Studio preview payloads | Faster admin browsing |
| OPT-004 | Validate cache and delivery settings | Preserve repeat-load gains |

## Implementation Notes

1. The caching layer should be added at the shared CMS loader boundary, not inside individual sections.
2. Homepage image work should prefer fewer, smaller, lazily-loaded requests with placeholders for non-critical media.
3. Studio preview trimming should reduce initial list/document payload size before any visual polishing.

## Success Criteria

1. The homepage makes one CMS fetch per render path, not repeated ad hoc reads.
2. Reused content is passed through the provider instead of being recalculated in many components.
3. The initial image waterfall is smaller and the visible hero content appears sooner.
4. Studio opens faster and previews less data by default.
5. Lint, build, and the targeted test slice continue to pass after each optimization slice.

## Recommended First Implementation Order

1. Ship the active Performance Foundation slice first.
2. Re-measure homepage and Studio waterfalls.
3. Continue with cache and delivery settings once the visible gains are confirmed.
