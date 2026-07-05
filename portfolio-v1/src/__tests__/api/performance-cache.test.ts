import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/admin', () => ({
  isAdminRequest: vi.fn(() => true),
}));

vi.mock('@/lib/cache', () => ({
  stats: vi.fn(async () => ({
    l1: { size: 5, keys: ['a', 'b', 'c', 'd', 'e'], memoryEstimateBytes: 1024 },
    l2: { size: 0, redisConnected: false },
  })),
  flush: vi.fn(async () => ({ flushed: true })),
}));

vi.mock('@/lib/cms-content.server', () => ({
  getCmsQueryCacheStats: vi.fn(() => ({ hits: 10, misses: 2 })),
}));

function createNextRequest(url: string, headers?: Record<string, string>): import('next/server').NextRequest {
  const req = new Request(url, { headers });
  const nextUrl = new URL(url);
  return Object.assign(req, { nextUrl }) as import('next/server').NextRequest;
}

describe('performance cache API route', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns cache stats for admin', async () => {
    const { GET } = await import('@/app/api/performance/cache/route');
    const request = createNextRequest('http://localhost/api/performance/cache', { 'x-api-key': 'test' });
    const response = await GET(request);
    const body = await response.json();
    expect(body.layer1).toBeDefined();
    expect(body.layer1.size).toBe(5);
    expect(body.layer2).toBeDefined();
    expect(body.cmsQueryCache).toBeDefined();
  });

  it('returns 401 for non-admin', async () => {
    const { isAdminRequest } = await import('@/lib/admin');
    (isAdminRequest as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(false);
    const { GET } = await import('@/app/api/performance/cache/route');
    const request = createNextRequest('http://localhost/api/performance/cache');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('flushes cache when flush=true', async () => {
    const { GET } = await import('@/app/api/performance/cache/route');
    const request = createNextRequest('http://localhost/api/performance/cache?flush=true', { 'x-api-key': 'test' });
    const response = await GET(request);
    const body = await response.json();
    expect(body.flushed).toBeDefined();
  });

  it('sets no-cache headers', async () => {
    const { GET } = await import('@/app/api/performance/cache/route');
    const request = createNextRequest('http://localhost/api/performance/cache', { 'x-api-key': 'test' });
    const response = await GET(request);
    expect(response.headers.get('Cache-Control')).toContain('no-cache');
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });
});
