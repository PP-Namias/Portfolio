# Performance Dashboard

> Cache metrics and performance monitoring for the Namias portfolio.

## Cache Layers

### L1: In-Memory Cache
- **Storage**: Node.js Map (server memory)
- **TTL**: 300s (5 min), stale-while-revalidate 60s
- **Invalidation**: Tag-based via webhook, TTL expiry, manual flush
- **Endpoint**: `GET /api/performance/cache`
- **Flush**: `GET /api/performance/cache?flush=true`

### L2: Upstash Redis (Distributed)
- **Storage**: Upstash Redis REST
- **TTL**: 300s (matching L1), stale-while-revalidate 60s
- **Invalidation**: Tag-based via webhook (Redis Sets), TTL expiry
- **Fallback**: If Redis is unavailable, cache degrades to L1-only

### L3: CDN Edge
- **Storage**: Vercel Edge / Cloudflare
- **Static assets**: `_next/static/*`, `/fonts/*` — immutable, 1 year
- **Pages**: Cache-Control via ISR + headers

### L4: Browser Cache
- **Service Worker**: `public/sw.js` — cache-first for static, network-first for API
- **SWR**: DedupingInterval 5s, revalidateOnFocus=false
- **localStorage**: Portfolio data with 1h TTL

## Cache Headers

| Route | Cache-Control | Immutable | SWR |
|-------|--------------|-----------|-----|
| `/_next/static/*` | public, max-age=31536000 | Yes | - |
| `/fonts/*` | public, max-age=31536000 | Yes | - |
| `/api/media/[...path]` | public, max-age=31536000 (files) / 86400 (images) | Yes (files) | 604800 |
| `/api/resume` | public, max-age=300 | No | 60 |
| `/api/chat` (GET) | public, max-age=60 | No | 30 |
| `/api/chat` (POST) | no-cache, no-store | No | - |
| `/api/sanity/live` | no-cache, no-store | No | - |
| `/api/sanity/webhook` | no-cache, no-store | No | - |
| `/api/performance/cache` | no-cache, private | No | - |
| `/og-image.svg` | public, max-age=86400 | No | 604800 |
| Pages (via ISR) | public, max-age=3600, s-maxage=86400 | No | - |

## Cache Tags

| Tag | Content Type |
|-----|-------------|
| `cms:profile` | Profile document |
| `cms:hero` | Hero section |
| `cms:about` | About section |
| `cms:technology` | Tech stack |
| `cms:experience` | Experience entries |
| `cms:project`, `cms:project-list` | Projects |
| `cms:certification` | Certifications |
| `cms:gallery` | Gallery images |
| `cms:blog` | Blog posts |
| `cms:membership` | Memberships |
| `cms:recommendation` | Recommendations |
| `cms:settings` | Site settings |
| `cms:resume` | Resume |

## ISR Configuration

| Route | Revalidate | Strategy |
|-------|-----------|----------|
| `/blog` | 3600s | ISR with stale-while-revalidate |
| `/blog/[slug]` | 3600s | ISR + generateStaticParams + dynamicParams |

## Targets

| Metric | Current | Target |
|--------|---------|--------|
| Lighthouse Performance | ~80 | 95+ |
| TTFB | ~300ms | <100ms |
| API response (p95) | ~200ms | <50ms |
| Cache hit rate | 0% | >80% |
| Page transitions | ~100ms | <50ms |
