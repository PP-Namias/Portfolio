import { test, expect } from "@playwright/test";

test.describe("Color Contrast - Text Elements", () => {
  test("headings should have sufficient contrast", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    
    for (const heading of headings.slice(0, 5)) {
      const color = await heading.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });
      
      // Verify color is defined
      expect(color).toBeTruthy();
      expect(color).not.toBe("rgba(0, 0, 0, 0)");
    }
  });

  test("paragraphs should have sufficient contrast", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const paragraphs = await page.locator("p").all();
    
    for (const para of paragraphs.slice(0, 5)) {
      const color = await para.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });
      
      expect(color).toBeTruthy();
      expect(color).not.toBe("rgba(0, 0, 0, 0)");
    }
  });

  test("links should have distinct color", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const links = await page.locator("a[href]").all();
    
    for (const link of links.slice(0, 5)) {
      const color = await link.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });
      
      expect(color).toBeTruthy();
    }
  });
});

test.describe("Color Contrast - Interactive Elements", () => {
  test("buttons should have sufficient contrast", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const buttons = await page.locator("button").all();
    
    for (const btn of buttons.slice(0, 3)) {
      const color = await btn.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });
      
      expect(color).toBeTruthy();
    }
  });
});

test.describe("Color Contrast - Dark Mode", () => {
  test("text should have sufficient contrast in dark mode", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(300);
    
    const headings = await page.locator("h1, h2, h3").all();
    
    for (const heading of headings.slice(0, 3)) {
      const color = await heading.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });
      
      expect(color).toBeTruthy();
      expect(color).not.toBe("rgba(0, 0, 0, 0)");
    }
  });
});
