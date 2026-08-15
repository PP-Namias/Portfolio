import { test, expect, type Page } from '@playwright/test';

const VALID_SECRET = 'e2e-secret';

async function currentVersion(page: Page): Promise<number> {
  const response = await page.request.get('/api/sanity/live');
  expect(response.status()).toBe(200);
  const body = (await response.json()) as { version: number };
  return body.version;
}

test('rejects an invalid webhook secret without bumping the version', async ({ page }) => {
  const before = await currentVersion(page);

  const wrong = await page.request.post('/api/sanity/webhook', {
    headers: { 'x-sanity-webhook-secret': 'wrong-secret' },
    data: { _type: 'profile' },
  });
  expect(wrong.status()).toBe(401);

  const missing = await page.request.post('/api/sanity/webhook', {
    data: { _type: 'profile' },
  });
  expect(missing.status()).toBe(401);

  expect(await currentVersion(page)).toBe(before);
});

test('accepts a valid webhook secret and bumps the version', async ({ page }) => {
  const before = await currentVersion(page);

  const accepted = await page.request.post('/api/sanity/webhook', {
    headers: { 'x-sanity-webhook-secret': VALID_SECRET },
    data: { _type: 'profile', operation: 'update' },
  });
  expect(accepted.status()).toBe(200);

  await expect.poll(() => currentVersion(page)).toBe(before + 1);
});