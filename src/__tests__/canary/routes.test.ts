import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/canary/config', () => ({
  getCanaryTokenById: vi.fn().mockReturnValue({
    id: 'canary-wp-admin',
    name: 'WP Admin Canary',
    type: 'path',
    path: '/wp-admin-canary',
  }),
}));

vi.mock('@/lib/canary/logger', () => ({
  createTrigger: vi.fn().mockReturnValue({ id: 'trigger-1' }),
  logTrigger: vi.fn(),
}));

vi.mock('@/lib/canary/notify', () => ({
  sendCanaryAlert: vi.fn().mockResolvedValue(undefined),
}));

function makeRequest(pathname: string, headers: Record<string, string> = {}) {
  const url = `https://namias.tech${pathname}`;
  return new NextRequest(url, { headers });
}

describe('canary routes', () => {
  describe('/wp-admin-canary', () => {
    it('returns 200 with HTML decoy', async () => {
      const { GET } = await import('@/app/wp-admin-canary/route');
      const res = await GET(makeRequest('/wp-admin-canary'));
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('WordPress');
      expect(html).toContain('canary token');
    });

    it('returns X-Canary-Token header', async () => {
      const { GET } = await import('@/app/wp-admin-canary/route');
      const res = await GET(makeRequest('/wp-admin-canary'));
      expect(res.headers.get('X-Canary-Token')).toBe('canary-wp-admin');
      expect(res.headers.get('X-Canary-Triggered')).toBe('true');
    });

    it('extracts IP from x-forwarded-for', async () => {
      const { createTrigger } = await import('@/lib/canary/logger');
      const { GET } = await import('@/app/wp-admin-canary/route');
      await GET(makeRequest('/wp-admin-canary', { 'x-forwarded-for': '10.0.0.1' }));
      expect(createTrigger).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ ip: '10.0.0.1' }),
      );
    });
  });

  describe('/phpmyadmin-canary', () => {
    it('returns 200 with HTML decoy', async () => {
      const { GET } = await import('@/app/phpmyadmin-canary/route');
      const res = await GET(makeRequest('/phpmyadmin-canary'));
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('phpMyAdmin');
      expect(html).toContain('canary token');
    });

    it('returns X-Canary-Token header', async () => {
      const { GET } = await import('@/app/phpmyadmin-canary/route');
      const res = await GET(makeRequest('/phpmyadmin-canary'));
      expect(res.headers.get('X-Canary-Token')).toBe('canary-phpmyadmin');
      expect(res.headers.get('X-Canary-Triggered')).toBe('true');
    });
  });

  describe('/robots-canary.txt', () => {
    it('returns 200 with robots text', async () => {
      const { GET } = await import('@/app/robots-canary.txt/route');
      const res = await GET(makeRequest('/robots-canary.txt'));
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('User-agent: *');
      expect(text).toContain('Disallow:');
    });

    it('returns text/plain content-type', async () => {
      const { GET } = await import('@/app/robots-canary.txt/route');
      const res = await GET(makeRequest('/robots-canary.txt'));
      expect(res.headers.get('Content-Type')).toContain('text/plain');
    });

    it('returns X-Canary-Token header', async () => {
      const { GET } = await import('@/app/robots-canary.txt/route');
      const res = await GET(makeRequest('/robots-canary.txt'));
      expect(res.headers.get('X-Canary-Token')).toBe('canary-robots');
    });
  });

  describe('/sitemap-canary.xml', () => {
    it('returns 200 with XML sitemap', async () => {
      const { GET } = await import('@/app/sitemap-canary.xml/route');
      const res = await GET(makeRequest('/sitemap-canary.xml'));
      expect(res.status).toBe(200);
      const xml = await res.text();
      expect(xml).toContain('<?xml');
      expect(xml).toContain('<urlset');
    });

    it('returns application/xml content-type', async () => {
      const { GET } = await import('@/app/sitemap-canary.xml/route');
      const res = await GET(makeRequest('/sitemap-canary.xml'));
      expect(res.headers.get('Content-Type')).toContain('application/xml');
    });

    it('returns X-Canary-Token header', async () => {
      const { GET } = await import('@/app/sitemap-canary.xml/route');
      const res = await GET(makeRequest('/sitemap-canary.xml'));
      expect(res.headers.get('X-Canary-Token')).toBe('canary-sitemap');
    });
  });

  describe('IP fallback', () => {
    it('falls back to unknown when no x-forwarded-for', async () => {
      const { createTrigger } = await import('@/lib/canary/logger');
      const { GET } = await import('@/app/wp-admin-canary/route');
      await GET(makeRequest('/wp-admin-canary'));
      expect(createTrigger).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ ip: 'unknown' }),
      );
    });
  });
});
