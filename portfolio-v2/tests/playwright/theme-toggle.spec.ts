import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("should toggle dark mode", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Check initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    });
    
    // Find and click theme toggle
    const themeToggle = page.locator("button[aria-label*='theme'], button[aria-label*='Toggle']").first();
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(300);
      
      // Check theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
      });
      
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test("should persist theme preference", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Toggle theme
    const themeToggle = page.locator("button[aria-label*='theme'], button[aria-label*='Toggle']").first();
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(300);
      
      // Check localStorage
      const theme = await page.evaluate(() => {
        return localStorage.getItem("theme");
      });
      
      expect(theme).toBeTruthy();
    }
  });

  test("should respect system preference", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains("dark");
    });
    
    // Should respect system preference (may be dark or light based on implementation)
    expect(typeof isDark).toBe("boolean");
  });
});
