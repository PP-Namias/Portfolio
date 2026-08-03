import { test, expect } from '@playwright/test';

test('connect chips render the Discord label from the message platform', async ({ page }) => {
  await page.goto('/');

  const discord = page.getByRole('link', { name: 'Discord' }).first();
  await expect(discord).toBeVisible();

  const github = page.getByRole('link', { name: 'Github' }).first();
  await expect(github).toBeVisible();
});
