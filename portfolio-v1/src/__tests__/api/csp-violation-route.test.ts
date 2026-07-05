import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

describe('POST /api/csp-violation', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns 200 with valid CSP report', async () => {
    const { POST } = await import('@/app/api/csp-violation/route');
    const body = {
      'csp-report': {
        'blocked-uri': 'https://evil.com/script.js',
        'violated-directive': "script-src 'self'",
        'effective-directive': 'script-src',
        'original-policy': "script-src 'self'",
        'source-file': 'https://namias.tech/page',
        'line-number': 10,
        'column-number': 5,
      },
    };
    const req = new NextRequest('https://namias.tech/api/csp-violation', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });

  it('returns 400 with invalid JSON', async () => {
    const { POST } = await import('@/app/api/csp-violation/route');
    const req = new NextRequest('https://namias.tech/api/csp-violation', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Invalid');
  });

  it('handles report without csp-report wrapper', async () => {
    const { POST } = await import('@/app/api/csp-violation/route');
    const body = {
      'blocked-uri': 'https://evil.com/script.js',
      'violated-directive': "script-src 'self'",
    };
    const req = new NextRequest('https://namias.tech/api/csp-violation', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
