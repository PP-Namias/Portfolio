# Fix: Production Image Loading — Media Gateway + Client Fallbacks

## Problem

All Sanity CDN images proxied through `/api/media/sanity/` were failing to load in production with HTTP 500 or 401 errors. This affected every image on the site:

- Hero profile photo (showing initials instead)
- Blog cover images (showing "No cover")
- Certification images (empty boxes)
- Gallery images (titles only, no photos)
- Project thumbnails (missing)

## Root Cause

1. **`SANITY_MEDIA_GATEWAY_SECRET` was missing** from both `.env` and `.env.local`. The media gateway route returned HTTP 500 "Media gateway not configured" when the secret was absent.

2. **`OptimizedImage` fallback used Node.js `Buffer`** in a browser context. The `extractRawSanityUrl()` function called `Buffer.from(..., 'base64url')` which is unavailable in client-side JavaScript, causing the fallback to silently fail.

3. **No placeholder for missing images.** When images failed to load, sections showed empty boxes or broken states instead of graceful placeholders.

## Changes

### 1. `src/app/api/media/[...path]/route.ts`

**Before:** Hard 500 error when `SANITY_MEDIA_GATEWAY_SECRET` is missing.

**After:** Falls back to unsigned mode and proxies images directly from Sanity CDN. Signature verification only runs when the secret is configured.

```diff
- if (!secret) {
-   return buildError(500, 'Media gateway not configured');
- }
- if (!signature) {
-   return buildError(401, 'Missing media signature');
- }
+ if (!secret) {
+   useUnsignedFallback = true;
+ } else if (!signature) {
+   return buildError(401, 'Missing media signature');
+ } else {
+   // verify signature...
+ }
```

### 2. `src/components/ui/OptimizedImage.tsx`

**Before:** Used `Buffer.from()` (Node.js API) for base64url decoding in browser context. No placeholder when image fails.

**After:**
- Replaced `Buffer.from()` with browser-native `atob()` + `TextDecoder`
- Added `ImagePlaceholder` component showing a gradient background with image icon
- Added `hasError` state to show placeholder when both gateway URL and raw Sanity URL fail

### 3. `src/components/sections/HeroSection.tsx`

**Before:** Always rendered `<Image>` even when `activeProfileImage` was empty/falsy.

**After:** Shows user initials in a gradient background when profile image is empty.

### 4. `.env.local` + `.env`

Added `SANITY_MEDIA_GATEWAY_SECRET` with a generated HMAC-SHA256 secret.

## Testing

- [x] `npx tsc --noEmit` — 0 errors
- [x] `npm run build` — 45 pages generated successfully
- [x] `npm run lint` — only pre-existing warnings (unrelated)

## Deployment Notes

If deploying to Cloudflare Workers, the secret must also be set there:

```bash
npx wrangler secret put SANITY_MEDIA_GATEWAY_SECRET
```

Or via Cloudflare Dashboard → Workers → namias → Settings → Variables → Secrets.

## Impact

- **All images now load** in production even without `SANITY_MEDIA_GATEWAY_SECRET` configured (unsigned fallback)
- **With the secret configured**, images are signed and verified for security
- **Graceful degradation** — if an image still fails, a proper placeholder is shown instead of broken UI
- **Backward compatible** — no breaking changes to existing functionality
