import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CanaryTrigger } from '@/lib/canary/types';
import { buildEmailAlert } from '@/lib/canary/notify';

vi.mock('@/lib/canary/config', () => ({
  CANARY_CONFIG: {
    notifyEmail: 'test@test.com',
    enabled: true,
    rateLimitWindowMs: 60000,
    rateLimitMaxRequests: 10,
    logTriggers: true,
    sendEmailAlerts: true,
  },
}));

const makeTrigger = (overrides?: Partial<CanaryTrigger>): CanaryTrigger => ({
  id: 'trigger-1',
  tokenId: 'token-1',
  tokenName: 'Test Token',
  tokenType: 'web',
  tokenPath: '/wp-admin',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0',
  referer: 'https://google.com',
  method: 'GET',
  timestamp: '2026-01-15T12:00:00Z',
  country: 'US',
  city: 'New York',
  isp: 'Comcast',
  ...overrides,
});

describe('canary notify', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  describe('buildEmailAlert', () => {
    it('returns correct structure', () => {
      const trigger = makeTrigger();
      const alert = buildEmailAlert(trigger);
      expect(alert.to).toBeDefined();
      expect(alert.subject).toContain('Test Token');
      expect(alert.html).toContain('<!DOCTYPE html>');
    });

    it('escapes HTML in token name', () => {
      const trigger = makeTrigger({ tokenName: '<script>alert("xss")</script>' });
      const alert = buildEmailAlert(trigger);
      expect(alert.html).not.toContain('<script>');
      expect(alert.html).toContain('&lt;script&gt;');
    });

    it('escapes HTML in IP', () => {
      const trigger = makeTrigger({ ip: '127.0.0.1"><img>' });
      const alert = buildEmailAlert(trigger);
      expect(alert.html).not.toContain('<img>');
    });

    it('includes geolocation when present', () => {
      const trigger = makeTrigger({ country: 'Japan', city: 'Tokyo', isp: 'NTT' });
      const alert = buildEmailAlert(trigger);
      expect(alert.html).toContain('Japan');
      expect(alert.html).toContain('Tokyo');
      expect(alert.html).toContain('NTT');
    });

    it('omits geolocation sections when absent', () => {
      const trigger = makeTrigger({ country: undefined, city: undefined, isp: undefined });
      const alert = buildEmailAlert(trigger);
      expect(alert.html).not.toContain('Geolocation');
    });

    it('handles missing referer and userAgent', () => {
      const trigger = makeTrigger({ referer: '', userAgent: '' });
      const alert = buildEmailAlert(trigger);
      expect(alert.html).toContain('Direct access');
      expect(alert.html).toContain('Not provided');
    });
  });

  describe('sendCanaryAlert', () => {
    it('returns true when alerts enabled', async () => {
      const { sendCanaryAlert } = await import('@/lib/canary/notify');
      const result = await sendCanaryAlert(makeTrigger());
      expect(result).toBe(true);
    });
  });

  describe('sendTestAlert', () => {
    it('returns a boolean', async () => {
      const { sendTestAlert } = await import('@/lib/canary/notify');
      const result = await sendTestAlert();
      expect(typeof result).toBe('boolean');
    });
  });
});
