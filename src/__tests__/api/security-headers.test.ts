import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/security-headers/route';

const mockHeaders = new Headers();
mockHeaders.set('Content-Security-Policy', "script-src 'self'");
mockHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
mockHeaders.set('X-Content-Type-Options', 'nosniff');
mockHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

describe('security-headers API route', () => {
  it('returns JSON with score and headers', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { headers: mockHeaders }));
    const response = await GET();
    const body = await response.json();
    expect(body.url).toBeDefined();
    expect(body.score).toBeDefined();
    expect(body.headers).toBeInstanceOf(Array);
    expect(body.headers.length).toBe(7);
  });

  it('returns 502 on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network fail'));
    const response = await GET();
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error).toBe('Network fail');
  });

  it('marks missing headers as missing', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { headers: new Headers() }));
    const response = await GET();
    const body = await response.json();
    expect(body.counts.missing).toBe(7);
  });

  it('flags CSP with unsafe-inline', async () => {
    const h = new Headers();
    h.set('Content-Security-Policy', "script-src 'self' 'unsafe-inline'");
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { headers: h }));
    const response = await GET();
    const body = await response.json();
    const csp = body.headers.find((hdr: { name: string }) => hdr.name === 'Content-Security-Policy');
    expect(csp.status).toBe('needs-improvement');
  });

  it('flags HSTS without preload', async () => {
    const h = new Headers();
    h.set('Strict-Transport-Security', 'max-age=31536000');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { headers: h }));
    const response = await GET();
    const body = await response.json();
    const hsts = body.headers.find((hdr: { name: string }) => hdr.name === 'Strict-Transport-Security');
    expect(hsts.status).toBe('needs-improvement');
  });
});
