import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('next/headers', () => ({
  draftMode: vi.fn().mockResolvedValue({ isEnabled: false }),
}));

describe('GET /api/sanity/live', () => {
  it('returns ok:false without enable param', async () => {
    const { GET } = await import('@/app/api/sanity/live/route');
    const req = new NextRequest('https://namias.tech/api/sanity/live');
    const res = await GET(req);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain('enable=1');
  });

  it('returns ok:true with enable=1 param', async () => {
    const { GET } = await import('@/app/api/sanity/live/route');
    const req = new NextRequest('https://namias.tech/api/sanity/live?enable=1');
    const res = await GET(req);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.enabled).toBe(false);
    expect(body.revalidatePaths).toBeInstanceOf(Array);
  });

  it('sets CORS headers', async () => {
    const { GET } = await import('@/app/api/sanity/live/route');
    const req = new NextRequest('https://namias.tech/api/sanity/live');
    const res = await GET(req);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeDefined();
    expect(res.headers.get('Cache-Control')).toContain('no-cache');
    expect(res.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });
});

describe('OPTIONS /api/sanity/live', () => {
  it('returns 204 with CORS headers', async () => {
    const { OPTIONS } = await import('@/app/api/sanity/live/route');
    const res = OPTIONS();
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
  });
});
