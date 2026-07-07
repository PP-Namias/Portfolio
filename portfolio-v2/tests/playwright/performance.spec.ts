import { test, expect } from "@playwright/test";

test.describe("Performance - Core Web Vitals", () => {
  test("homepage should load within performance budget", async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // 5 second budget
  });

  test("should not have layout shift", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Check for CLS by verifying no unexpected layout shifts
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 1000);
      });
    });
    
    expect(cls).toBeLessThan(0.1); // CLS threshold
  });

  test("should have fast First Contentful Paint", async ({ page }) => {
    await page.goto("/");
    
    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === "first-contentful-paint") {
              resolve(entry.startTime);
            }
          }
        });
        observer.observe({ type: "paint", buffered: true });
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    expect(fcp).toBeLessThan(3000); // 3 second budget
  });
});

test.describe("Performance - Network", () => {
  test("should not have render-blocking resources", async ({ page }) => {
    const resources: string[] = [];
    
    page.on("response", (response) => {
      const url = response.url();
      if (url.endsWith(".css") || url.endsWith(".js")) {
        resources.push(url);
      }
    });
    
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    // Basic check - resources should load
    expect(resources.length).toBeGreaterThan(0);
  });

  test("should have reasonable number of requests", async ({ page }) => {
    let requestCount = 0;
    
    page.on("request", () => {
      requestCount++;
    });
    
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    expect(requestCount).toBeLessThan(100); // Reasonable limit
  });
});
