import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/security-headers/route';

describe('/api/security-headers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns security header analysis', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(null, {
      status: 200,
      headers: {
        'Content-Security-Policy': "script-src 'self'",
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=()',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    }));

    const response = await GET();
    const data = await response.json();

    expect(data.score).toBe(100);
    expect(data.counts.present).toBe(7);
    expect(data.counts.missing).toBe(0);
    expect(data.headers).toHaveLength(7);
  });

  it('detects missing headers', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(null, {
      status: 200,
      headers: {},
    }));

    const response = await GET();
    const data = await response.json();

    expect(data.score).toBe(0);
    expect(data.counts.missing).toBe(7);
  });

  it('detects needs-improvement headers', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(null, {
      status: 200,
      headers: {
        'Content-Security-Policy': "script-src 'unsafe-inline'",
        'X-Content-Type-Options': 'nosniff',
      },
    }));

    const response = await GET();
    const data = await response.json();

    expect(data.counts.needsImprovement).toBeGreaterThan(0);
  });

  it('returns 502 on fetch failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('network error'));

    const response = await GET();
    expect(response.status).toBe(502);

    const data = await response.json();
    expect(data.error).toBe('network error');
  });
});
