import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const draftModeMock = vi.fn(() => false);

vi.mock('next/headers', () => ({
  draftMode: () => ({ isEnabled: draftModeMock() }),
}));

import { GET, OPTIONS } from '@/app/api/sanity/live/route';

describe('/api/sanity/live route', () => {
  beforeEach(() => {
    draftModeMock.mockReturnValue(false);
    delete process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS;
  });

  it('returns the content version, draft flag, and poll interval', async () => {
    const request = new NextRequest('http://localhost:3000/api/sanity/live');

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(typeof body.version).toBe('number');
    expect(body.draftMode).toBe(false);
    expect(body.pollIntervalMs).toBe(15_000);
    expect(body.revalidatePaths).toContain('/');
    expect(body.enabled).toBeUndefined();
  });

  it('honors the ?enable=1 draft-mode probe compat payload', async () => {
    draftModeMock.mockReturnValue(true);
    const request = new NextRequest('http://localhost:3000/api/sanity/live?enable=1');

    const response = await GET(request);
    const body = await response.json();

    expect(body.ok).toBe(true);
    expect(body.enabled).toBe(true);
    expect(body.draftMode).toBe(true);
    expect(typeof body.version).toBe('number');
  });

  it('reports draft mode from the request context', async () => {
    draftModeMock.mockReturnValue(true);
    const request = new NextRequest('http://localhost:3000/api/sanity/live');

    const response = await GET(request);
    const body = await response.json();

    expect(body.draftMode).toBe(true);
  });

  it('uses NEXT_PUBLIC_SANITY_LIVE_POLL_MS when set', async () => {
    process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS = '300';
    const request = new NextRequest('http://localhost:3000/api/sanity/live');

    const response = await GET(request);
    const body = await response.json();

    expect(body.pollIntervalMs).toBe(300);
  });

  it('sets CORS and no-store headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/sanity/live');

    const response = await GET(request);

    expect(response.headers.get('access-control-allow-origin')).toBe('https://namias.tech');
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(response.headers.get('cache-control')).toBe('no-cache, no-store, must-revalidate');
  });

  it('answers OPTIONS preflight', async () => {
    const response = OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-methods')).toBe('GET, OPTIONS');
  });
});