# Analytics Feature PR Guide

## PR Setup

- **Branch:** `feat/privacy-analytics`
- **Base:** `main`
- **Title:** `feat(analytics): add privacy-first Umami tracking`

## Short PR Description (copy/paste)

### Summary
Adds privacy-respecting analytics using Umami, enabled via environment variables.

### What changed
- Added `src/components/ui/Analytics.tsx` for Umami script injection.
- Mounted analytics in `src/app/layout.tsx`.
- Updated `next.config.js` CSP to allow configured Umami script origin when analytics is enabled.
- Added Umami env placeholders in `.env.example` and docs in `README.md`.
- Updated layout test coverage in `src/__tests__/app/app-layout-page.test.tsx`.

### Validation
- `npm run test -- src/__tests__/app/app-layout-page.test.tsx` ✅
- `npm run lint` ✅
- `npm run build` ✅

### Notes
Analytics is **disabled by default** unless `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set.
