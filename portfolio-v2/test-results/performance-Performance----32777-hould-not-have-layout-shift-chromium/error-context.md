# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance.spec.ts >> Performance - Core Web Vitals >> should not have layout shift
- Location: tests\playwright\performance.spec.ts:14:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Performance - Core Web Vitals", () => {
  4  |   test("homepage should load within performance budget", async ({ page }) => {
  5  |     const startTime = Date.now();
  6  |     
  7  |     await page.goto("/");
  8  |     await page.waitForLoadState("networkidle");
  9  |     
  10 |     const loadTime = Date.now() - startTime;
  11 |     expect(loadTime).toBeLessThan(5000); // 5 second budget
  12 |   });
  13 | 
  14 |   test("should not have layout shift", async ({ page }) => {
> 15 |     await page.goto("/");
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  16 |     await page.waitForLoadState("networkidle");
  17 |     
  18 |     // Check for CLS by verifying no unexpected layout shifts
  19 |     const cls = await page.evaluate(() => {
  20 |       return new Promise<number>((resolve) => {
  21 |         let clsValue = 0;
  22 |         const observer = new PerformanceObserver((list) => {
  23 |           for (const entry of list.getEntries()) {
  24 |             if (!(entry as any).hadRecentInput) {
  25 |               clsValue += (entry as any).value;
  26 |             }
  27 |           }
  28 |         });
  29 |         observer.observe({ type: "layout-shift", buffered: true });
  30 |         setTimeout(() => {
  31 |           observer.disconnect();
  32 |           resolve(clsValue);
  33 |         }, 1000);
  34 |       });
  35 |     });
  36 |     
  37 |     expect(cls).toBeLessThan(0.1); // CLS threshold
  38 |   });
  39 | 
  40 |   test("should have fast First Contentful Paint", async ({ page }) => {
  41 |     await page.goto("/");
  42 |     
  43 |     const fcp = await page.evaluate(() => {
  44 |       return new Promise<number>((resolve) => {
  45 |         const observer = new PerformanceObserver((list) => {
  46 |           for (const entry of list.getEntries()) {
  47 |             if (entry.name === "first-contentful-paint") {
  48 |               resolve(entry.startTime);
  49 |             }
  50 |           }
  51 |         });
  52 |         observer.observe({ type: "paint", buffered: true });
  53 |         setTimeout(() => resolve(0), 5000);
  54 |       });
  55 |     });
  56 |     
  57 |     expect(fcp).toBeLessThan(3000); // 3 second budget
  58 |   });
  59 | });
  60 | 
  61 | test.describe("Performance - Network", () => {
  62 |   test("should not have render-blocking resources", async ({ page }) => {
  63 |     const resources: string[] = [];
  64 |     
  65 |     page.on("response", (response) => {
  66 |       const url = response.url();
  67 |       if (url.endsWith(".css") || url.endsWith(".js")) {
  68 |         resources.push(url);
  69 |       }
  70 |     });
  71 |     
  72 |     await page.goto("/");
  73 |     await page.waitForLoadState("networkidle");
  74 |     
  75 |     // Basic check - resources should load
  76 |     expect(resources.length).toBeGreaterThan(0);
  77 |   });
  78 | 
  79 |   test("should have reasonable number of requests", async ({ page }) => {
  80 |     let requestCount = 0;
  81 |     
  82 |     page.on("request", () => {
  83 |       requestCount++;
  84 |     });
  85 |     
  86 |     await page.goto("/");
  87 |     await page.waitForLoadState("networkidle");
  88 |     
  89 |     expect(requestCount).toBeLessThan(100); // Reasonable limit
  90 |   });
  91 | });
  92 | 
```