import { beforeAll, describe, expect, it } from 'vitest';

import { buildApp } from '../../src/server/app';

beforeAll(() => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  process.env.GOOGLE_GEMINI_API_KEY = 'test-key';
  process.env.AI_SERVICE_THREADS_FILE = '.ai-service-data/test-threads-no-secret.json';
  delete process.env.REINDEX_SECRET;
  delete process.env.AI_SERVICE_REINDEX_SECRET;
});

describe('admin guard without secret configured', () => {
  it('returns 503 when no reindex secret is configured', async () => {
    const res = await buildApp().request('/api/admin/reindex', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-reindex-secret': 'anything' },
      body: JSON.stringify({ mode: 'incremental' }),
    });
    expect(res.status).toBe(503);
    const body = (await res.json()) as { error: string };
    expect(body.error).toContain('not configured');
  });
});
