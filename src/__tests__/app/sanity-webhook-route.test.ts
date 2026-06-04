import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock } = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: revalidatePathMock,
}));

import { OPTIONS, POST } from '@/app/api/sanity/webhook/route';

describe('/api/sanity/webhook route', () => {
  beforeEach(() => {
    revalidatePathMock.mockClear();
    process.env.SANITY_REVALIDATE_SECRET = 'unit-test-secret';
  });

  it('allows preflight requests for the studio action', async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('cache-control')).toBe('no-store, max-age=0');
  });

  it('rejects requests with an invalid secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/sanity/webhook?secret=wrong', {
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it('revalidates CMS routes when the secret is valid', async () => {
    const request = new NextRequest('http://localhost:3000/api/sanity/webhook?secret=unit-test-secret', {
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store, max-age=0');
    expect(revalidatePathMock).toHaveBeenCalledWith('/', 'page');
    expect(revalidatePathMock).toHaveBeenCalledWith('/sitemap.xml', 'page');
    expect(revalidatePathMock).not.toHaveBeenCalledWith('/blog', 'page');
    expect(revalidatePathMock).not.toHaveBeenCalledWith('/blog/[slug]', 'page');
  });
});
