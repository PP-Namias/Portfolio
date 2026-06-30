import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

vi.mock('@/lib/bot-blocker', () => ({
  checkBot: vi.fn(),
}));

vi.mock('@/lib/rate-limiter', () => ({
  isGlobalRateLimited: vi.fn().mockResolvedValue(false),
}));

import { middleware } from '@/middleware';
import { checkBot } from '@/lib/bot-blocker';

const mockedCheckBot = vi.mocked(checkBot);

function makeRequest(pathname: string, headers: Record<string, string> = {}) {
  const url = `https://namias.tech${pathname}`;
  return new NextRequest(url, { headers });
}

describe('middleware — bot blocking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 418 when bot is detected by UA', async () => {
    mockedCheckBot.mockReturnValue({ blocked: true, reason: 'blocked-ua:curl', statusCode: 418 });
    const req = makeRequest('/', { 'user-agent': 'curl/7.68.0' });
    const res = await middleware(req);

    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(418);
    const body = await res.json();
    expect(body.error).toBe("I'm a teapot");
    expect(body.statusCode).toBe(418);
  });

  it('returns X-Blocked-Reason header', async () => {
    mockedCheckBot.mockReturnValue({ blocked: true, reason: 'blocked-ua:nmap', statusCode: 418 });
    const req = makeRequest('/', { 'user-agent': 'Nmap/7.80' });
    const res = await middleware(req);

    expect(res.headers.get('X-Blocked-Reason')).toBe('blocked-ua:nmap');
  });

  it('returns unknown when reason is missing', async () => {
    mockedCheckBot.mockReturnValue({ blocked: true, statusCode: 418 });
    const req = makeRequest('/');
    const res = await middleware(req);

    expect(res.headers.get('X-Blocked-Reason')).toBe('unknown');
  });

  it('blocks attack paths', async () => {
    mockedCheckBot.mockReturnValue({ blocked: true, reason: 'blocked-path:/wp-admin', statusCode: 418 });
    const req = makeRequest('/wp-admin');
    const res = await middleware(req);

    expect(res.status).toBe(418);
  });

  it('returns no-store cache headers on block', async () => {
    mockedCheckBot.mockReturnValue({ blocked: true, reason: 'test', statusCode: 418 });
    const req = makeRequest('/');
    const res = await middleware(req);

    expect(res.headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate');
  });

  it('returns JSON content-type on block', async () => {
    mockedCheckBot.mockReturnValue({ blocked: true, reason: 'test', statusCode: 418 });
    const req = makeRequest('/');
    const res = await middleware(req);

    expect(res.headers.get('Content-Type')).toBe('application/json');
  });
});
