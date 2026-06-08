---
name: performance-optimization
description: Analyze and improve Core Web Vitals, load times, and runtime performance.
---

# Performance Optimization Skill

Optimizes the portfolio for fast load times, smooth interactions, and excellent Core Web Vitals (LCP, CLS, INP, FCP, TTFB).

## When to use this skill

- Page load times exceed 2 seconds
- Lighthouse performance score is below 90
- Core Web Vitals need improvement (LCP > 2.5s, CLS > 0.1, INP > 200ms)
- Adding new images, fonts, or heavy third-party scripts
- Optimizing re-renders in React components

## Workflow

1. **Measure** — Run Lighthouse in Chrome DevTools (mobile + desktop). Check Core Web Vitals via PageSpeed Insights. Profile with React DevTools / React Scan.

2. **Images** — Ensure all images have explicit `width` and `height`. Use `next/image` with proper `sizes`. Above-fold images should use `priority`. Lazy-load below-fold images with `loading="lazy"`.

3. **Fonts** — Preload critical fonts with `<link rel="preload" as="font">`. Use `font-display: swap`. Subset fonts to only needed code points.

4. **JavaScript** — Minimize main-thread work. Lazy-load non-critical components with `next/dynamic`. Avoid layout thrash — batch DOM reads/writes.

5. **CSS** — Remove unused CSS (Tailwind purges automatically). Avoid `transition: all`. Animate only `transform` and `opacity`.

6. **Network** — Add `<link rel="preconnect">` for CDN/asset origins. Ensure API calls complete in <500ms. Use HTTP caching headers.

7. **React optimization** — Minimize re-renders with `useMemo`, `React.memo`. Use uncontrolled inputs where possible. Virtualize large lists (>50 items).

8. **Validate** — Re-run Lighthouse. Verify on CPU-throttled (4x slowdown) and Slow 3G network.

## Common patterns in this codebase

- Images use `next/image` with `sizes` attribute and explicit fill or width/height
- Fonts preloaded in `layout.tsx` or `_app.tsx`
- Component-level code splitting via `next/dynamic`
- SWR for client-side data fetching with caching
- Animations use Framer Motion (transform/opacity only)

## Delivery Checks

- [ ] Lighthouse performance ≥ 90 (mobile + desktop)
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Images have explicit dimensions and lazy loading
- [ ] Critical fonts preloaded
- [ ] No layout thrash in React render cycle
- [ ] Virtualized lists if > 50 items
- [ ] API calls complete within 500ms
