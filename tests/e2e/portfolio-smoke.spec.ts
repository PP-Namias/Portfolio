import { test, expect } from '@playwright/test';

test('home page smoke', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Wait for the page to be fully loaded (avoid networkidle in dev due to HMR)
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach('home-full', {
    body: screenshot,
    contentType: 'image/png',
  });
});
