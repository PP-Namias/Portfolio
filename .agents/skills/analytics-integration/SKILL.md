---
name: analytics-integration
description: Configure and manage Umami analytics tracking for the portfolio.
---

# Analytics Integration Skill

The portfolio uses **Umami** (cloud.umami.is) for privacy-first analytics. This skill covers configuring, customizing, and reviewing Umami tracking.

## When to use this skill

- Configuring Umami tracking for new pages or routes
- Adding custom event tracking (CTA clicks, project views, etc.)
- Reviewing analytics data in the Umami dashboard
- Troubleshooting tracking issues (missing data, incorrect counts)
- Updating the Umami script URL or website ID

## Current setup

- **Provider:** Umami Cloud (cloud.umami.is)
- **Script:** Loaded via `src/components/ui/Analytics.tsx`
- **CSP:** Umami origins whitelisted in `next.config.js` (`script-src`, `connect-src`)
- **Tracking:** Automatic page views via the Umami script

## Workflow

### 1. Verify Umami is tracking

1. Open the site in a browser
2. Open DevTools → Network → filter by `umami`
3. Look for a request to `cloud.umami.is` with a `200` status
4. If missing, check `Analytics.tsx` and CSP headers

### 2. Add custom event tracking

Umami supports custom events via the `umami` global:

```typescript
// Track a CTA click
window.umami?.track('CTA Clicked', { section: 'hero', button: 'resume' });

// Track a project view
window.umami?.track('Project Viewed', { project: slug, type: 'live' });

// Track a blog post read
window.umami?.track('Blog Read', { post: slug, category });
```

**Where to add events:**
- Hero section CTA buttons → `'CTA Clicked'`
- Project card clicks → `'Project Viewed'`
- Blog post reads → `'Blog Read'`
- Certification expand → `'Cert Expanded'`
- Contact form submit → `'Contact Submitted'`

### 3. Update Umami configuration

If the Umami script URL or website ID changes:

1. Update `src/components/ui/Analytics.tsx`
2. Update CSP in `next.config.js`:
   - `script-src` → add the new Umami domain
   - `connect-src` → add the new Umami API domain

### 4. Review analytics data

1. Log in to cloud.umami.is
2. Dashboard → Overview for traffic summary
3. Realtime → Active visitors now
4. Pages → Top pages and entry points
5. Events → Custom event breakdowns
6. Revenue → (if configured) conversion tracking

## Key metrics

| Metric | Where to find | What to look for |
|--------|---------------|------------------|
| Page views | Dashboard → Overview | Trends over time |
| Unique visitors | Dashboard → Overview | Growth trajectory |
| Top pages | Pages → Page views | Which sections get traffic |
| Referrers | Referrers → Source | Where visitors come from |
| Events | Events → Custom events | CTA engagement, project views |
| Bounce rate | Dashboard → Overview | < 50% is good |
| Average duration | Dashboard → Overview | > 2min is good |

## Sanity schema fields

The Sanity `siteSettings` document has analytics fields:
- `analytics.ga4MeasurementId` — GA4 ID (not wired up, schema-only)
- `analytics.plausibleDomain` — Plausible domain (not wired up, schema-only)
- `analytics.enableVercelAnalytics` — Vercel Analytics toggle (not wired up)

These are **not connected** to the frontend. Only Umami is active.

## Troubleshooting

**No data in Umami dashboard:**
1. Check if the Umami script loads (Network tab)
2. Verify CSP headers allow `cloud.umami.is`
3. Check the website ID in `Analytics.tsx` matches the Umami dashboard

**Custom events not showing:**
1. Verify `window.umami` is defined (add `console.log(window.umami)`)
2. Check the event name matches exactly in the dashboard
3. Events may take a few minutes to appear

**Duplicate page views:**
1. Check if the Umami script loads multiple times (React Strict Mode can cause this in dev)
2. Verify the script tag has `defer` attribute
