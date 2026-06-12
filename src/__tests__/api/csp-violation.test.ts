import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/csp-violation/route';

describe('/api/csp-violation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('accepts CSP violation reports', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const request = new Request('http://localhost/api/csp-violation', {
      method: 'POST',
      body: JSON.stringify({
        'csp-report': {
          'document-uri': 'http://localhost:3000',
          'violated-directive': "script-src 'self'",
          'blocked-uri': 'http://evil.com/script.js',
          'source-file': 'http://localhost:3000/page',
          'status-code': 200,
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.status).toBe('received');
    expect(response.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/csp-violation', {
      method: 'POST',
      body: 'not json',
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Invalid JSON');
  });

  it('returns 400 for missing csp-report', async () => {
    const request = new Request('http://localhost/api/csp-violation', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Missing CSP report');
  });
});
