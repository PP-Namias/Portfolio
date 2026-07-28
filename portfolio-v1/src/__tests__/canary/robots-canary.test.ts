import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/canary/config', () => ({
  getCanaryTokenById: vi.fn().mockReturnValue({
    id: 'canary-robots',
    name: 'Robots Canary',
    type: 'file',
    path: '/robots-canary.txt',
  }),
}));

vi.mock('@/lib/canary/logger', () => ({
  createTrigger: vi.fn().mockReturnValue({ id: 'trigger-3', tokenId: 'canary-robots' }),
  logTrigger: vi.fn(),
}));

vi.mock('@/lib/canary/notify', () => ({
  sendCanaryAlert: vi.fn(),
}));

import { GET } from '@/app/robots-canary.txt/route';
import { getCanaryTokenById } from '@/lib/canary/config';
import { createTrigger, logTrigger } from '@/lib/canary/logger';
import { sendCanaryAlert } from '@/lib/canary/notify';

function createRequest(): NextRequest {
  const url = new URL('https://example.com/robots-canary.txt');
  return new NextRequest(url.toString());
}

describe('robots-canary route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with text/plain content-type', async () => {
    const response = await GET(createRequest());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');
  });

  it('contains User-agent directives', async () => {
    const response = await GET(createRequest());
    const body = await response.text();
    expect(body).toContain('User-agent:');
    expect(body).toContain('Disallow:');
  });

  it('includes fake disallowed canary paths to attract scanners', async () => {
    const response = await GET(createRequest());
    const body = await response.text();
    expect(body).toContain('/wp-admin-canary/');
    expect(body).toContain('/phpmyadmin-canary/');
    expect(body).toContain('/.env-canary');
    expect(body).toContain('/robots-canary.txt');
    expect(body).toContain('/sitemap-canary.xml');
  });

  it('does not block legitimate crawlers Googlebot and Bingbot', async () => {
    const response = await GET(createRequest());
    const body = await response.text();
    expect(body).toContain('Googlebot');
    expect(body).toContain('Allow: /');
    expect(body).toContain('Bingbot');
  });

  it('includes link to real sitemap', async () => {
    const response = await GET(createRequest());
    const body = await response.text();
    expect(body).toContain('Sitemap:');
    expect(body).toContain('sitemap.xml');
  });

  it('sets X-Canary-Token and X-Canary-Triggered headers', async () => {
    const response = await GET(createRequest());
    expect(response.headers.get('X-Canary-Token')).toBe('canary-robots');
    expect(response.headers.get('X-Canary-Triggered')).toBe('true');
  });

  it('calls canary alert pipeline on access', async () => {
    await GET(createRequest());
    expect(getCanaryTokenById).toHaveBeenCalledWith('canary-robots');
    expect(createTrigger).toHaveBeenCalled();
    expect(logTrigger).toHaveBeenCalled();
    expect(sendCanaryAlert).toHaveBeenCalled();
  });
});
