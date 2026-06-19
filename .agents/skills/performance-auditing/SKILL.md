---
name: performance-auditing
description: Lighthouse audits, bundle analysis, image optimization, font loading, Core Web Vitals tracking, and performance monitoring setup.
---

# Performance Auditing

## When to use this skill

- Running Lighthouse audits and interpreting results
- Analyzing bundle size and finding bloat
- Optimizing images, fonts, and scripts
- Tracking Core Web Vitals (LCP, CLS, INP, FCP, TTFB)
- Investigating slow page loads
- Reducing Time to Interactive (TTI)
- Setting up performance budgets and alerting
- Reviewing Umami analytics for performance trends

## Performance targets

| Metric | Target | Measurement |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Chrome DevTools / Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Chrome DevTools / Lighthouse |
| INP (Interaction to Next Paint) | < 200ms | Chrome DevTools / Lighthouse |
| FCP (First Contentful Paint) | < 1.8s | Lighthouse |
| TTFB (Time to First Byte) | < 800ms | Lighthouse |
| Total bundle size | < 250KB gzipped | `npm run build` output |
| Lighthouse Performance score | ≥ 95 | Lighthouse |

## Workflow

### 1. Lighthouse audit

**Run locally:**

```bash
# Start the production build
npm run build && npm run start

# Run Lighthouse (requires Chrome)
npx lighthouse http://localhost:3000 --output html --view
```

**Run against deployed site:**

```bash
npx lighthouse https://namias.tech --output html --view
```

**Interpret the report:**

- **Performance score** (0-100): ≥ 95 is excellent
- **Opportunities**: Specific suggestions with estimated savings
- **Diagnostics**: Additional performance best practices
- **Passed audits**: Things that are already good

### 2. Bundle analysis

**Check build output:**

```bash
npm run build 2>&1 | grep -E "First Load|shared|Route"
```

**Understanding the output:**

```
Route (app)                    Size     First Load JS
┌ ○ /                          5.2 kB        89 kB
├ ○ /projects                  3.1 kB        87 kB
└ λ /api/chat                  0.1 kB        87 kB
+ First Load JS shared by      85 kB
```

- `○` = Static (prerendered)
- `λ` = Dynamic (server-rendered)
- First Load JS = shared bundle + page-specific code

**Identify bloat:**

1. Check which pages have the largest First Load JS
2. Look for large dependencies in the bundle
3. Use dynamic imports for heavy components

### 3. Image optimization

**Checklist:**

- [ ] All images use `next/image` with `width` and `height`
- [ ] Remote images have `sizes` prop for responsive loading
- [ ] Images use `priority` for above-the-fold content (hero, project covers)
- [ ] Format is WebP or AVIF (configured in `next.config.js`)
- [ ] No layout shift (explicit dimensions on all images)

**Current image config (next.config.js):**

```js
formats: ['image/webp', 'image/avif'],
deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536],
imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
qualities: [75, 85],
```

**Sanity image optimization:**

The media gateway (`/api/media/[...path]`) handles Sanity image optimization:

```
/api/media/sanity/<image-id>?w=800&q=80&auto=format
```

Parameters: `w` (width), `q` (quality), `auto=format` (automatic format selection)

### 4. Font optimization

**Current setup:**

- Font: Inter (system-ui fallback)
- Loading: `next/font` with `display: swap`

**Check font loading:**

1. DevTools → Network → filter by `font`
2. Fonts should load with `200` status (not `304` from cache)
3. No FOIT (Flash of Invisible Text) -- `display: swap` prevents this
4. Font files should be < 100KB each

**Font optimization tips:**

- Use `font-display: swap` (already configured)
- Preload critical fonts: `<link rel="preload" as="font">`
- Subset fonts to include only needed characters
- Use `font-size-adjust` for fallback font consistency

### 5. Script optimization

**Checklist:**

