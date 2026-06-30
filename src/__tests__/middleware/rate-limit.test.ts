import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/bot-blocker', () => ({
  checkBot: vi.fn().mockReturnValue({ blocked: false }),
}));

vi.mock('@/lib/rate-limiter', () => ({
  isGlobalRateLimited: vi.fn(),
}));

import { middleware } from '@/middleware';
import { isGlobalRateLimited } from '@/lib/rate-limiter';
import { checkBot } from '@/lib/bot-blocker';

const mockedRateLimit = vi.mocked(isGlobalRateLimited);
const mockedCheckBot = vi.mocked(checkBot);

function makeApiRequest(pathname: string, headers: Record<string, string> = {}) {
  const url = `https://namias.tech${pathname}`;
  return new NextRequest(url, { method: 'GET', headers });
}

describe('middleware — rate limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCheckBot.mockReturnValue({ blocked: false });
  });

  it('returns 429 when rate limited', async () => {
    mockedRateLimit.mockResolvedValue(true);
    const req = makeApiRequest('/api/chat');
    const res = await middleware(req);

    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe('Too Many Requests');
    expect(body.statusCode).toBe(429);
  });

  it('returns Retry-After header on 429', async () => {
    mockedRateLimit.mockResolvedValue(true);
    const req = makeApiRequest('/api/chat');
    const res = await middleware(req);

    expect(res.headers.get('Retry-After')).toBe('60');
  });

  it('returns JSON content-type on 429', async () => {
    mockedRateLimit.mockResolvedValue(true);
    const req = makeApiRequest('/api/chat');
    const res = await middleware(req);

    expect(res.headers.get('Content-Type')).toBe('application/json');
  });

  it('returns no-store cache headers on 429', async () => {
    mockedRateLimit.mockResolvedValue(true);
    const req = makeApiRequest('/api/chat');
    const res = await middleware(req);

    expect(res.headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate');
  });

  it('extracts IP from x-forwarded-for', async () => {
    mockedRateLimit.mockResolvedValue(true);
    const req = makeApiRequest('/api/chat', { 'x-forwarded-for': '10.0.0.1, 10.0.0.2' });
    await middleware(req);

    expect(mockedRateLimit).toHaveBeenCalledWith('10.0.0.1');
  });

  it('extracts IP from x-real-ip when x-forwarded-for missing', async () => {
    mockedRateLimit.mockResolvedValue(true);
    const req = makeApiRequest('/api/chat', { 'x-real-ip': '192.168.1.1' });
    await middleware(req);

    expect(mockedRateLimit).toHaveBeenCalledWith('192.168.1.1');
  });

  it('falls back to 127.0.0.1 when no IP headers', async () => {
    mockedRateLimit.mockResolvedValue(true);
    const req = makeApiRequest('/api/chat');
    await middleware(req);

    expect(mockedRateLimit).toHaveBeenCalledWith('127.0.0.1');
  });

  it('does not rate limit non-API routes', async () => {
    mockedRateLimit.mockResolvedValue(true);
    const req = makeApiRequest('/blog');
    const res = await middleware(req);

    expect(mockedRateLimit).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
  });
});
