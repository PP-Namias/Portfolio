---
name: debugging-error-tracking
description: Systematic debugging workflow for errors, performance issues, and runtime problems in the portfolio.
---

# Debugging & Error Tracking

## When to use this skill

- Investigating console errors or warnings
- Debugging hydration mismatches
- Tracking down performance regressions
- Diagnosing network request failures
- Analyzing memory leaks or slow render cycles
- Troubleshooting browser-specific issues

## Workflow

### 1. Error triage

**Classify the error:**

| Category | Examples | Priority |
|---|---|---|
| **Build-time** | TypeScript errors, lint failures, missing imports | Fix before commit |
| **Runtime** | Console errors, unhandled promises, null references | Fix before deploy |
| **Hydration** | Server/client HTML mismatch, `useEffect` missing | Fix before deploy |
| **Network** | API failures, CORS errors, timeout | Fix based on user impact |
| **Performance** | Slow LCP, high CLS, janky animations | Fix if regression |
| **Browser-specific** | Safari-only, mobile-only, Firefox-only | Fix if significant audience |

### 2. Console error investigation

**Step 1: Reproduce the error**

- Open browser DevTools → Console tab
- Clear console and reload the page
- Note the exact error message, file, and line number

**Step 2: Read the error carefully**

- The first line is the error type (TypeError, ReferenceError, etc.)
- The second line is usually the component stack trace
- Look for the file path and line number in the source

**Step 3: Check common patterns**

| Error pattern | Likely cause | Fix |
|---|---|---|
| `Cannot read property of undefined` | Null data from API | Add null checks or `??` defaults |
| `Hydration mismatch` | Server/client render difference | Add `useEffect` guard, `mounted` state |
| `Too many re-renders` | State update in render | Move to `useEffect` or callback |
| `Invalid hook call` | Conditional hook or wrong React | Ensure hooks are called unconditionally |
| `404 on _next/static` | Stale service worker | Clear SW cache (see PWA skill) |
| `CORS error` | Missing headers | Check API route CORS config |

### 3. Hydration mismatch debugging

**Symptoms:** Warning in console about hydration mismatch, content flickers on load.

**Common causes:**

1. **Date/time rendering** -- Server and client generate different strings
   ```tsx
   // BAD: server and client time differ
   <span>{new Date().toLocaleDateString()}</span>
   
   // GOOD: render only on client
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
   <span>{mounted ? new Date().toLocaleDateString() : ''}</span>
   ```

2. **Browser extensions** -- Extensions inject elements into the DOM
   - Test in incognito mode with extensions disabled

3. **Conditional rendering based on `window`/`document`**
   ```tsx
   // BAD
   <div>{typeof window !== 'undefined' ? 'client' : 'server'}</div>
   
   // GOOD: use useEffect
   const [isClient, setIsClient] = useState(false);
   useEffect(() => setIsClient(true), []);
   ```

### 4. Network request debugging

**DevTools → Network tab:**

1. Filter by `Fetch/XHR` to see API calls
2. Check the `Status` column for failures (4xx, 5xx)
3. Click the failed request → `Preview` tab for error details
4. Check `Response Headers` for CORS issues

**Common network issues:**

| Status | Meaning | Fix |
|---|---|---|
| 400 | Bad request | Check request body/params |
| 401 | Unauthorized | Check API token |
| 403 | Forbidden | Check permissions/CORS |
| 404 | Not found | Check the API route exists |
| 429 | Rate limited | Add retry logic, back off |
| 500 | Server error | Check server logs |
| CORS error | Missing `Access-Control-Allow-Origin` | Add CORS headers to API route |

### 5. Performance debugging

**Chrome DevTools → Performance tab:**

1. Click record, interact with the page, stop recording
2. Look for long tasks (red bars in the timeline)
3. Check the `Summary` tab for breakdown (scripting, rendering, painting)

**React DevTools → Profiler:**

1. Open React DevTools → Profiler tab
2. Click record, interact, stop
3. Check which components re-rendered and why
4. Look for components rendering too often (unnecessary re-renders)

**Quick performance checks:**

```bash
# Lighthouse audit
npx lighthouse http://localhost:3000 --output html --view

# Bundle size check
npm run build 2>&1 | grep -E "First Load|shared"
```

### 6. Memory leak detection

**DevTools → Memory tab:**

1. Take a heap snapshot
2. Perform actions (navigate, open modals, etc.)
3. Take another snapshot
4. Compare snapshots -- look for detached DOM nodes

**Common memory leak sources:**

- Event listeners not cleaned up in `useEffect` return
- `setInterval` not cleared
- SWR fetchers holding references
- Third-party widgets (analytics, chat) not disposed

### 7. Mobile debugging

**Chrome DevTools → Toggle Device Toolbar:**

1. Select a device preset (iPhone, Pixel, etc.)
2. Check for touch event issues
3. Verify tap targets are ≥ 44px
4. Test scroll behavior (iOS momentum scrolling)
5. Check for viewport meta tag issues

**Remote debugging (real device):**

- Android: `chrome://inspect` with USB debugging
- iOS: Safari → Develop → [device]

## Quick reference

| Problem | First thing to check |
|---|---|
| Page is blank | Console errors, build errors |
| Data not loading | Network tab, API routes |
| Styling broken | Tailwind classes, dark mode toggle |
| Slow page | Performance tab, bundle size |
| Works on desktop, broken on mobile | Responsive breakpoints, touch events |
| Works in Chrome, broken in Safari | CSS features, JS compatibility |
| Intermittent error | Race conditions, async timing |

## Delivery checks

- [ ] Console is clean (no errors or warnings)
- [ ] Network tab shows no failed requests
- [ ] Hydration warnings are resolved
- [ ] Performance metrics are within targets (LCP < 2.5s, CLS < 0.1)
- [ ] Tested on mobile viewport
- [ ] Tested in incognito (no extension interference)
