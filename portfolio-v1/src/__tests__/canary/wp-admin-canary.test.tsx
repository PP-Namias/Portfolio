import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/canary/config', () => ({
  getCanaryTokenById: vi.fn().mockReturnValue({
    id: 'canary-wp-admin',
    name: 'WordPress Admin Canary',
    type: 'web',
    path: '/wp-admin-canary',
  }),
}));

vi.mock('@/lib/canary/logger', () => ({
  createTrigger: vi.fn().mockReturnValue({ id: 'trigger-2', tokenId: 'canary-wp-admin' }),
  logTrigger: vi.fn(),
}));

vi.mock('@/lib/canary/notify', () => ({
  sendCanaryAlert: vi.fn(),
}));

import { GET } from '@/app/wp-admin-canary/route';
import { getCanaryTokenById } from '@/lib/canary/config';
import { createTrigger, logTrigger } from '@/lib/canary/logger';
import { sendCanaryAlert } from '@/lib/canary/notify';

function createRequest(headers: Record<string, string> = {}): NextRequest {
  const url = new URL('https://example.com/wp-admin-canary');
  const h = new Headers();
  Object.entries(headers).forEach(([k, v]) => h.set(k, v));
  return new NextRequest(url.toString(), { headers: h } as RequestInit & { headers: HeadersInit });
}

describe('wp-admin canary route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with HTML content-type', async () => {
    const response = await GET(createRequest());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
  });

  it('renders WordPress login page', async () => {
    const response = await GET(createRequest());
    const html = await response.text();
    expect(html).toContain('WordPress');
    expect(html).toContain('Log In');
  });

  it('includes honeypot login form with decoy fields', async () => {
    const response = await GET(createRequest());
    const html = await response.text();
    expect(html).toContain('user_login');
    expect(html).toContain('user_pass');
    expect(html).toContain('wp-submit');
  });

  it('shows canary notice warning', async () => {
    const response = await GET(createRequest());
    const html = await response.text();
    expect(html).toContain('canary token');
    expect(html).toContain('access logged');
  });

  it('does not expose real credentials or WordPress secrets', async () => {
    const response = await GET(createRequest());
    const html = await response.text();
    expect(html).not.toContain('AUTH_KEY');
    expect(html).not.toContain('SECURE_AUTH_KEY');
    expect(html).not.toContain('DB_PASSWORD');
  });

  it('sets X-Canary-Token and X-Canary-Triggered headers', async () => {
    const response = await GET(createRequest());
    expect(response.headers.get('X-Canary-Token')).toBe('canary-wp-admin');
    expect(response.headers.get('X-Canary-Triggered')).toBe('true');
  });

  it('calls canary alert pipeline on access', async () => {
    await GET(createRequest({ 'x-forwarded-for': '5.6.7.8', 'user-agent': 'scanner' }));
    expect(getCanaryTokenById).toHaveBeenCalledWith('canary-wp-admin');
    expect(createTrigger).toHaveBeenCalled();
    expect(logTrigger).toHaveBeenCalled();
    expect(sendCanaryAlert).toHaveBeenCalled();
  });
});
