# PR: Dev → Main — Audit Fixes, Hydration, Performance, SEO & Security

## Summary

This PR brings **18 commits** from `dev` into `main`, covering a full AI audit fix pass, hydration mismatch resolution, performance optimization (canvas removal), SEO improvements (OG images, JSON-LD), security hardening, and accessibility fixes.

Closes #271 (duplicate close button — already merged to main, included for traceability)

---

## Highlights

### 1. Performance — Remove BackgroundFx Canvas Animation

**File:** `layout.tsx`

- Removed `BackgroundFx` component (full-screen canvas running `requestAnimationFrame` drawing thousands of animated dots with glow/shadow effects every frame)
- This was the primary cause of site lag on low-end devices
- `MagicCursor` mouse sparkle effect retained (lightweight DOM-based, only creates elements on mouse move)

### 2. Hydration Mismatch Fix

**Files:** `TechStackSection.tsx`, `ConnectSection.tsx`

- **Bug:** `aria-labelledby` and `id` attributes on Framer Motion's `motion.section` caused React hydration mismatches — server rendered them, client stripped them
- **Fix:** Moved ARIA attributes to a plain `<section>` wrapper around `motion.section`
- Plain HTML elements render identically on server and client

### 3. Rate Limiter IP Spoofing Fix

**File:** `src/app/api/chat/route.ts`

- **Bug:** Rate limiter used `x-forwarded-for` header which is easily spoofed
- **Fix:** Prioritize `cf-connecting-ip` header (Cloudflare-verified, cannot be spoofed)
- Fall back to `x-forwarded-for` for non-Cloudflare deployments

### 4. Media Gateway Security Hardening

**File:** `src/app/api/media/[...path]/route.ts`

- **Before:** When `SANITY_MEDIA_GATEWAY_SECRET` was unset, the gateway silently proxied unsigned requests — any image could be accessed without authentication
- **After:** Returns 501 when secret is not configured (fails closed, no silent proxy)
- Removed `useUnsignedFallback` variable and `x-media-unsigned` header

### 5. SEO Improvements

**Files:** `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx`, `public/robots.txt`, `src/app/blog/[slug]/page.tsx`, `src/components/sections/ProjectDetailPage.tsx`

- Added branded OG/Twitter images using `next/og` `ImageResponse` with edge runtime
- Added explicit `Allow` rules in `robots.txt` for AI crawlers (GPTBot, ClaudeBot, Google-Extended)
- Added `dateModified` to blog Article JSON-LD
- Added `BreadcrumbList` JSON-LD to blog posts and project detail pages

### 6. Accessibility Fixes

**Files:** `ConnectSection.tsx`, `TechStackSection.tsx`

- Added `aria-labelledby` with corresponding `id` on heading elements (via plain `<section>` wrapper to avoid hydration mismatch)

### 7. Code Quality & Dead Code Removal

**Files:** `src/lib/admin.ts`, `src/lib/validators/chat.ts`, 3 API routes

- Extracted `isAdminRequest` utility to `src/lib/admin.ts` — deduplicated from cache, canary/test, and canary/stats API routes
- Deleted dead code `src/lib/validators/chat.ts` (77 lines, never imported by any file)

### 8. API Fixes

**Files:** `src/app/api/csp-violation/route.ts`, `src/app/api/sanity/live/route.ts`

- Changed CSP violation endpoint from HTTP 204 to 200 — 204 forbids response body, causing silent failures
- Fixed `isDraftModeEnabled` logic: was checking `process.env[cookieName]` instead of using `draftMode()` from `next/headers`

### 9. Documentation

**File:** `.env.example`

- Added `ADMIN_API_KEY` to `.env.example` (was missing, only existed in `.env`)

---

## Commits (18)

```
0cc9944 perf: remove BackgroundFx canvas animation to fix lag
e2eb2fb fix(a11y): move ARIA attributes from motion.section to plain section to fix hydration mismatch
da19abb docs: add ADMIN_API_KEY to .env.example
537bac1 fix(api): fix isDraftModeEnabled logic in sanity/live probe
78883ed fix(seo): add BreadcrumbList JSON-LD to blog posts and project pages
d5bd99c fix(seo): add dateModified to blog Article JSON-LD
26a808a fix(api): change CSP violation endpoint from 204 to 200
7e6fcfa fix(a11y): add aria-labelledby to ConnectSection and TechStackSection
c983b9f refactor: extract isAdminRequest to shared src/lib/admin.ts utility
9c0cea3 chore: remove dead code src/lib/validators/chat.ts
0091f8c fix(media-gateway): fail closed when SANITY_MEDIA_GATEWAY_SECRET is unset
3ee6384 fix(layout): add BackgroundFx to production layout branch
14cec94 fix(chat): prioritize cf-connecting-ip to prevent rate limiter spoofing
9b7e5eb fix(ResumeModal): add loading/error states and remove sandbox
02f806b feat(seo): branded OG/Twitter images and AI crawler visibility
2275e2a refactor(ConnectSection): remove Chat on Discord CTA
40c1595 feat(ConnectSection): add Ko-fi donation link
1667b43 test(ResumeModal): update tests to match new component structure
```

---

## Testing

- [x] `npx tsc --noEmit` — 0 errors
- [x] `npm run test -- --run` — 498 tests passing (46 files)
- [x] `npx eslint src/` — 0 errors, 1 pre-existing warning (unrelated)

## Deployment Notes

### Cloudflare Workers

Set the media gateway secret (required for image signing):

```bash
npx wrangler secret put SANITY_MEDIA_GATEWAY_SECRET
```

### Environment Variables

`.env.example` updated with `ADMIN_API_KEY` and `SANITY_MEDIA_GATEWAY_SECRET`.

## Impact

- **Performance** — removed full-screen canvas animation causing lag on all devices
- **Hydration** — eliminated React hydration mismatch warnings on TechStack and Connect sections
- **Security** — rate limiter uses Cloudflare-verified IP, media gateway fails closed when secret is unset
- **SEO** — branded OG/Twitter images, AI crawler visibility, structured data (BreadcrumbList, dateModified)
- **Accessibility** — proper ARIA labeling on section headings
- **Code quality** — deduplicated admin check utility, removed dead code
