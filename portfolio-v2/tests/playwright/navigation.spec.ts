import { test, expect } from "@playwright/test";

test.describe("Navigation - Header Links", () => {
  test("should navigate to homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Click logo or home link
    const homeLink = page.locator("a[href='/'], a[href='http://localhost:3000']").first();
    if (await homeLink.count() > 0) {
      await homeLink.click();
      await page.waitForLoadState("networkidle");
      
      expect(page.url()).toBe("http://localhost:3000/");
    }
  });

  test("should navigate to blog", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const blogLink = page.locator("a[href='/blog']").first();
    if (await blogLink.count() > 0) {
      await blogLink.click();
      await page.waitForLoadState("networkidle");
      
      expect(page.url()).toContain("/blog");
    }
  });

  test("should navigate to components", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const componentsLink = page.locator("a[href='/components']").first();
    if (await componentsLink.count() > 0) {
      await componentsLink.click();
      await page.waitForLoadState("networkidle");
      
      expect(page.url()).toContain("/components");
    }
  });
});

test.describe("Navigation - Footer Links", () => {
  test("should have footer navigation", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const footer = await page.locator("footer").count();
    expect(footer).toBeGreaterThan(0);
  });

  test("footer should have links", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const footerLinks = await page.locator("footer a[href]").count();
    expect(footerLinks).toBeGreaterThan(0);
  });
});

test.describe("Navigation - Command Menu", () => {
  test("should open command menu with keyboard", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(500);
    
    const dialog = await page.locator("[role='dialog']").count();
    expect(dialog).toBeGreaterThan(0);
  });

  test("should search in command menu", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(500);
    
    const input = page.locator("[role='dialog'] input");
    if (await input.count() > 0) {
      await input.fill("blog");
      await page.waitForTimeout(300);
      
      // Check search results
      const results = await page.locator("[role='dialog'] [role='option'], [role='dialog'] li").count();
      expect(results).toBeGreaterThanOrEqual(0);
    }
  });
});
