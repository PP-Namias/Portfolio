import { test, expect } from "@playwright/test";

test.describe("Component Visual - Hero Section", () => {
  test("hero section should match snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const hero = page.locator("section").first();
    await expect(hero).toHaveScreenshot("hero-section.png", {
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe("Component Visual - Projects", () => {
  test("projects section should match snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Scroll to projects section
    await page.evaluate(() => {
      const projects = document.querySelector("[id='projects']");
      if (projects) projects.scrollIntoView();
    });
    await page.waitForTimeout(500);
    
    const projects = page.locator("[id='projects']").first();
    if (await projects.count() > 0) {
      await expect(projects).toHaveScreenshot("projects-section.png", {
        maxDiffPixelRatio: 0.01,
      });
    }
  });
});

test.describe("Component Visual - Certifications", () => {
  test("certifications section should match snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    await page.evaluate(() => {
      const certs = document.querySelector("[id='certifications']");
      if (certs) certs.scrollIntoView();
    });
    await page.waitForTimeout(500);
    
    const certs = page.locator("[id='certifications']").first();
    if (await certs.count() > 0) {
      await expect(certs).toHaveScreenshot("certifications-section.png", {
        maxDiffPixelRatio: 0.01,
      });
    }
  });
});

test.describe("Component Visual - Experience", () => {
  test("experience section should match snapshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    await page.evaluate(() => {
      const exp = document.querySelector("[id='experience']");
      if (exp) exp.scrollIntoView();
    });
    await page.waitForTimeout(500);
    
    const exp = page.locator("[id='experience']").first();
    if (await exp.count() > 0) {
      await expect(exp).toHaveScreenshot("experience-section.png", {
        maxDiffPixelRatio: 0.01,
      });
    }
  });
});
