import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cache', () => ({
  stats: vi.fn().mockResolvedValue({
    l1: { size: 5, keys: ['a', 'b', 'c', 'd', 'e'], memoryEstimateBytes: 1024 },
    l2: { size: 0, redisConnected: false },
  }),
  flush: vi.fn().mockResolvedValue(5),
}));

vi.mock('@/lib/cms-content.server', () => ({
  getCmsQueryCacheStats: vi.fn().mockReturnValue({
    hits: 10,
    misses: 2,
    entries: 3,
  }),
}));

import { flush } from '@/lib/cache';

function makeRequest(url: string) {
  return { nextUrl: new URL(url) } as any;
}

describe('/api/performance/cache', () => {
  let GET: typeof import('@/app/api/performance/cache/route').GET;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('@/app/api/performance/cache/route');
    GET = mod.GET;
  });

  it('returns cache stats on GET', async () => {
    const request = makeRequest('http://localhost/api/performance/cache');
    const response = await GET(request);
    const data = await response.json();

    expect(data.layer1.name).toBe('In-Memory');
    expect(data.layer1.size).toBe(5);
    expect(data.layer1.memoryEstimateBytes).toBe(1024);
    expect(data.layer2.redisConnected).toBe(false);
    expect(data.cmsQueryCache).toBeDefined();
    expect(data.cmsQueryCache.entries).toBe(3);
    expect(data.timestamp).toBeDefined();
  });

  it('flushes cache when flush=true', async () => {
    const request = makeRequest('http://localhost/api/performance/cache?flush=true');
    const response = await GET(request);
    const data = await response.json();

    expect(data.flushed).toBe(5);
    expect(data.status).toBe('ok');
    expect(flush).toHaveBeenCalled();
  });

  it('sets correct headers', async () => {
    const request = makeRequest('http://localhost/api/performance/cache');
    const response = await GET(request);

    expect(response.headers.get('Cache-Control')).toBe('no-cache, private');
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });
});
