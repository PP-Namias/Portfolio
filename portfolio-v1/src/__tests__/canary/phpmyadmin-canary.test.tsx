import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/canary/config', () => ({
  getCanaryTokenById: vi.fn().mockReturnValue({
    id: 'canary-phpmyadmin',
    name: 'phpMyAdmin Canary',
    type: 'web',
    path: '/phpmyadmin-canary',
  }),
}));

vi.mock('@/lib/canary/logger', () => ({
  createTrigger: vi.fn().mockReturnValue({ id: 'trigger-1', tokenId: 'canary-phpmyadmin' }),
  logTrigger: vi.fn(),
}));

vi.mock('@/lib/canary/notify', () => ({
  sendCanaryAlert: vi.fn(),
}));

import { GET } from '@/app/phpmyadmin-canary/route';
import { getCanaryTokenById } from '@/lib/canary/config';
import { createTrigger, logTrigger } from '@/lib/canary/logger';
import { sendCanaryAlert } from '@/lib/canary/notify';

function createRequest(headers: Record<string, string> = {}): NextRequest {
  const url = new URL('https://example.com/phpmyadmin-canary');
  const h = new Headers();
  Object.entries(headers).forEach(([k, v]) => h.set(k, v));
  return new NextRequest(url.toString(), { headers: h } as RequestInit & { headers: HeadersInit });
}

describe('phpmyadmin canary route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with HTML content-type', async () => {
    const response = await GET(createRequest());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
  });

  it('renders phpMyAdmin title', async () => {
    const response = await GET(createRequest());
    const html = await response.text();
    expect(html).toContain('phpMyAdmin');
    expect(html).toContain('Welcome to phpMyAdmin');
  });

  it('includes honeypot login form with decoy fields', async () => {
    const response = await GET(createRequest());
    const html = await response.text();
    expect(html).toContain('pma_username');
    expect(html).toContain('pma_password');
    expect(html).toContain('type="checkbox"');
  });

  it('shows canary notice warning', async () => {
    const response = await GET(createRequest());
    const html = await response.text();
    expect(html).toContain('canary token');
    expect(html).toContain('access logged');
  });

  it('does not expose real credentials or server paths', async () => {
    const response = await GET(createRequest());
    const html = await response.text();
    expect(html).not.toMatch(/password\s*=\s*['"]?\w+/i);
    expect(html).not.toContain('SANITY_API');
    expect(html).not.toContain('NEXT_PUBLIC');
    expect(html).not.toContain('DATABASE_URL');
  });

  it('sets X-Canary-Token and X-Canary-Triggered headers', async () => {
    const response = await GET(createRequest());
    expect(response.headers.get('X-Canary-Token')).toBe('canary-phpmyadmin');
    expect(response.headers.get('X-Canary-Triggered')).toBe('true');
  });

  it('calls canary alert pipeline on access', async () => {
    await GET(createRequest({ 'x-forwarded-for': '1.2.3.4', 'user-agent': 'test-bot' }));
    expect(getCanaryTokenById).toHaveBeenCalledWith('canary-phpmyadmin');
    expect(createTrigger).toHaveBeenCalled();
    expect(logTrigger).toHaveBeenCalled();
    expect(sendCanaryAlert).toHaveBeenCalled();
  });
});
