# Analytics Feature PR Guide

## PR Setup

- **Branch:** `feat/privacy-analytics`
- **Base:** `main`
- **Title:** `feat(analytics): add privacy-first Umami tracking`

## Short PR Description (copy/paste)

### Summary

Adds Umami Cloud analytics for country, traffic volume, pages, referrers, and device insights.

### What changed

- Added Umami tracking script in the app `<head>` via `src/components/ui/Analytics.tsx`.
- Configured env-based website ID and host URL (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_HOST_URL`).
- Updated CSP in `next.config.js` to allow `https://cloud.umami.is` script and Umami API connection.
- Updated `.env.example`, `.env`, and `README.md` with secure env guidance.
- Updated layout test coverage in `src/__tests__/app/app-layout-page.test.tsx`.

### Note

Umami provides aggregate analytics (country, pages, sessions, referrers, device data), not personal identity tracking.

### Validation

- `npm run test -- src/__tests__/app/app-layout-page.test.tsx` ✅
- `npm run lint` ✅
- `npm run build` ✅
