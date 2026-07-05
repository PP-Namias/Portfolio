import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

vi.mock('@/lib/bot-blocker', () => ({
  checkBot: vi.fn().mockReturnValue({ blocked: false }),
}));

vi.mock('@/lib/rate-limiter', () => ({
  isGlobalRateLimited: vi.fn().mockResolvedValue(false),
}));

import { middleware } from '@/middleware';
import { checkBot } from '@/lib/bot-blocker';
import { isGlobalRateLimited } from '@/lib/rate-limiter';

const mockedCheckBot = vi.mocked(checkBot);
const mockedRateLimit = vi.mocked(isGlobalRateLimited);

function makeRequest(pathname: string, method = 'GET', headers: Record<string, string> = {}) {
  const url = `https://namias.tech${pathname}`;
  return new NextRequest(url, { method, headers });
}

describe('middleware — pass-through', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCheckBot.mockReturnValue({ blocked: false });
    mockedRateLimit.mockResolvedValue(false);
  });

  it('passes through when no bot and not rate limited', async () => {
    const req = makeRequest('/');
    const res = await middleware(req);

    expect(res.status).toBe(200);
  });

  it('passes through GET requests to API when not rate limited', async () => {
    const req = makeRequest('/api/chat');
    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(mockedRateLimit).toHaveBeenCalled();
  });

  it('passes through POST with application/json content-type', async () => {
    const req = makeRequest('/api/chat', 'POST', { 'content-type': 'application/json' });
    const res = await middleware(req);

    expect(res.status).toBe(200);
  });

  it('passes through POST with multipart/form-data content-type', async () => {
    const req = makeRequest('/api/media/upload', 'POST', {
      'content-type': 'multipart/form-data; boundary=abc',
    });
    const res = await middleware(req);

    expect(res.status).toBe(200);
  });

  it('passes through PUT with application/json content-type', async () => {
    const req = makeRequest('/api/canary/config', 'PUT', { 'content-type': 'application/json' });
    const res = await middleware(req);

    expect(res.status).toBe(200);
  });

  it('passes through PATCH with application/json content-type', async () => {
    const req = makeRequest('/api/canary/config', 'PATCH', { 'content-type': 'application/json' });
    const res = await middleware(req);

    expect(res.status).toBe(200);
  });

  it('passes through when bot check is not triggered (legitimate UA)', async () => {
    mockedCheckBot.mockReturnValue({ blocked: false });
    const req = makeRequest('/projects', 'GET', {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    });
    const res = await middleware(req);

    expect(res.status).toBe(200);
    expect(mockedCheckBot).toHaveBeenCalled();
  });
});
