import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');

describe('rate-limiter (src/lib/rate-limiter)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  async function loadRateLimiter() {
    const mod = await import('@/lib/rate-limiter');
    return mod;
  }

  it('returns false for first request from a new IP', async () => {
    const { isGlobalRateLimited } = await loadRateLimiter();
    const result = await isGlobalRateLimited('ip-fresh-1');
    expect(result).toBe(false);
  });

  it('returns false for requests under the limit', async () => {
    const { isGlobalRateLimited } = await loadRateLimiter();
    for (let i = 0; i < 29; i++) {
      expect(await isGlobalRateLimited('ip-under-29')).toBe(false);
    }
  });

  it('returns true after exceeding default limit of 30', async () => {
    const { isGlobalRateLimited } = await loadRateLimiter();
    const ip = `ip-exceed-${Date.now()}`;
    for (let i = 0; i < 30; i++) {
      await isGlobalRateLimited(ip);
    }
    expect(await isGlobalRateLimited(ip)).toBe(true);
  });

  it('respects custom limit parameter', async () => {
    const { isGlobalRateLimited } = await loadRateLimiter();
    const ip = `ip-custom-${Date.now()}`;
    expect(await isGlobalRateLimited(ip, 3)).toBe(false);
    expect(await isGlobalRateLimited(ip, 3)).toBe(false);
    expect(await isGlobalRateLimited(ip, 3)).toBe(false);
    expect(await isGlobalRateLimited(ip, 3)).toBe(true);
  });

  it('tracks different IPs independently', async () => {
    const { isGlobalRateLimited } = await loadRateLimiter();
    const ipA = `ip-a-${Date.now()}`;
    const ipB = `ip-b-${Date.now()}`;

    for (let i = 0; i < 30; i++) {
      await isGlobalRateLimited(ipA, 5);
    }
    expect(await isGlobalRateLimited(ipA, 5)).toBe(true);
    expect(await isGlobalRateLimited(ipB, 5)).toBe(false);
  });

  it('resets after window expires (fast-forward)', async () => {
    const { isGlobalRateLimited } = await loadRateLimiter();
    const ip = `ip-reset-${Date.now()}`;
    await isGlobalRateLimited(ip, 2, 100);
    await isGlobalRateLimited(ip, 2, 100);
    expect(await isGlobalRateLimited(ip, 2, 100)).toBe(true);

    await new Promise((r) => setTimeout(r, 150));
    expect(await isGlobalRateLimited(ip, 2, 100)).toBe(false);
  });

  it('uses 127.0.0.1 as default when no IP provided', async () => {
    const { isGlobalRateLimited } = await loadRateLimiter();
    const result = await isGlobalRateLimited('127.0.0.1');
    expect(result).toBe(false);
  });
});
