import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/csp-violation/route';

describe('/api/csp-violation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 for invalid JSON', async () => {
    const request = new Request('http://localhost/api/csp-violation', {
      method: 'POST',
      body: 'not json',
    });

    const response = await POST(request as any);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Invalid CSP report');
  });
});
