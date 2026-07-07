# Playwright MCP Automation

Automated browser testing for the PP Namias portfolio using Playwright with MCP integration.

## Overview

Playwright MCP provides automated browser testing capabilities with:
- Cross-browser testing (Chromium, Firefox, WebKit)
- Visual regression testing
- Accessibility auditing
- Performance monitoring
- Screenshot capture
- Network request tracking

## Setup

### Prerequisites
- Node.js 18+
- pnpm

### Installation
```bash
pnpm add -D @playwright/test @playwright/mcp
pnpm exec playwright install
```

## Configuration

### opencode.json
```json
{
  "mcp": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### playwright.config.ts
- 5 browser projects: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- Base URL: http://localhost:3000
- Web server: pnpm dev --port 3000
- HTML reporter at playwright-report/

## Test Suites

### Route Health (routes.spec.ts)
Tests all static routes return 200 OK.

### Dynamic Routes (dynamic-routes.spec.ts)
Tests `/projects/[slug]` and `/blog/[slug]` with valid/invalid slugs.

### API Routes (api-routes.spec.ts)
Tests JSON API endpoints return valid JSON.

### Visual Regression (visual-regression.spec.ts)
Homepage snapshot comparison for visual diff detection.

### Component Visual (component-visual.spec.ts)
Section-level snapshots: hero, projects, certifications, experience.

### Theme Visual (theme-visual.spec.ts)
Dark/light mode screenshots with system preference emulation.

### Accessibility (accessibility.spec.ts)
WCAG 2.1 AA: lang attribute, ARIA, heading order, skip links, images, forms, links.

### Keyboard Navigation (keyboard-navigation.spec.ts)
Tab order, focus indicators, skip links, Enter/Escape key handling.

### Color Contrast (color-contrast.spec.ts)
Text, paragraph, link, button color contrast in light and dark modes.

### Screenshots (screenshots.spec.ts)
Full-page captures for homepage, blog, components, testimonials.

### Responsive (responsive-screenshots.spec.ts)
6 viewports (320px to 1920px) x 4 routes = 24 screenshots.

### OG Images (og-screenshots.spec.ts)
OpenGraph image capture at 1200x630 standard dimensions.

### Performance (performance.spec.ts)
Core Web Vitals (LCP, FID, CLS), TBT, Speed Index, navigation timing.

### Network Performance (network-performance.spec.ts)
Load time, DOM size, CLS, request count, response size budgets.

### SEO Meta (seo-meta.spec.ts)
Title, description, OG tags, Twitter cards, canonical URLs.

### Structured Data (structured-data.spec.ts)
JSON-LD validation, og:title, og:description, og:image, twitter:card.

### Sitemap & Robots (sitemap-robots.spec.ts)
sitemap.xml validity, robots.txt structure, sitemap reference.

### Command Menu (command-menu.spec.ts)
Open/close, search, keyboard shortcut, navigation.

### Theme Toggle (theme-toggle.spec.ts)
Dark mode toggle, localStorage persistence, system preference.

### Navigation (navigation.spec.ts)
Header links, footer links, command menu search.

## Running Tests

```bash
# All tests
pnpm exec playwright test

# Specific browser
pnpm exec playwright test --project=chromium

# Specific suite
pnpm exec playwright test routes.spec.ts

# With UI
pnpm exec playwright test --ui

# Debug mode
pnpm exec playwright test --debug
```

## CI/CD

### playwright.yml
- Matrix: chromium, firefox, webkit
- Uploads: report, trace, screenshots
- Artifacts retained 30 days

### playwright-report.yml
- Triggered on Playwright workflow completion
- Deploys report to GitHub Pages

## Writing Tests

### Import
```typescript
import { test, expect } from "@playwright/test";
```

### Basic pattern
```typescript
test("description", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  
  // Assertions
  await expect(page).toHaveTitle(/title/);
});
```

### Visual regression
```typescript
test("snapshot", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("name.png", {
    maxDiffPixelRatio: 0.01,
  });
});
```

### Accessibility
```typescript
test("a11y", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveNoViolations();
});
```

## Skill

See `.agents/skills/playwright-mcp/SKILL.md` for detailed usage with MCP integration.
