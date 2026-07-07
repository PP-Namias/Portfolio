import { test, expect } from "@playwright/test";

test.describe("Theme Visual - Light Mode", () => {
  test("homepage light mode should match snapshot", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    });
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot("homepage-light.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("blog light mode should match snapshot", async ({ page }) => {
    await page.goto("/blog");
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    });
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot("blog-light.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe("Theme Visual - Dark Mode", () => {
  test("homepage dark mode should match snapshot", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot("homepage-dark.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("blog dark mode should match snapshot", async ({ page }) => {
    await page.goto("/blog");
    await page.evaluate(() => {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot("blog-dark.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe("Theme Visual - System Preference", () => {
  test("should respect prefers-color-scheme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot("homepage-system-dark.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("should respect light preference", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot("homepage-system-light.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});
