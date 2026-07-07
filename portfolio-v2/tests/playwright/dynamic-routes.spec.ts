import { test, expect } from "@playwright/test";

test.describe("Blog Dynamic Routes", () => {
  test("should load blog post pages", async ({ page }) => {
    const response = await page.goto("/blog/welcome");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should load blog post with MDX content", async ({ page }) => {
    await page.goto("/blog/welcome");
    const content = await page.locator("article").textContent();
    expect(content).toBeTruthy();
  });
});

test.describe("Component Dynamic Routes", () => {
  test("should load component documentation pages", async ({ page }) => {
    const response = await page.goto("/components/shimmering-text");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should display component preview", async ({ page }) => {
    await page.goto("/components/shimmering-text");
    await expect(page.locator("[data-testid='component-preview']")).toBeVisible();
  });
});

test.describe("Block Routes", () => {
  test("should load blocks list page", async ({ page }) => {
    const response = await page.goto("/blocks");
    expect(response?.status()).toBe(200);
  });

  test("should load marketing blocks category", async ({ page }) => {
    const response = await page.goto("/blocks/marketing");
    expect(response?.status()).toBe(200);
  });
});
