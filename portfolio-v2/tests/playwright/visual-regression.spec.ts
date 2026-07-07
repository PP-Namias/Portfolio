import { test, expect } from "@playwright/test";

test.describe("Visual Regression - Homepage", () => {
  test("homepage should match snapshot", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("homepage dark mode should match snapshot", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await expect(page).toHaveScreenshot("homepage-dark.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe("Visual Regression - Blog", () => {
  test("blog page should match snapshot", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveScreenshot("blog.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe("Visual Regression - Components", () => {
  test("components page should match snapshot", async ({ page }) => {
    await page.goto("/components");
    await expect(page).toHaveScreenshot("components.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe("Visual Regression - Testimonials", () => {
  test("testimonials page should match snapshot", async ({ page }) => {
    await page.goto("/testimonials");
    await expect(page).toHaveScreenshot("testimonials.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});
