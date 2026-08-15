import { test, expect, type Page } from '@playwright/test';

function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (text.includes('Content-Security-Policy directive name')) {
        return;
      }
      errors.push(text);
    }
  });
  return errors;
}

test('home page renders hero and sections from the CMS fixture', async ({ page }) => {
  const errors = trackErrors(page);

  await page.goto('/');

  await expect(page.getByText('E2E Hero Name', { exact: true })).toBeVisible();
  await expect(page.getByText('E2E about paragraph')).toBeVisible();
  expect(errors).toEqual([]);
});
