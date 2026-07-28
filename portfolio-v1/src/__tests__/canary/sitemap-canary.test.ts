import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/canary/config', () => ({
  getCanaryTokenById: vi.fn().mockReturnValue({
    id: 'canary-sitemap',
    name: 'Sitemap Canary',
    type: 'file',
    path: '/sitemap-canary.xml',
  }),
}));

vi.mock('@/lib/canary/logger', () => ({
  createTrigger: vi.fn().mockReturnValue({ id: 'trigger-4', tokenId: 'canary-sitemap' }),
  logTrigger: vi.fn(),
}));

vi.mock('@/lib/canary/notify', () => ({
  sendCanaryAlert: vi.fn(),
}));

import { GET } from '@/app/sitemap-canary.xml/route';
import { getCanaryTokenById } from '@/lib/canary/config';
import { createTrigger, logTrigger } from '@/lib/canary/logger';
import { sendCanaryAlert } from '@/lib/canary/notify';

function createRequest(): NextRequest {
  const url = new URL('https://example.com/sitemap-canary.xml');
  return new NextRequest(url.toString());
}

describe('sitemap-canary route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with XML content-type', async () => {
    const response = await GET(createRequest());
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/xml');
  });

  it('contains XML declaration and urlset', async () => {
    const response = await GET(createRequest());
    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<urlset');
  });

  it('includes fake URLs to attract scanners', async () => {
    const response = await GET(createRequest());
    const body = await response.text();
    expect(body).toContain('wp-admin-canary');
    expect(body).toContain('phpmyadmin-canary');
    expect(body).toContain('/api/canary/admin');
    expect(body).toContain('/api/canary/config');
  });

  it('does not include real application URLs', async () => {
    const response = await GET(createRequest());
    const body = await response.text();
    expect(body).not.toContain('/api/chat');
    expect(body).not.toContain('/api/contact');
    expect(body).not.toContain('/api/cms');
  });

  it('sets X-Canary-Token and X-Canary-Triggered headers', async () => {
    const response = await GET(createRequest());
    expect(response.headers.get('X-Canary-Token')).toBe('canary-sitemap');
    expect(response.headers.get('X-Canary-Triggered')).toBe('true');
  });

  it('calls canary alert pipeline on access', async () => {
    await GET(createRequest());
    expect(getCanaryTokenById).toHaveBeenCalledWith('canary-sitemap');
    expect(createTrigger).toHaveBeenCalled();
    expect(logTrigger).toHaveBeenCalled();
    expect(sendCanaryAlert).toHaveBeenCalled();
  });
});
