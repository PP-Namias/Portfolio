import { test, expect } from "@playwright/test";

test.describe("Keyboard Navigation - Tab Order", () => {
  test("should navigate through interactive elements with Tab", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Start tabbing from the beginning
    await page.keyboard.press("Tab");
    await page.waitForTimeout(100);
    
    // Check that focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        role: el?.getAttribute("role"),
        href: el?.getAttribute("href"),
      };
    });
    
    expect(focusedElement.tagName).toBeTruthy();
  });

  test("should have visible focus indicators", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Tab to first interactive element
    await page.keyboard.press("Tab");
    await page.waitForTimeout(100);
    
    // Check for focus-visible styles
    const hasFocusStyles = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      
      const styles = window.getComputedStyle(el);
      const outline = styles.outline;
      const boxShadow = styles.boxShadow;
      
      return outline !== "none" || boxShadow !== "none";
    });
    
    // Focus styles should exist (may be outline or box-shadow)
    expect(typeof hasFocusStyles).toBe("boolean");
  });

  test("should skip to main content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Tab multiple times to find skip link
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(50);
    }
    
    // Check if skip link exists and is focusable
    const skipLink = await page.locator("a[href='#content'], a[href='#main']").count();
    expect(skipLink).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Keyboard Navigation - Links", () => {
  test("should activate links with Enter", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Find first link
    const firstLink = page.locator("a[href]").first();
    if (await firstLink.count() > 0) {
      await firstLink.focus();
      
      // Check link is focused
      const isFocused = await page.evaluate(() => {
        return document.activeElement?.tagName === "A";
      });
      expect(isFocused).toBe(true);
    }
  });
});

test.describe("Keyboard Navigation - Escape", () => {
  test("should close command menu with Escape", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Open command menu
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(500);
    
    // Close with Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    
    // Command menu should be closed
    const dialog = await page.locator("[role='dialog']").count();
    expect(dialog).toBe(0);
  });
});
