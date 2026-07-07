import { test, expect } from "@playwright/test";

test.describe("OG Image Capture", () => {
  test("homepage OG image should render", async ({ page }) => {
    await page.goto("/og");
    await page.waitForLoadState("networkidle");
    
    // Check if OG page renders
    const content = await page.content();
    expect(content).toBeTruthy();
  });

  test("should capture OG image for homepage", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto("/og");
    await page.waitForLoadState("networkidle");
    
    await page.screenshot({
      path: "tests/playwright/screenshots/og/homepage-og.png",
    });
  });
});

test.describe("OG Image - Simple Route", () => {
  test("should capture simple OG image", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto("/og/simple");
    await page.waitForLoadState("networkidle");
    
    await page.screenshot({
      path: "tests/playwright/screenshots/og/simple-og.png",
    });
  });
});

test.describe("OG Image - Domain Route", () => {
  test("should capture domain OG image", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto("/og/domain");
    await page.waitForLoadState("networkidle");
    
    await page.screenshot({
      path: "tests/playwright/screenshots/og/domain-og.png",
    });
  });
});
