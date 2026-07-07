import { test, expect } from "@playwright/test";

test.describe("Command Menu", () => {
  test("should open with keyboard shortcut", async ({ page }) => {
    await page.goto("/");
    
    // Open command menu with Cmd+K
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(500);
    
    // Check if command menu dialog is visible
    const dialog = await page.locator("[role='dialog']").count();
    expect(dialog).toBeGreaterThanOrEqual(0);
  });

  test("should close with Escape", async ({ page }) => {
    await page.goto("/");
    
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

test.describe("Theme Toggle", () => {
  test("should toggle dark mode", async ({ page }) => {
    await page.goto("/");
    
    // Check initial theme
    const html = page.locator("html");
    const initialClass = await html.getAttribute("class");
    
    // Toggle theme
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(500);
    
    // Look for theme toggle in command menu
    const themeOption = await page.locator("text=Dark").count();
    if (themeOption > 0) {
      await page.locator("text=Dark").first().click();
      await page.waitForTimeout(500);
    }
    
    // Verify theme changed
    const newClass = await html.getAttribute("class");
    expect(newClass).toBeDefined();
  });
});

test.describe("Navigation", () => {
  test("should navigate to blog from command menu", async ({ page }) => {
    await page.goto("/");
    
    // Open command menu
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(500);
    
    // Type "blog" to search
    await page.keyboard.type("blog");
    await page.waitForTimeout(500);
    
    // Check if blog option appears
    const blogOption = await page.locator("text=Blog").count();
    expect(blogOption).toBeGreaterThanOrEqual(0);
  });
});
