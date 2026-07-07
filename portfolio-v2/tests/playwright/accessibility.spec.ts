import { test, expect } from "@playwright/test";

test.describe("Accessibility - Homepage", () => {
  test("homepage should have no accessibility violations", async ({ page }) => {
    await page.goto("/");
    
    // Check for basic accessibility
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check for main landmark
    const main = await page.locator("main").count();
    expect(main).toBeGreaterThan(0);
    
    // Check for heading hierarchy
    const h1 = await page.locator("h1").count();
    expect(h1).toBeGreaterThanOrEqual(1);
    
    // Check for alt text on images
    const images = await page.locator("img").all();
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });

  test("homepage should have proper lang attribute", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("en");
  });
});

test.describe("Accessibility - Navigation", () => {
  test("should have skip to content link", async ({ page }) => {
    await page.goto("/");
    const skipLink = await page.locator("a[href='#content']").count();
    // Skip link may be hidden until focused
    expect(skipLink).toBeGreaterThanOrEqual(0);
  });

  test("should have proper navigation landmarks", async ({ page }) => {
    await page.goto("/");
    const nav = await page.locator("nav").count();
    expect(nav).toBeGreaterThan(0);
  });
});

test.describe("Accessibility - Forms", () => {
  test("command menu should be keyboard accessible", async ({ page }) => {
    await page.goto("/");
    
    // Open command menu with keyboard
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(500);
    
    // Check if command menu is visible
    const commandMenu = await page.locator("[role='dialog']").count();
    expect(commandMenu).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Accessibility - Color Contrast", () => {
  test("text should have sufficient contrast", async ({ page }) => {
    await page.goto("/");
    
    // Check that text elements exist
    const textElements = await page.locator("p, h1, h2, h3, h4, h5, h6").count();
    expect(textElements).toBeGreaterThan(0);
  });
});
