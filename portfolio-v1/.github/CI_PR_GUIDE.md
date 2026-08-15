# CI Fix PR Guide

## PR setup

- **Branch:** `feat/privacy-analytics`
- **Base:** `main`
- **Title:** `fix(ci): pass lint/type/build/test checks`

## Short PR description (copy/paste)

### Summary

Fixes PR validation failures by resolving TypeScript test errors and a flaky test timeout.

### What changed

- Fixed strict TypeScript typing in `src/__tests__/api/chat.test.ts`.
- Fixed test setup globals in `src/__tests__/setup.ts` (`vi` import + `ResizeObserver` polyfill typing).
- Fixed scroll event target typing in `src/__tests__/components/ui-uncovered.test.tsx`.
- Stabilized hidden blog branch test by mocking `BlogPostContent` in `src/__tests__/app/blog-hidden-branches.test.ts`.

### Validation

- `npx tsc --noEmit` ✅
- `npm run lint` ✅
- `npm run build` ✅
- `npm test` ✅
