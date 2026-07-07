import { test, expect } from "@playwright/test";

test.describe("Network Performance", () => {
  test("should load homepage within performance budget", async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto("/", { waitUntil: "load" });
    
    const loadTime = Date.now() - startTime;
    console.log(`Homepage load time: ${loadTime}ms`);
    
    // Budget: 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("should have reasonable DOM size", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const domSize = await page.evaluate(() => {
      return document.querySelectorAll("*").length;
    });
    
    console.log(`DOM size: ${domSize}`);
    
    // Budget: 1000 nodes
    expect(domSize).toBeLessThan(1000);
  });

  test("should minimize layout shifts", async ({ page }) => {
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            clsValue += (entry as any).value;
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });
        
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 1000);
      });
    });
    
    console.log(`CLS: ${cls}`);
    
    // Budget: 0.1
    expect(cls).toBeLessThan(0.1);
  });

  test("should track network requests", async ({ page }) => {
    const requests: string[] = [];
    
    page.on("request", (request) => {
      requests.push(request.url());
    });
    
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    console.log(`Total requests: ${requests.length}`);
    
    // Budget: 50 requests
    expect(requests.length).toBeLessThan(50);
  });

  test("should track response sizes", async ({ page }) => {
    const responseSizes: number[] = [];
    
    page.on("response", async (response) => {
      try {
        const body = await response.body();
        responseSizes.push(body.length);
      } catch {
        // Response may not have body
      }
    });
    
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    const totalSize = responseSizes.reduce((sum, size) => sum + size, 0);
    console.log(`Total response size: ${(totalSize / 1024).toFixed(2)} KB`);
    
    // Budget: 2 MB
    expect(totalSize).toBeLessThan(2 * 1024 * 1024);
  });
});
