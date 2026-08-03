import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

const FIXTURE_PATH = path.resolve(__dirname, 'fixtures', 'cms-live.json');
const HERO_NAME_V1 = 'E2E Hero Name';
const HERO_NAME_V2 = 'E2E Live Name';

async function setHeroName(name: string): Promise<void> {
  const fixture = JSON.parse(await readFile(FIXTURE_PATH, 'utf8')) as {
    profile: { fullName: string };
  };
  fixture.profile.fullName = name;
  await writeFile(FIXTURE_PATH, JSON.stringify(fixture, null, 2));
}

async function bumpViaWebhook(page: Page): Promise<void> {
  const response = await page.request.post('/api/sanity/webhook', {
    headers: { 'x-sanity-webhook-secret': 'e2e-secret' },
    data: { _type: 'profile', operation: 'update' },
  });
  expect(response.status()).toBe(200);
}

test('open tab updates without reload when the CMS version bumps', async ({ page }) => {
  await setHeroName(HERO_NAME_V1);

  let loadCount = 0;
  page.on('load', () => {
    loadCount += 1;
  });

  await page.goto('/');
  await expect(page.getByText(HERO_NAME_V1, { exact: true })).toBeVisible();

  await page.waitForResponse((res) => res.url().includes('/api/sanity/live') && res.status() === 200);
  await page.waitForTimeout(1_200);

  await setHeroName(HERO_NAME_V2);
  await bumpViaWebhook(page);

  await expect(page.getByText(HERO_NAME_V2, { exact: true })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(HERO_NAME_V1, { exact: true })).not.toBeVisible();

  expect(loadCount).toBeLessThanOrEqual(1);

  await setHeroName(HERO_NAME_V1);
});