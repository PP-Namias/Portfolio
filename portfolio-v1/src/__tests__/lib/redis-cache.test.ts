import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@upstash/redis', () => {
  const store = new Map<string, unknown>();
  return {
    Redis: vi.fn().mockImplementation(() => ({
      get: vi.fn(async (key: string) => store.get(key) ?? null),
      set: vi.fn(async (key: string, value: unknown) => { store.set(key, value); }),
      del: vi.fn(async (key: string) => { store.delete(key); }),
      keys: vi.fn(async (pattern: string) => {
        const prefix = pattern.replace('*', '');
        return [...store.keys()].filter((k) => k.startsWith(prefix));
      }),
      smembers: vi.fn(async (key: string) => {
        const val = store.get(key);
        return Array.isArray(val) ? val : [];
      }),
      pipeline: vi.fn(() => ({
        get: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        del: vi.fn().mockReturnThis(),
        exec: vi.fn(async () => []),
      })),
    })),
  };
});

import { redisGet, redisSet, redisInvalidateByTag, redisFlush, redisStats } from '@/lib/redis-cache';

describe('redis-cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redisGet returns null when no connection', async () => {
    const result = await redisGet('nonexistent-key');
    expect(result).toBeNull();
  });

  it('redisSet returns early when no connection', async () => {
    await expect(redisSet('key', 'value')).resolves.toBeUndefined();
  });

  it('redisInvalidateByTag returns 0 when no connection', async () => {
    const count = await redisInvalidateByTag('nonexistent-tag');
    expect(count).toBe(0);
  });

  it('redisFlush returns 0 when no connection', async () => {
    const count = await redisFlush();
    expect(count).toBe(0);
  });

  it('redisStats returns disconnected state', async () => {
    const stats = await redisStats();
    expect(stats).toHaveProperty('size');
    expect(stats).toHaveProperty('redisConnected');
  });
});
