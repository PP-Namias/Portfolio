---
name: performance-monitoring
description: Set up APM, error tracking, and performance optimization monitoring.
---

# Performance Monitoring Skill

Implement application performance monitoring (APM), error tracking, and performance optimization for the portfolio.

## When to use this skill

- Setting up error tracking (Sentry, LogRocket)
- Configuring performance monitoring
- Implementing Core Web Vitals tracking
- Analyzing bundle size
- Optimizing load times

## Workflow

1. **Choose monitoring tools** — Sentry, Vercel Analytics, Web Vitals
2. **Configure tracking** — Set up error and performance tracking
3. **Set up alerts** — Define thresholds for critical metrics
4. **Analyze reports** — Review performance data regularly
5. **Optimize** — Implement improvements based on data

## Sentry Integration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

## Core Web Vitals Tracking

```typescript
// lib/web-vitals.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric);
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body);
  }
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

## Performance Budget

| Metric | Target | Warning |
|--------|--------|---------|
| LCP | < 2.5s | > 4.0s |
| FID | < 100ms | > 300ms |
| CLS | < 0.1 | > 0.25 |
| TTI | < 3.8s | > 7.3s |
| Bundle Size | < 200KB | > 300KB |

## Checklist

- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled
- [ ] Core Web Vitals tracked
- [ ] Bundle analysis configured
- [ ] Alerts set up for critical metrics
- [ ] Regular performance reviews scheduled
