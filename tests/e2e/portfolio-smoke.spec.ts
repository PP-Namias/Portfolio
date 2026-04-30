import { test, expect } from '@playwright/test';

test('home page smoke', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Connect' })).toBeVisible();

  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach('home-full', {
    body: screenshot,
    contentType: 'image/png',
  });
});
