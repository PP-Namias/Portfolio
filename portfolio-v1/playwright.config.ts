import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const WEB_SERVER_PORT = 3100;
const FIXTURE_PATH = path.resolve(__dirname, 'tests/e2e/fixtures/cms-live.json');

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${WEB_SERVER_PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    serviceWorkers: 'block',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npx next dev -p ${WEB_SERVER_PORT}`,
    port: WEB_SERVER_PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      E2E_CMS_FILE: FIXTURE_PATH,
      NEXT_PUBLIC_SANITY_LIVE_POLL_MS: '300',
      SANITY_REVALIDATE_SECRET: 'e2e-secret',
    },
  },
});
