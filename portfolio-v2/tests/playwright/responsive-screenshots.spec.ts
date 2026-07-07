import { test, expect } from "@playwright/test";

const ROUTES = [
  { path: "/", name: "homepage" },
  { path: "/blog", name: "blog" },
  { path: "/components", name: "components" },
  { path: "/testimonials", name: "testimonials" },
];

const VIEWPORTS = [
  { name: "mobile-s", width: 320, height: 568, deviceScaleFactor: 2 },
  { name: "mobile-m", width: 375, height: 667, deviceScaleFactor: 2 },
  { name: "mobile-l", width: 428, height: 926, deviceScaleFactor: 3 },
  { name: "tablet", width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: "laptop", width: 1366, height: 768, deviceScaleFactor: 1 },
  { name: "desktop", width: 1920, height: 1080, deviceScaleFactor: 1 },
];

test.describe("Responsive Screenshots", () => {
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      test(`${route.name} at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        
        await page.goto(route.path);
        await page.waitForLoadState("networkidle");
        
        await page.screenshot({
          path: `tests/playwright/screenshots/responsive/${route.name}-${viewport.name}.png`,
          fullPage: true,
        });
      });
    }
  }
});
