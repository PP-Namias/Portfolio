import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildMediaGatewayUrl } from '@/lib/media-gateway';

import { GET } from '@/app/api/media/[...path]/route';

describe('/api/media route', () => {
  beforeEach(() => {
    process.env.SANITY_MEDIA_GATEWAY_SECRET = 'unit-test-media-secret';
    vi.stubGlobal('fetch', vi.fn());
  });

  it('proxies a sanity asset through the gateway and preserves cache headers', async () => {
    const targetUrl = 'https://cdn.sanity.io/images/project/production/image-800x600.jpg';
    const gatewayUrl = buildMediaGatewayUrl(targetUrl, { width: 320, quality: 70, sign: true });
    const upstreamResponse = new Response('binary-image-data', {
      status: 200,
      headers: {
        'content-type': 'image/jpeg',
        etag: 'etag-value',
      },
    });

    vi.mocked(fetch).mockResolvedValueOnce(upstreamResponse);

    const request = new NextRequest(`http://localhost:3000${gatewayUrl}`);
    const path = new URL(`http://localhost:3000${gatewayUrl}`).pathname.split('/').filter(Boolean).slice(2);

    const response = await GET(request, { params: Promise.resolve({ path }) as Promise<{ path?: string[] }> });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/jpeg');
    expect(response.headers.get('etag')).toBe('etag-value');
    expect(response.headers.get('cache-control')).toContain('max-age=');
    expect(response.headers.get('x-media-asset-kind')).toBe('image');
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
  });

  it('rejects malformed asset targets', async () => {
    const request = new NextRequest('http://localhost:3000/api/media/sanity/invalid');
    const response = await GET(request, { params: Promise.resolve({ path: ['sanity', 'invalid'] }) as Promise<{ path?: string[] }> });

    expect(response.status).toBe(400);
  });

  it('rejects crafted unsupported Sanity asset targets', async () => {
    const malformedTarget = 'https://cdn.sanity.io/other/project/production/image-800x600.jpg';
    const encoded = Buffer.from(malformedTarget, 'utf8').toString('base64url');
    const request = new NextRequest(`http://localhost:3000/api/media/sanity/${encoded}`);

    const response = await GET(request, { params: Promise.resolve({ path: ['sanity', encoded] }) as Promise<{ path?: string[] }> });

    expect(response.status).toBe(400);
  });

  it('treats file assets as immutable cacheable responses', async () => {
    process.env.SANITY_MEDIA_GATEWAY_SECRET = 'unit-test-media-secret';
    const targetUrl = 'https://cdn.sanity.io/files/project/production/resume.pdf';
    const gatewayUrl = buildMediaGatewayUrl(targetUrl, { sign: true });
    const upstreamResponse = new Response('binary-pdf-data', {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
      },
    });

    vi.mocked(fetch).mockResolvedValueOnce(upstreamResponse);

    const request = new NextRequest(`http://localhost:3000${gatewayUrl}`);
    const path = new URL(`http://localhost:3000${gatewayUrl}`).pathname.split('/').filter(Boolean).slice(2);

    const response = await GET(request, { params: Promise.resolve({ path }) as Promise<{ path?: string[] }> });

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('max-age=');
    expect(response.headers.get('x-media-asset-kind')).toBe('file');
  });

  it('rejects expired signatures with 401 instead of unsigned fallback', async () => {
    process.env.SANITY_MEDIA_GATEWAY_SECRET = 'unit-test-media-secret';
    const targetUrl = 'https://cdn.sanity.io/images/project/production/image-800x600.jpg';
    const encoded = Buffer.from(targetUrl, 'utf8').toString('base64url');
    const farPast = Math.floor(Date.now() / 1000) - 7200;

    const requestUrl = `http://localhost:3000/api/media/sanity/${encoded}?w=320&q=85&exp=${farPast}&sig=expired-sig`;
    const request = new NextRequest(requestUrl);
    const path = ['sanity', encoded];

    const response = await GET(request, { params: Promise.resolve({ path }) as Promise<{ path?: string[] }> });

    expect(fetch).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });
});
