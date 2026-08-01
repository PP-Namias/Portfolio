import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Hono } from 'hono';

import { rateLimit } from '../../src/lib/rate-limit';

function buildApp(options: { max: number; windowMs: number }) {
  const app = new Hono();
  app.use('*', rateLimit(options));
  app.get('/', (c) => c.text('ok'));
  return app;
}

describe('rate-limit', () => {
  beforeEach(() => {
    delete process.env.AI_SERVICE_TRUST_PROXY;
  });

  afterEach(() => {
    delete process.env.AI_SERVICE_TRUST_PROXY;
  });

  it('allows requests under the limit and blocks over it', async () => {
    const app = buildApp({ max: 2, windowMs: 60_000 });
    expect((await app.request('/')).status).toBe(200);
    expect((await app.request('/')).status).toBe(200);
    expect((await app.request('/')).status).toBe(429);
  });

  it('ignores x-forwarded-for spoofing by default (single shared bucket)', async () => {
    const app = buildApp({ max: 1, windowMs: 60_000 });
    expect((await app.request('/', { headers: { 'x-forwarded-for': '1.1.1.1' } })).status).toBe(200);
    expect((await app.request('/', { headers: { 'x-forwarded-for': '2.2.2.2' } })).status).toBe(429);
  });

  it('splits buckets by forwarded IP when the proxy is trusted', async () => {
    process.env.AI_SERVICE_TRUST_PROXY = '1';
    const app = buildApp({ max: 1, windowMs: 60_000 });
    expect((await app.request('/', { headers: { 'x-forwarded-for': '1.1.1.1' } })).status).toBe(200);
    expect((await app.request('/', { headers: { 'x-forwarded-for': '2.2.2.2' } })).status).toBe(200);
    expect((await app.request('/', { headers: { 'x-forwarded-for': '1.1.1.1' } })).status).toBe(429);
  });

  it('releases the bucket after the window expires', async () => {
    const app = buildApp({ max: 1, windowMs: 50 });
    expect((await app.request('/')).status).toBe(200);
    expect((await app.request('/')).status).toBe(429);
    await new Promise((resolve) => setTimeout(resolve, 70));
    expect((await app.request('/')).status).toBe(200);
  });
});
