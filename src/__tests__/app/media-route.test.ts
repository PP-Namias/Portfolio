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

    vi.mocked(fetch).mockResolvedValueOnce(upstreamResponse as Response);

    const request = new NextRequest(`http://localhost:3000${gatewayUrl}`);
    const path = new URL(`http://localhost:3000${gatewayUrl}`).pathname.split('/').filter(Boolean).slice(2);

    const response = await GET(request, { params: { path } });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/jpeg');
    expect(response.headers.get('etag')).toBe('etag-value');
    expect(response.headers.get('cache-control')).toContain('max-age=');
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
  });

  it('rejects malformed asset targets', async () => {
    const request = new NextRequest('http://localhost:3000/api/media/sanity/invalid');
    const response = await GET(request, { params: { path: ['sanity', 'invalid'] } });

    expect(response.status).toBe(400);
  });
});
