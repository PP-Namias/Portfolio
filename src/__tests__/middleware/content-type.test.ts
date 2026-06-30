import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

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

function makeRequest(pathname: string, method: string, contentType: string | null) {
  const url = `https://namias.tech${pathname}`;
  const headers: Record<string, string> = {};
  if (contentType !== null) {
    headers['content-type'] = contentType;
  }
  return new NextRequest(url, { method, headers });
}

describe('middleware — content-type validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCheckBot.mockReturnValue({ blocked: false });
    mockedRateLimit.mockResolvedValue(false);
  });

  it('passes through POST with application/json', async () => {
    const req = makeRequest('/api/chat', 'POST', 'application/json');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it('passes through POST with multipart/form-data', async () => {
    const req = makeRequest('/api/media/upload', 'POST', 'multipart/form-data; boundary=abc');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it('passes through PUT with application/json', async () => {
    const req = makeRequest('/api/canary/config', 'PUT', 'application/json');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it('passes through PATCH with application/json', async () => {
    const req = makeRequest('/api/canary/config', 'PATCH', 'application/json');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it('passes through POST with text/plain (non-JSON) to API', async () => {
    const req = makeRequest('/api/csp-violation', 'POST', 'text/plain');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it('passes through POST with no content-type to API', async () => {
    const req = makeRequest('/api/chat', 'POST', null);
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it('passes through GET requests regardless of content-type', async () => {
    const req = makeRequest('/api/projects', 'GET');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it('passes through DELETE requests', async () => {
    const req = makeRequest('/api/canary/config', 'DELETE');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it('only checks content-type for API routes', async () => {
    const req = makeRequest('/blog', 'POST', 'text/plain');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });
});
