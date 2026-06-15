---
name: analytics-integration
description: Set up user analytics, tracking, and insights collection.
---

# Analytics Integration Skill

Implement analytics tracking, user insights, and data collection for the portfolio.

## When to use this skill

- Setting up Google Analytics
- Implementing custom event tracking
- Configuring conversion tracking
- Analyzing user behavior
- Creating analytics dashboards

## Workflow

1. **Choose analytics tools** — GA4, Plausible, Fathom
2. **Implement tracking** — Add tracking code and events
3. **Define goals** — Set up conversion events
4. **Create reports** — Build dashboards and alerts
5. **Analyze and iterate** — Use data to improve

## Plausible Analytics (Privacy-First)

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          defer
          data-domain="namias.tech"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Custom Event Tracking

```typescript
// lib/analytics.ts
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props: properties });
  }
}

// Usage
trackEvent('CTA Clicked', { section: 'hero', button: 'resume' });
trackEvent('Project Viewed', { project: 'portfolio', type: 'live' });
```

## Key Metrics to Track

| Metric | Description |
|--------|-------------|
| Page Views | Total page visits |
| Unique Visitors | Individual users |
| Bounce Rate | Single-page sessions |
| Session Duration | Time on site |
| Conversion Rate | Goal completions |
| Top Pages | Most visited content |

## Checklist

- [ ] Analytics tool configured
- [ ] Privacy policy updated
- [ ] Custom events defined
- [ ] Conversion goals set
- [ ] Dashboard created
- [ ] Alerts configured
