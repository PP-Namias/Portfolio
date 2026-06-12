import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/performance/cache/route';

vi.mock('@/lib/cache', () => ({
  stats: vi.fn().mockResolvedValue({
    l1: { size: 5, keys: ['a', 'b', 'c', 'd', 'e'], memoryEstimateBytes: 1024 },
    l2: { size: 0, redisConnected: false },
  }),
  flush: vi.fn().mockResolvedValue(5),
}));

vi.mock('@/lib/cms-content.server', () => ({
  getCmsQueryCacheStats: vi.fn().mockReturnValue({
    size: 3,
    keys: ['cms:hero', 'cms:about', 'cms:projects'],
  }),
}));

import { stats, flush } from '@/lib/cache';

describe('/api/performance/cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cache stats on GET', async () => {
    const request = new Request('http://localhost/api/performance/cache');
    const response = await GET(request as any);
    const data = await response.json();

    expect(data.layer1.name).toBe('In-Memory');
    expect(data.layer1.size).toBe(5);
    expect(data.layer1.memoryEstimateBytes).toBe(1024);
    expect(data.layer2.redisConnected).toBe(false);
    expect(data.cmsQueryCache.size).toBe(3);
    expect(data.timestamp).toBeDefined();
  });

  it('flushes cache when flush=true', async () => {
    const request = new Request('http://localhost/api/performance/cache?flush=true');
    const response = await GET(request as any);
    const data = await response.json();

    expect(data.flushed).toBe(5);
    expect(data.status).toBe('ok');
    expect(flush).toHaveBeenCalled();
  });

  it('sets correct headers', async () => {
    const request = new Request('http://localhost/api/performance/cache');
    const response = await GET(request as any);

    expect(response.headers.get('Cache-Control')).toBe('no-cache, private');
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });
});
