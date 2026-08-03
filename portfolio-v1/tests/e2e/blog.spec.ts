import { test, expect } from '@playwright/test';

test('blog list shows the fixture posts', async ({ page }) => {
  await page.goto('/blog');

  await expect(page.getByText('E2E Post One')).toBeVisible();
  await expect(page.getByText('E2E Post Two')).toBeVisible();
});

test('blog detail renders the fixture post body', async ({ page }) => {
  await page.goto('/blog/e2e-post-one');

  await expect(page.getByText('E2E Post One')).toBeVisible();
  await expect(page.getByText('This is the E2E post body.')).toBeVisible();
});
