import { test, expect } from "@playwright/test";

test.describe("SEO - Meta Tags", () => {
  test("homepage should have title", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain("PP Namias");
  });

  test("homepage should have meta description", async ({ page }) => {
    await page.goto("/");
    const description = await page.locator("meta[name='description']").getAttribute("content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
  });

  test("homepage should have Open Graph tags", async ({ page }) => {
    await page.goto("/");
    
    const ogTitle = await page.locator("meta[property='og:title']").getAttribute("content");
    expect(ogTitle).toBeTruthy();
    
    const ogDescription = await page.locator("meta[property='og:description']").getAttribute("content");
    expect(ogDescription).toBeTruthy();
    
    const ogImage = await page.locator("meta[property='og:image']").getAttribute("content");
    expect(ogImage).toBeTruthy();
  });

  test("homepage should have Twitter card tags", async ({ page }) => {
    await page.goto("/");
    
    const twitterCard = await page.locator("meta[name='twitter:card']").getAttribute("content");
    expect(twitterCard).toBeTruthy();
    
    const twitterCreator = await page.locator("meta[name='twitter:creator']").getAttribute("content");
    expect(twitterCreator).toBeTruthy();
  });
});

test.describe("SEO - Canonical URL", () => {
  test("homepage should have canonical URL", async ({ page }) => {
    await page.goto("/");
    const canonical = await page.locator("link[rel='canonical']").getAttribute("href");
    expect(canonical).toBeTruthy();
    expect(canonical).toContain("namias.tech");
  });
});

test.describe("SEO - Structured Data", () => {
  test("homepage should have JSON-LD", async ({ page }) => {
    await page.goto("/");
    const jsonLd = await page.locator("script[type='application/ld+json']").count();
    expect(jsonLd).toBeGreaterThan(0);
  });
});
