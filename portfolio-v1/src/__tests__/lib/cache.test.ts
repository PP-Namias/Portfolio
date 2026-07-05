import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/redis-cache', () => ({
  redisGet: vi.fn().mockResolvedValue(null),
  redisSet: vi.fn().mockResolvedValue(undefined),
  redisInvalidateByTag: vi.fn().mockResolvedValue(0),
  redisFlush: vi.fn().mockResolvedValue(0),
  redisStats: vi.fn().mockResolvedValue({ size: 0, redisConnected: false }),
}));

import * as cache from '@/lib/cache';
import { redisGet, redisSet, redisInvalidateByTag, redisFlush } from '@/lib/redis-cache';

describe('cache', () => {
  beforeEach(() => {
    cache.flush();
    vi.clearAllMocks();
  });

  describe('keyFor', () => {
    it('joins parts with colon prefix', () => {
      expect(cache.keyFor('cms', 'hero')).toBe('cache:cms:hero');
    });

    it('handles single part', () => {
      expect(cache.keyFor('single')).toBe('cache:single');
    });

    it('handles multiple parts', () => {
      expect(cache.keyFor('a', 'b', 'c')).toBe('cache:a:b:c');
    });
  });

  describe('set / get', () => {
    it('stores and retrieves data', () => {
      const key = cache.keyFor('test', '1');
      cache.set(key, { hello: 'world' }, { skipRedis: true });
      const result = cache.get(key);
      expect(result).toEqual({ data: { hello: 'world' }, stale: false });
    });

    it('returns null for missing key', () => {
      expect(cache.get(cache.keyFor('missing'))).toBeNull();
    });

    it('calls redisSet by default', () => {
      const key = cache.keyFor('redis', 'test');
      cache.set(key, 'value');
      expect(redisSet).toHaveBeenCalled();
    });

    it('skips redisSet when skipRedis=true', () => {
      const key = cache.keyFor('no', 'redis');
      cache.set(key, 'value', { skipRedis: true });
      expect(redisSet).not.toHaveBeenCalled();
    });
  });

  describe('getOrFetch', () => {
    it('returns cached data on second call', async () => {
      const key = cache.keyFor('fetch', 'test');
      const fetcher = vi.fn().mockResolvedValue('fetched');
      const result1 = await cache.getOrFetch(key, fetcher, { skipRedis: true });
      expect(result1).toEqual({ data: 'fetched', stale: false });
      expect(fetcher).toHaveBeenCalledTimes(1);

      const result2 = await cache.getOrFetch(key, fetcher, { skipRedis: true });
      expect(result2).toEqual({ data: 'fetched', stale: false });
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('calls fetcher on cache miss', async () => {
      const key = cache.keyFor('miss', 'test');
      const fetcher = vi.fn().mockResolvedValue('new data');
      const result = await cache.getOrFetch(key, fetcher, { skipRedis: true });
      expect(result).toEqual({ data: 'new data', stale: false });
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('falls back to fetcher when redis fails', async () => {
      vi.mocked(redisGet).mockRejectedValueOnce(new Error('redis down'));
      const key = cache.keyFor('redis', 'fail');
      const fetcher = vi.fn().mockResolvedValue('from fetcher');
      const result = await cache.getOrFetch(key, fetcher);
      expect(result).toEqual({ data: 'from fetcher', stale: false });
    });
  });

  describe('invalidateByTag', () => {
    it('removes entries with matching tag', async () => {
      const key1 = cache.keyFor('tag1');
      const key2 = cache.keyFor('tag2');
      cache.set(key1, 'a', { tags: ['cms:hero'], skipRedis: true });
      cache.set(key2, 'b', { tags: ['cms:about'], skipRedis: true });

      const count = await cache.invalidateByTag('cms:hero');
      expect(count).toBe(1);
      expect(cache.get(key1)).toBeNull();
      expect(cache.get(key2)).not.toBeNull();
    });

    it('returns 0 when no matches', async () => {
      const key = cache.keyFor('no', 'match');
      cache.set(key, 'data', { tags: ['other'], skipRedis: true });
      const count = await cache.invalidateByTag('nonexistent');
      expect(count).toBe(0);
    });
  });

  describe('invalidateByPrefix', () => {
    it('removes entries matching prefix', () => {
      const key1 = cache.keyFor('prefix', 'a');
      const key2 = cache.keyFor('prefix', 'b');
      const key3 = cache.keyFor('other', 'c');
      cache.set(key1, '1', { skipRedis: true });
      cache.set(key2, '2', { skipRedis: true });
      cache.set(key3, '3', { skipRedis: true });

      const count = cache.invalidateByPrefix('cache:prefix');
      expect(count).toBe(2);
      expect(cache.get(key1)).toBeNull();
      expect(cache.get(key2)).toBeNull();
      expect(cache.get(key3)).not.toBeNull();
    });
  });

  describe('flush', () => {
    it('clears all entries', async () => {
      cache.set(cache.keyFor('a'), '1', { skipRedis: true });
      cache.set(cache.keyFor('b'), '2', { skipRedis: true });
      const count = await cache.flush();
      expect(count).toBe(2);
      expect(cache.get(cache.keyFor('a'))).toBeNull();
    });
  });

  describe('stats', () => {
    it('returns l1 and l2 stats', async () => {
      cache.set(cache.keyFor('x'), 'data', { skipRedis: true });
      const s = await cache.stats();
      expect(s.l1.size).toBe(1);
      expect(s.l1.keys).toContain('cache:x');
      expect(s.l1.memoryEstimateBytes).toBeGreaterThan(0);
      expect(s.l2).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('returns expired entry as null and removes it', async () => {
      const key = cache.keyFor('expire');
      cache.set(key, 'data', { ttlMs: 1, skipRedis: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(cache.get(key)).toBeNull();
    });

    it('returns stale entry with stale=true', async () => {
      const key = cache.keyFor('stale');
      cache.set(key, 'data', { ttlMs: 100, staleMs: 1, skipRedis: true });
      await new Promise((r) => setTimeout(r, 10));
      const result = cache.get(key);
      expect(result).not.toBeNull();
      expect(result!.stale).toBe(true);
    });

    it('getOrFetch returns stale data and triggers background refresh', async () => {
      const key = cache.keyFor('stale-refresh');
      const fetcher1 = vi.fn().mockResolvedValue('v1');
      await cache.getOrFetch(key, fetcher1, { ttlMs: 100, staleMs: 1, skipRedis: true });
      await new Promise((r) => setTimeout(r, 10));

      const fetcher2 = vi.fn().mockResolvedValue('v2');
      const result = await cache.getOrFetch(key, fetcher2, { ttlMs: 100, staleMs: 1, skipRedis: true });
      expect(result.data).toBe('v1');
      expect(result.stale).toBe(true);
    });

    it('keyFor produces deterministic output', () => {
      expect(cache.keyFor('a', 'b')).toBe(cache.keyFor('a', 'b'));
    });

    it('set with custom ttlMs and staleMs', () => {
      const key = cache.keyFor('custom');
      cache.set(key, 'value', { ttlMs: 1000, staleMs: 500, skipRedis: true });
      const result = cache.get(key);
      expect(result).toEqual({ data: 'value', stale: false });
    });

    it('stats returns empty when store is empty', async () => {
      await cache.flush();
      const s = await cache.stats();
      expect(s.l1.size).toBe(0);
      expect(s.l1.keys).toEqual([]);
    });

    it('invalidateByTag counts both local and redis deletions', async () => {
      vi.mocked(redisInvalidateByTag).mockResolvedValueOnce(3);
      const key = cache.keyFor('ri-tag');
      cache.set(key, 'v', { tags: ['ri:tag'], skipRedis: true });
      const count = await cache.invalidateByTag('ri:tag');
      expect(count).toBe(4);
    });

    it('flush counts both local and redis deletions', async () => {
      vi.mocked(redisFlush).mockResolvedValueOnce(5);
      cache.set(cache.keyFor('f1'), 'a', { skipRedis: true });
      const count = await cache.flush();
      expect(count).toBe(6);
    });
  });
});
