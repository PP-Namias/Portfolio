import { describe, it, expect, vi, beforeEach } from 'vitest';

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalEnv };
});

describe('site-config', () => {
  function getFreshConfig() {
    vi.resetModules();
    return import('@/lib/site-config');
  }

  it('SITE_URL falls back to default when env var is not set', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const config = await getFreshConfig();
    expect(config.SITE_URL).toBe('https://namias.tech');
  });

  it('SITE_URL uses env var when set', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://custom.example.com';
    const config = await getFreshConfig();
    expect(config.SITE_URL).toBe('https://custom.example.com');
  });

  it('SITE_NAME is the expected string', async () => {
    const config = await getFreshConfig();
    expect(config.SITE_NAME).toBe('Jhon Keneth Ryan Namias — Portfolio');
  });

  it('SITE_DESCRIPTION contains expected keywords', async () => {
    const config = await getFreshConfig();
    expect(config.SITE_DESCRIPTION).toContain('Full Stack Engineer');
    expect(config.SITE_DESCRIPTION).toContain('Philippines');
  });

  it('SANITY_PROJECT_ID uses env var when set', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'custom-proj';
    const config = await getFreshConfig();
    expect(config.SANITY_PROJECT_ID).toBe('custom-proj');
  });

  it('SANITY_PROJECT_ID falls back to default when not set', async () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const config = await getFreshConfig();
    expect(config.SANITY_PROJECT_ID).toBe('nl0qw78w');
  });

  it('SANITY_DATASET uses env var when set', async () => {
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'staging';
    const config = await getFreshConfig();
    expect(config.SANITY_DATASET).toBe('staging');
  });

  it('SANITY_DATASET falls back to production when not set', async () => {
    delete process.env.NEXT_PUBLIC_SANITY_DATASET;
    const config = await getFreshConfig();
    expect(config.SANITY_DATASET).toBe('production');
  });

  it('all exports are strings', async () => {
    const config = await getFreshConfig();
    const stringExports: string[] = [
      config.SITE_URL,
      config.SITE_NAME,
      config.SITE_DESCRIPTION,
      config.SANITY_PROJECT_ID,
      config.SANITY_DATASET,
    ];
    stringExports.forEach((val) => {
      expect(typeof val).toBe('string');
    });
  });
});
