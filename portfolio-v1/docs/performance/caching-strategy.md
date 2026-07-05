# Caching Strategy

> Multi-layer caching architecture for the Namias portfolio.
> Target: sub-100ms TTFB, 95+ Lighthouse Performance, offline resilience.

## Architecture Overview

```
Browser ──→ Service Worker (L4)
                │
                ▼
            CDN Edge (L3) ──→ Vercel/Cloudflare
                │
                ▼
          Next.js Server
                │
     ┌──────────┼──────────┐
     ▼          ▼          ▼
  In-Memory   Redis      Sanity
   Cache (L1)  Cache (L2)  CDN
```

## Cache Layers

### L1: In-Memory Cache (Server-side)
- **What**: Sanity CMS query results, API responses
- **TTL**: 300s (5 min), stale-while-revalidate 60s
- **Invalidation**: Tag-based via webhook, TTL expiry
- **Key format**: `cache:{tag}:{query-hash}`
- **Storage**: Node.js Map (server memory)

### L2: Upstash Redis Cache (Distributed)
- **What**: API GET responses, CMS content (fallback when L1 misses)
- **TTL**: 600s (10 min) for API, 3600s (1h) for CMS content
- **Invalidation**: Tag-based purge, TTL expiry, manual flush via API
- **Key format**: `api:{route}:{params-hash}`

### L3: CDN Edge Cache (Vercel/Cloudflare)
- **What**: Static pages, static assets, API responses with Cache-Control
- **TTL**: 31536000s (1y) for immutable assets, 3600s (1h) for pages
- **Stale-while-revalidate**: 60s for dynamic content
- **Invalidation**: Deploy, on-demand revalidation, tag-based purge

### L4: Browser Cache (Client-side)
- **What**: Static assets via service worker, SWR data cache, localStorage
- **Strategy**: Cache-first for static assets, network-first for API, stale-while-revalidate for CMS data
- **TTL**: 3600s (1h) for localStorage cache
- **Invalidation**: SWR revalidation, service worker update.

## Cache-Control Header Matrix

| Route | Cache-Control | Edge TTL | Stale SWR |
|-------|--------------|----------|-----------|
| `/_next/static/*` | public, max-age=31536000, immutable | 31536000 | - |
| `/api/media/[...path]` | public, max-age=31536000, immutable | 31536000 | - |
| `/api/resume` | public, max-age=300, s-maxage=600 | 600 | 60 |
| `/api/chat` (GET) | public, max-age=60 | 60 | - |
| `/api/chat` (POST) | no-cache | - | - |
| `/api/sanity/live` | no-cache, no-store | - | - |
| `/api/sanity/webhook` | no-cache, no-store | - | - |
| `/api/performance/cache` | no-cache, private | - | - |
| `/*` (pages) | public, max-age=3600, s-maxage=86400 | 86400 | - |

## Tag Naming Convention

```
cache:profile:{id}       — Profile content
cache:experience:{id}    — Experience entries
cache:project:{id}       — Project entries
cache:blog:{id}          — Blog posts
cache:certification:{id} — Certifications
cache:technology:{id}    — Technology entries
cache:media:{path}       — Media assets
cache:api:{route}        — API route responses
```

## Invalidation Triggers

1. **Sanity webhook**: Parses document type from webhook payload, invalidates matching tags
2. **TTL expiry**: Each cache entry has a configurable TTL
3. **Manual flush**: `/api/performance/cache?flush=true` clears all caches
4. **Deploy**: Full cache clear on every deploy
5. **Stale-while-revalidate**: Background refresh after TTL, serve stale until fresh arrives

## Performance Targets

| Metric | Current | Target | Tool |
|--------|---------|--------|------|
| Lighthouse Performance | ~80 | 95+ | Lighthouse CI |
| TTFB | ~300ms | <100ms | WebPageTest |
| API response (p95) | ~200ms | <50ms | Cache metrics |
| Cache hit rate | 0% | >80% | Cache endpoint |
| Page transitions | ~100ms | <50ms | Navigation API |
