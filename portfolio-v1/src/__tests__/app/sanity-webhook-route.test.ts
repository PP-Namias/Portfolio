import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock } = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: revalidatePathMock,
}));

import { OPTIONS, POST } from '@/app/api/sanity/webhook/route';
import { getContentVersion } from '@/lib/content-version';

describe('/api/sanity/webhook route', () => {
  beforeEach(() => {
    revalidatePathMock.mockClear();
    process.env.SANITY_REVALIDATE_SECRET = 'unit-test-secret';
  });

  it('allows preflight requests for the studio action', async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('https://namias.tech');
    expect(response.headers.get('cache-control')).toBe('no-store, max-age=0');
  });

  it('rejects requests with an invalid secret', async () => {
    const before = await getContentVersion();
    const request = new NextRequest('http://localhost:3000/api/sanity/webhook', {
      method: 'POST',
      headers: { 'x-sanity-webhook-secret': 'wrong' },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(revalidatePathMock).not.toHaveBeenCalled();
    expect(await getContentVersion()).toBe(before);
  });

  it('revalidates CMS routes when the secret is valid', async () => {
    const before = await getContentVersion();
    const request = new NextRequest('http://localhost:3000/api/sanity/webhook', {
      method: 'POST',
      headers: { 'x-sanity-webhook-secret': 'unit-test-secret' },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store, max-age=0');
    expect(revalidatePathMock).toHaveBeenCalledWith('/', 'page');
    expect(revalidatePathMock).toHaveBeenCalledWith('/blog', 'page');
    expect(revalidatePathMock).toHaveBeenCalledWith('/blog/[slug]', 'page');
    expect(revalidatePathMock).toHaveBeenCalledWith('/projects/[slug]', 'page');
    expect(revalidatePathMock).toHaveBeenCalledWith('/sitemap.xml', 'page');
    expect(await getContentVersion()).toBe(before + 1);
  });

  it('bumps the version and revalidates for a typed body', async () => {
    const before = await getContentVersion();
    const request = new NextRequest('http://localhost:3000/api/sanity/webhook', {
      method: 'POST',
      headers: { 'x-sanity-webhook-secret': 'unit-test-secret', 'content-type': 'application/json' },
      body: JSON.stringify({ _type: 'post', _id: 'post-1', operation: 'create' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(revalidatePathMock).toHaveBeenCalledWith('/', 'page');
    expect(await getContentVersion()).toBe(before + 1);
  });

  it('still revalidates and bumps the version when the body is empty', async () => {
    const before = await getContentVersion();
    const request = new NextRequest('http://localhost:3000/api/sanity/webhook', {
      method: 'POST',
      headers: { 'x-sanity-webhook-secret': 'unit-test-secret', 'content-type': 'application/json' },
      body: '',
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(revalidatePathMock).toHaveBeenCalledWith('/', 'page');
    expect(await getContentVersion()).toBe(before + 1);
  });
});
