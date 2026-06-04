# Caching Audit

> Baseline inventory of current caching state before implementing smart caching.
> Date: 2026-06-04

## Pages

| Page | Current Caching | Cache-Control | ISR |
|------|----------------|--------------|-----|
| `/` | Static (no revalidate) | None | No |
| `/blog` | Static (no revalidate) | None | No |
| `/blog/[slug]` | SSG with generateStaticParams | None | No revalidate |
| `/studio` | Static redirect | None | No |

## API Routes

| Route | Method | Current Caching | Cache-Control Header |
|-------|--------|----------------|---------------------|
| `/api/chat` | GET | None | None |
| `/api/chat` | POST | None | no-cache (implied) |
| `/api/resume` | GET | None | None |
| `/api/media/[...path]` | GET | None | None (nosniff only) |
| `/api/sanity/webhook` | POST | None | None |
| `/api/sanity/live` | GET | None | None |
| `/api/draft-mode/enable` | GET | None | None |
| `/api/csp-violation` | POST | None | None |
| `/api/security-headers` | GET | None | None |

## Data Fetching Patterns

| Data | Fetch Mechanism | Caching | Revalidation |
|------|----------------|---------|-------------|
| Profile | Server-side Sanity query | None | Every request |
| Experiences | Server-side Sanity query | None | Every request |
| Projects | Server-side Sanity query | None | Every request |
| Technologies | Server-side Sanity query | None | Every request |
| Certifications | Server-side Sanity query | None | Every request |
| Memberships | Server-side Sanity query | None | Every request |
| Social links | Server-side Sanity query | None | Every request |
| Blog posts | Server-side Sanity query | None | Every request |
| Resume URL | Server-side Sanity query | None | Every request |
| Chat messages | Client-side fetch | None | Every message |

## SWR Configuration

| Component | SWR Config | dedupingInterval | revalidateOnFocus |
|-----------|-----------|-----------------|-------------------|
| ResumeModal | Default | 2000ms | true |
| BookingModal | Default | 2000ms | true |
| ChatPanel | Default | 2000ms | true (default) |

## Static Assets

| Asset Type | Current Caching | Cache-Control |
|-----------|----------------|--------------|
| JS bundles | Next.js default | public, max-age=0, must-revalidate |
| CSS files | Next.js default | public, max-age=0, must-revalidate |
| Images (static) | None configured | None |
| Fonts | Google Fonts CDN | Google-managed |
| Media (Sanity) | None configured | None |

## Third-Party Connections

| Origin | Purpose | Preconnect |
|--------|---------|-----------|
| `*.sanity.studio` | CMS content | No |
| `cdn.sanity.io` | Images | No |
| `cloud.umami.is` | Analytics | No |
| `api-gateway.umami.dev` | Analytics API | No |
| `cal.com` | Booking | No |
| `fonts.googleapis.com` | Fonts | No |
| `fonts.gstatic.com` | Font files | No |

## Baseline Metrics

| Metric | Value | Measurement Method |
|--------|-------|-------------------|
| Lighthouse Performance | ~80 | PageSpeed Insights |
| TTFB | ~300ms | Browser DevTools |
| API response (p95) | ~200ms | Server logs |
| Cache hit rate | 0% | No caching active |
| Page transitions | ~100ms | Navigation API |

## Findings Summary

1. **No Cache-Control headers** on any API route or page response
2. **All Sanity content fetched fresh** on every render — no in-memory cache
3. **No SWR configuration** — uses defaults (revalidates on focus)
4. **No ISR revalidation** — blog pages never update until redeploy
5. **No preconnect hints** for third-party origins
6. **No service worker** for offline caching
7. **No CDN cache configuration** — Vercel edge not optimized
