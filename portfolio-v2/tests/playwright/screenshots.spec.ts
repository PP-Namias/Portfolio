import { test, expect } from "@playwright/test";

const ROUTES_TO_CAPTURE = [
  { path: "/", name: "homepage" },
  { path: "/blog", name: "blog" },
  { path: "/components", name: "components" },
  { path: "/sponsors", name: "sponsors" },
  { path: "/testimonials", name: "testimonials" },
  { path: "/game", name: "game" },
  { path: "/studio", name: "studio" },
];

test.describe("Screenshot Capture", () => {
  for (const route of ROUTES_TO_CAPTURE) {
    test(`capture ${route.name} screenshot`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");
      
      await page.screenshot({
        path: `tests/playwright/screenshots/${route.name}.png`,
        fullPage: true,
      });
    });
  }
});

test.describe("Responsive Screenshots", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 812 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    test(`capture homepage at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      await page.screenshot({
        path: `tests/playwright/screenshots/homepage-${viewport.name}.png`,
        fullPage: true,
      });
    });
  }
});
