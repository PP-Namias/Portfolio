---
name: pwa-service-worker
description: Service worker management, offline support, cache strategies, and SW debugging.
---

# Service Worker Skill

## When to use this skill

- Debugging service worker issues (stale cache, offline behavior)
- Updating cache strategies
- Adding offline support for specific routes
- Clearing service worker cache during development
- Understanding the caching layers

**Note:** This portfolio has a hand-written service worker (`public/sw.js`) but is NOT a PWA. There is no `manifest.json`.

## Service worker reference

**File:** `public/sw.js`

**Current version:** `v4`

**Cache strategy by path:**

| Path pattern | Strategy | Notes |
|---|---|---|
| `_next/static/` | Network-first | Prevents stale chunks |
| `_next/data/` | Network-first | Fresh page data |
| `/api/` | Network-only | Never cache API responses |
| `fonts/` | Cache-first | Static, immutable assets |
| `images/` | Cache-first | Static images |
| Other | Stale-while-revalidate | Balanced approach |

## Workflow

### 1. Clear service worker cache (development)

**Chrome DevTools:**

1. Open DevTools → Application tab
2. Click "Service Workers" in the left sidebar
3. Click "Unregister" on the active worker
4. Click "Storage" → "Clear site data"
5. Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

**Via code (for users):**

The service worker includes a version check. When the version changes, the old cache is automatically cleared in the `install` event handler.

### 2. Update service worker version

When making changes to `public/sw.js`:

1. Update the `CACHE_VERSION` constant:

```js
const CACHE_VERSION = 'v5'; // was v4
```

2. The old cache is automatically cleaned up on next visit
3. Users get a fresh install with the new cache

### 3. Add a new route to cache

**Add to the `urlsToCache` array in the `install` handler:**

```js
const urlsToCache = [
  '/',
  '/offline',
  '/fonts/inter-var.woff2',
  '/new-static-asset.js',
];
```

**Change cache strategy for a path:**

In the `fetch` handler, add a new case:

```js
if (url.pathname.startsWith('/new-path/')) {
  // Network-first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
  return;
}
```

### 4. Cache strategies explained

**Cache-first (static assets):**

```
Request → Cache hit? → Yes → Return cached
                     → No  → Fetch → Cache → Return
```

Best for: fonts, images, immutable assets

**Network-first (API, dynamic):**

```
Request → Fetch → OK? → Return response → Cache
              → Fail? → Cache hit? → Return cached
                       → No? → Offline fallback
```

Best for: API calls, dynamic pages, `_next/static/`

**Stale-while-revalidate:**

```
Request → Cache hit? → Yes → Return cached + fetch in background
                     → No  → Fetch → Cache → Return
```

Best for: pages, HTML, semi-static content

### 5. Offline support

**Current offline page:** `/offline` (if configured)

**To add offline support for a route:**

1. Add the route to `urlsToCache` in the install handler
2. The service worker will serve from cache when offline
3. Consider serving a fallback page for uncached routes

### 6. Debugging service worker issues

**Problem: Stale content after deployment**

```bash
# 1. Check if SW is registered
# DevTools → Application → Service Workers → "Active" state

# 2. Check cache contents
# DevTools → Application → Cache Storage → expand caches

# 3. Force update
# DevTools → Service Workers → "Update on reload" checkbox → Reload
```

**Problem: Page shows old version**

1. Check `CACHE_VERSION` was incremented in `sw.js`
2. Clear all caches manually
3. Unregister the service worker
4. Hard refresh

**Problem: Assets not loading**

1. Check the service worker console: DevTools → Application → Service Workers → "Start" script
2. Look for errors in the SW console (separate from page console)
3. Check if the asset path is in the cache

**Problem: SW not registering**

1. Check `public/sw.js` exists
2. Check registration code in the app
3. Verify no errors in the page console
4. SW only works on HTTPS (or localhost)

### 7. Performance impact

Service workers add minimal overhead:

- Registration: ~1ms
- Install: runs in background, no impact on page load
- Fetch interception: ~0.1ms per request
- Cache lookups: ~0.5ms per asset

**Keep the SW lean:**

- Don't cache large files in the install handler
- Use `network-first` for frequently updated content
- Limit cache size (current SW doesn't enforce a limit -- consider adding one)

## Common mistakes

- Forgetting to increment `CACHE_VERSION` after changes
- Caching API responses (always use network-only for `/api/`)
- Not testing in incognito (old SW may be cached)
- Deploying SW changes without bumping the version
- Caching third-party resources (unreliable, can break)

## Quick reference

```bash
# Check SW status
# DevTools → Application → Service Workers

# Check caches
# DevTools → Application → Cache Storage

# Force SW update
# DevTools → Service Workers → "Update on reload" → Reload

# Clear everything
# DevTools → Application → Storage → "Clear site data"
```

## Delivery checks

- [ ] Service worker registers without errors
- [ ] New content loads after deployment (no stale cache)
- [ ] Offline fallback works (disconnect network, navigate)
- [ ] Cache version is incremented when SW changes
- [ ] No API responses are cached
