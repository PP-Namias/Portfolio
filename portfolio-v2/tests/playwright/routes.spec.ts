import { test, expect } from "@playwright/test";

const STATIC_ROUTES = [
  "/",
  "/blog",
  "/components",
  "/sponsors",
  "/testimonials",
  "/game",
  "/og",
  "/studio",
  "/vcard",
  "/ads.txt",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
  "/about.md",
  "/experience.md",
  "/projects.md",
  "/certifications.md",
  "/awards.md",
];

const API_ROUTES = [
  "/api/sanity/data",
  "/api/draft-mode/disable",
];

test.describe("Static Routes", () => {
  for (const route of STATIC_ROUTES) {
    test(`should load ${route} successfully`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
    });
  }
});

test.describe("API Routes", () => {
  for (const route of API_ROUTES) {
    test(`should load ${route} successfully`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status()).toBe(200);
    });
  }
});

test.describe("Route Content", () => {
  test("homepage should display user name", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=PP Namias")).toBeVisible();
  });

  test("blog page should display blog posts", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("components page should display components", async ({ page }) => {
    await page.goto("/components");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("testimonials page should display testimonials", async ({ page }) => {
    await page.goto("/testimonials");
    await expect(page.locator("h1")).toBeVisible();
  });
});
