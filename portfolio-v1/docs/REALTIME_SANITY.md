# Realtime Sanity CMS → Website Updates

When the owner publishes or edits a document in Sanity CMS, every open browser tab on the portfolio updates automatically — no manual refresh. This document explains the pipeline, the environment variables, how to run the tests, and how to set up the dashboard webhook.

PRD: `docs/prd/prd.realtime-sanity.json`.

## Flow

```
Sanity dashboard publish/edit
        │
        ▼
POST /api/sanity/webhook  (signed with SANITY_REVALIDATE_SECRET)
        │
        ├─► validate signature + body
        ├─► invalidate L1/L2 caches by _type tags
        ├─► revalidatePath('/') + revalidateTag() per tag
        ├─► bump content version  (content-version:v1, Redis INCR w/ memory fallback)
        └─► (best-effort) RAG document reindex
        │
        ▼
GET /api/sanity/live  ──►  { ok, version, draftMode, pollIntervalMs, revalidatePaths }
        │                    (polled by the client bridge)
        ▼
useSanityLiveRefresh (SWR polling hook, mounted in root layout)
        │
        ├─► version changed since last poll?  ──no──►  wait for next poll
        │
        ▼ yes
router.refresh()  ──► fresh RSC payload from the (now-invalidated) cache
        │
        ▼
Every open tab re-renders with the new content — no reload
```

## Server side

| File | Role |
|---|---|
| `src/lib/content-version.ts` | Monotonic version counter: `getContentVersion()` / `bumpContentVersion()`. Backed by Redis `INCR` on key `content-version:v1` with an in-memory fallback when Redis is down. Exports `DEFAULT_SANITY_LIVE_POLL_MS = 15_000`. |
| `src/lib/redis-cache.ts` | `redisIncr()` / `redisGetNumber()` helpers (same catch → fallback pattern as the existing cache). |
| `src/app/api/sanity/webhook/route.ts` | Existing signed webhook; after validation it also calls `bumpContentVersion()` (non-fatal). |
| `src/app/api/sanity/live/route.ts` | Public probe: returns `{ ok, version, draftMode, pollIntervalMs, revalidatePaths }` with CORS + `no-store`. Keeps `?enable=1` compatibility (returns `{ enabled }` as well). |

## Client side

| File | Role |
|---|---|
| `src/hooks/useSanityLiveRefresh.tsx` | SWR polling bridge. Polls `/api/sanity/live` every `NEXT_PUBLIC_SANITY_LIVE_POLL_MS` (default 15 s), calls `router.refresh()` only when the version differs from the last seen one, with a 5 s minimum gap between refreshes. Also re-checks on `focus` / `visibilitychange`. Skips polling entirely in draft mode and on non-CMS paths. |
| `src/lib/features.ts` | `IS_REALTIME_SANITY_ENABLED` flag (default `true`) gates the bridge. |
| `src/app/layout.tsx` | Mounts `<SanityLiveRefreshBridge />` in both the streaming and runtime branches when the flag is on and draft mode is off. |

Refresh coverage: `/`, `/blog`, `/blog/…`, `/projects`, `/projects/…`.

## Environment variables

| Variable | Where | Default | Purpose |
|---|---|---|---|
| `SANITY_REVALIDATE_SECRET` | server | — | Webhook signature secret (must match the Sanity dashboard webhook secret). |
| `NEXT_PUBLIC_SANITY_LIVE_POLL_MS` | browser | `15000` | Poll interval. E2E sets `300`. |
| `E2E_CMS_FILE` | server (test only) | unset | Path to a local JSON fixture. When set, `querySanity` reads the fixture fresh on every call (matching GROQ `_type` via a small registry) and skips Sanity + all caching. Never set in production. |

## Testing

### Unit (Vitest)

```bash
npm run test -- --run
```

Relevant suites: `src/__tests__/lib/content-version.test.ts`, `src/__tests__/lib/cms-content.server.test.ts`, `src/__tests__/app/sanity-webhook-route.test.ts`, `src/__tests__/app/sanity-live-route.test.ts`, `src/__tests__/hooks/useSanityLiveRefresh.test.tsx` (fake timers), `src/__tests__/app/app-layout-page.test.tsx`.

### E2E (Playwright)

```bash
npm run test:e2e          # headless, bootstraps next dev on port 3100 with E2E env
npm run test:e2e:ui       # headed with the Playwright UI
npm run test:e2e:report   # open the last report
```

Specs in `tests/e2e/`:

| Spec | Proves |
|---|---|
| `home.spec.ts` | Home page renders hero + sections from the fixture; no console errors. |
| `blog.spec.ts` | Blog list + post detail render fixture posts. |
| `connect.spec.ts` | Connect chips render fixture labels. |
| `auth.spec.ts` | Wrong/missing webhook secret → 401 and no version bump; valid secret → 200 and version increments. |
| `realtime.spec.ts` | Full loop: fixture `HERO_NAME_V1` → rewrite to `HERO_NAME_V2` → signed webhook POST → page shows the new name without any reload (`load` count stays ≤ 1). |

The realtime spec waits for the bridge's first live poll before bumping, so the version change is always observed (avoids the baseline-seed race).

## Dashboard webhook setup recap

1. Sanity dashboard → **API → Webhooks** → create webhook.
2. URL: `https://namias.tech/api/sanity/webhook` (or the local/Cloudflare equivalent).
3. **Secret**: the same `SANITY_REVALIDATE_SECRET` used by the app.
4. Events: create / update / delete (publish → update is what matters for realtime).
5. HTTP method `POST`, payload `{"_type": "..."}` (default Sanity payload already includes `_type`).

## Known non-fatal noise

Webhook POSTs also trigger a best-effort RAG document reindex (`src/lib/rag/`). If the configured Upstash Vector store dimension mismatches the embedding model (e.g. `422 Invalid vector dimension: 3072, expected: 768`), the error is logged but never fails the webhook response. It does not affect the realtime pipeline.
