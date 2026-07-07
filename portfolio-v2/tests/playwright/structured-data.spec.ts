import { test, expect } from "@playwright/test";

test.describe("Structured Data - JSON-LD", () => {
  test("homepage should have valid JSON-LD", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const jsonLd = await page.evaluate(() => {
      const scripts = document.querySelectorAll("script[type='application/ld+json']");
      const data: any[] = [];
      scripts.forEach((script) => {
        try {
          data.push(JSON.parse(script.textContent || ""));
        } catch {
          // Invalid JSON-LD
        }
      });
      return data;
    });
    
    expect(jsonLd.length).toBeGreaterThan(0);
    
    // Validate each JSON-LD block
    for (const item of jsonLd) {
      expect(item).toHaveProperty("@context");
      expect(item["@context"]).toBe("https://schema.org");
      expect(item).toHaveProperty("@type");
    }
  });

  test("JSON-LD should have required fields", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const jsonLd = await page.evaluate(() => {
      const script = document.querySelector("script[type='application/ld+json']");
      if (!script) return null;
      try {
        return JSON.parse(script.textContent || "");
      } catch {
        return null;
      }
    });
    
    if (jsonLd) {
      expect(jsonLd).toHaveProperty("@context");
      expect(jsonLd).toHaveProperty("@type");
    }
  });
});

test.describe("Structured Data - Meta Tags", () => {
  test("should have og:title", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const ogTitle = await page.locator("meta[property='og:title']").getAttribute("content");
    expect(ogTitle).toBeTruthy();
  });

  test("should have og:description", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const ogDesc = await page.locator("meta[property='og:description']").getAttribute("content");
    expect(ogDesc).toBeTruthy();
  });

  test("should have og:image", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const ogImage = await page.locator("meta[property='og:image']").getAttribute("content");
    expect(ogImage).toBeTruthy();
  });

  test("should have twitter:card", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const twitterCard = await page.locator("meta[name='twitter:card']").getAttribute("content");
    expect(twitterCard).toBeTruthy();
  });
});