- [ ] No unnecessary third-party scripts
- [ ] Analytics (Umami) loads with `defer` or `async`
- [ ] No render-blocking scripts
- [ ] Dynamic imports for heavy libraries (e.g., chart libraries)
- [ ] Service worker doesn't block page load

**Third-party script audit:**

```bash
# Check what scripts load
# DevTools → Network → filter by JS
# Look for external domains loading scripts
```

Current scripts: Umami analytics only (lightweight, self-hosted)

### 6. CSS optimization

**Checklist:**

- [ ] Tailwind purges unused classes (configured by default)
- [ ] No `transition: all` (Vercel guideline)
- [ ] Animations use only `transform` and `opacity`
- [ ] No unused CSS (check with PurgeCSS)
- [ ] Critical CSS is inlined (Next.js does this automatically)

**Check CSS size:**

```bash
npm run build 2>&1 | grep -i css
```

### 7. React performance

**Checklist:**

- [ ] `useMemo` on expensive computations
- [ ] `useCallback` on functions passed to child components
- [ ] No unnecessary re-renders (check with React DevTools Profiler)
- [ ] Components use `React.memo` where beneficial
- [ ] Lists have stable `key` props (not index)
- [ ] Code splitting with `next/dynamic` for heavy components

**Common performance anti-patterns:**

```tsx
// BAD: creating new object/function on every render
<Component style={{ color: 'red' }} onClick={() => handleClick()} />

// GOOD: memoize
const style = useMemo(() => ({ color: 'red' }), []);
const handleClick = useCallback(() => doSomething(), []);
<Component style={style} onClick={handleClick} />
```

### 8. Network optimization

**Checklist:**

- [ ] API responses are cached where possible
- [ ] SWR revalidation intervals are reasonable
- [ ] No redundant API calls
- [ ] GZIP/Brotli compression enabled (Vercel does this automatically)
- [ ] HTTP/2 enabled (Vercel default)

## Quick performance checklist

```bash
# 1. Build and check output
npm run build 2>&1 | grep -E "First Load|shared"

# 2. Start production server
npm run start

# 3. Run Lighthouse
npx lighthouse http://localhost:3000 --output html --view

# 4. Check bundle in DevTools
# DevTools → Network → Size column

# 5. Check for layout shift
# DevTools → Rendering → Layout Shift Regions
```

## Common mistakes

- Using `useEffect` for data fetching instead of SWR with SSR
- Not setting `priority` on above-the-fold images
- Loading heavy libraries eagerly instead of dynamically
- Not cleaning up event listeners and subscriptions
- Using `JSON.parse` without error handling (blocks main thread)

## Performance budget

| Metric | Target | Warning threshold |
|--------|--------|-------------------|
| LCP | < 2.5s | > 4.0s |
| CLS | < 0.1 | > 0.25 |
| INP | < 200ms | > 300ms |
| FCP | < 1.8s | > 3.0s |
| TTFB | < 800ms | > 1.5s |
| Total bundle | < 250KB gzipped | > 350KB |
| Lighthouse score | ≥ 95 | < 90 |

## Performance monitoring

The portfolio uses **Umami** (cloud.umami.is) for analytics. To review performance trends:

1. Umami dashboard → Events → filter by performance-related custom events
2. Chrome DevTools → Performance tab for runtime profiling
3. Lighthouse CI for automated performance gates

### Setting up alerts

If implementing performance alerts (e.g., via Umami custom events or Vercel Analytics):

1. Define thresholds from the budget table above
2. Instrument key metrics (LCP, CLS, INP) via `web-vitals` library
3. Send to Umami as custom events or to a logging endpoint
4. Set up alerting rules in the monitoring dashboard

## Delivery checks

- [ ] Lighthouse Performance score ≥ 95
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] No render-blocking resources
- [ ] All images optimized with `next/image`
- [ ] Bundle size < 250KB gzipped
- [ ] No console warnings about performance
