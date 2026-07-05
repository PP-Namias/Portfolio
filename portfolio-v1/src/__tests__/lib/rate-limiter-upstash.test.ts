import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('rate-limiter Upstash path', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fake-upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token');
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  async function loadRateLimiter() {
    const mod = await import('@/lib/rate-limiter');
    return mod;
  }

  it('uses Upstash when env vars are set and fetch succeeds', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return { ok: true, json: async () => ({ result: 1 }) };
      }
      return { ok: true, json: async () => ({ result: 'OK' }) };
    }) as unknown as typeof fetch;

    const { isGlobalRateLimited } = await loadRateLimiter();
    const result = await isGlobalRateLimited('upstash-ip-1');

    expect(result).toBe(false);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('returns true when count exceeds limit via Upstash', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return { ok: true, json: async () => ({ result: 31 }) };
      }
      return { ok: true, json: async () => ({ result: 'OK' }) };
    }) as unknown as typeof fetch;

    const { isGlobalRateLimited } = await loadRateLimiter();
    const result = await isGlobalRateLimited('upstash-exceed');

    expect(result).toBe(true);
  });

  it('falls back to in-memory when Upstash fetch throws', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error')) as unknown as typeof fetch;

    const { isGlobalRateLimited } = await loadRateLimiter();
    const result = await isGlobalRateLimited('upstash-fail');

    expect(result).toBe(false);
  });

  it('falls back to in-memory when Upstash returns error response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    }) as unknown as typeof fetch;

    const { isGlobalRateLimited } = await loadRateLimiter();
    const result = await isGlobalRateLimited('upstash-500');

    expect(result).toBe(false);
  });

  it('falls back to in-memory when Upstash returns payload with error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ error: 'WRONGTYPE' }),
    }) as unknown as typeof fetch;

    const { isGlobalRateLimited } = await loadRateLimiter();
    const result = await isGlobalRateLimited('upstash-payload-error');

    expect(result).toBe(false);
  });

  it('sends correct Authorization header', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: 1 }),
    }) as unknown as typeof fetch;

    const { isGlobalRateLimited } = await loadRateLimiter();
    await isGlobalRateLimited('upstash-header');

    const [, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer fake-token');
    expect(options.cache).toBe('no-store');
  });

  it('sends INCR command to Upstash', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: 1 }),
    }) as unknown as typeof fetch;

    const { isGlobalRateLimited } = await loadRateLimiter();
    await isGlobalRateLimited('upstash-incr');

    const [, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body[0]).toBe('INCR');
    expect(body[1]).toBe('rl:upstash-incr');
  });

  it('sends EXPIRE command on first request (count=1)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: 1 }),
    }) as unknown as typeof fetch;

    const { isGlobalRateLimited } = await loadRateLimiter();
    await isGlobalRateLimited('upstash-expire');

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);

    const secondCall = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[1];
    const body = JSON.parse(secondCall[1].body);
    expect(body[0]).toBe('EXPIRE');
    expect(body[2]).toBeGreaterThanOrEqual(60);
  });
});
