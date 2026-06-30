import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/canary/config', () => ({
  getCanaryTokenById: vi.fn().mockReturnValue(null),
  CANARY_TOKENS: [
    { id: 'canary-config', name: 'Config', type: 'api', path: '/api/canary/config', status: 'active', triggerCount: 0 },
    { id: 'canary-stats', name: 'Stats', type: 'api', path: '/api/canary/stats', status: 'active', triggerCount: 0 },
  ],
}));

vi.mock('@/lib/canary/logger', () => ({
  createTrigger: vi.fn().mockReturnValue({ id: 'trigger-1' }),
  logTrigger: vi.fn(),
  getTriggerLog: vi.fn().mockReturnValue([]),
  getTriggerStats: vi.fn().mockReturnValue({ total: 0, recentCount: 0 }),
}));

vi.mock('@/lib/canary/notify', () => ({
  sendCanaryAlert: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/admin', () => ({
  isAdminRequest: vi.fn().mockReturnValue(true),
}));

function makeRequest(pathname: string, headers: Record<string, string> = {}) {
  return new NextRequest(`https://namias.tech${pathname}`, { headers });
}

describe('canary API routes', () => {
  describe('GET /api/canary/config', () => {
    it('returns fake config with 200', async () => {
      const { GET } = await import('@/app/api/canary/config/route');
      const res = await GET(makeRequest('/api/canary/config'));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.config).toBeDefined();
      expect(body.config.database).toBeDefined();
      expect(body.config.redis).toBeDefined();
      expect(body.config.api).toBeDefined();
      expect(body.config.aws).toBeDefined();
      expect(body.timestamp).toBeDefined();
    });

    it('returns fake database credentials', async () => {
      const { GET } = await import('@/app/api/canary/config/route');
      const res = await GET(makeRequest('/api/canary/config'));
      const body = await res.json();
      expect(body.config.database.host).toBe('db-canary-internal');
      expect(body.config.database.user).toBe('canary_admin');
    });
  });

  describe('GET /api/canary/stats', () => {
    it('returns stats when admin', async () => {
      const { GET } = await import('@/app/api/canary/stats/route');
      const res = await GET(makeRequest('/api/canary/stats'));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.summary).toBeDefined();
      expect(body.tokens).toBeInstanceOf(Array);
      expect(body.recentTriggers).toBeInstanceOf(Array);
    });

    it('returns 401 when not admin', async () => {
      const { isAdminRequest } = await import('@/lib/admin');
      vi.mocked(isAdminRequest).mockReturnValue(false);
      const { GET } = await import('@/app/api/canary/stats/route');
      const res = await GET(makeRequest('/api/canary/stats'));
      expect(res.status).toBe(401);
    });
  });
});
