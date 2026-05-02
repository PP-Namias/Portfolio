import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = path.join(process.cwd(), 'e2e-screenshots');

test.describe('Automated Screenshots', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test('Portfolio Full Page Screenshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for the page to be fully loaded (avoid networkidle in dev due to HMR)
    await page.waitForLoadState('domcontentloaded');

    // Give a brief moment for any initial Framer Motion animations to settle
    await page.waitForTimeout(2000);

    const screenshotPath = path.join(SCREENSHOT_DIR, 'portfolio-full.png');
    const screenshot = await page.screenshot({ path: screenshotPath, fullPage: true });
    
    await test.info().attach('portfolio-full-page', {
      body: screenshot,
      contentType: 'image/png',
    });
  });

  test('Sanity Studio Screenshot', async ({ page }) => {
    // Navigate to local Sanity Studio instance
    await page.goto('http://localhost:3333', { waitUntil: 'domcontentloaded' });
    
    // Wait for the studio to load (avoid networkidle due to persistent connections)
    await page.waitForLoadState('domcontentloaded');
    
    // Give an extra buffer for Sanity Studio initial render
    await page.waitForTimeout(3000);

    const screenshotPath = path.join(SCREENSHOT_DIR, 'sanity-studio.png');
    const screenshot = await page.screenshot({ path: screenshotPath, fullPage: true });

    await test.info().attach('sanity-studio-interface', {
      body: screenshot,
      contentType: 'image/png',
    });
  });
});
