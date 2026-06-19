import { describe, it, expect, beforeEach } from 'vitest';
import {
  CANARY_CONFIG,
  CANARY_TOKENS,
  getCanaryTokenById,
  getCanaryTokenByPath,
  getActiveCanaryTokens,
  getCanaryTokensByType,
} from '@/lib/canary/config';
import {
  logTrigger,
  getTriggerLog,
  getTriggerLogByTokenId,
  getTriggerLogByIp,
  getRecentTriggers,
  getTriggerStats,
  clearTriggerLog,
  createTrigger,
} from '@/lib/canary/logger';
import { buildEmailAlert } from '@/lib/canary/notify';

describe('Canary Token System', () => {
  beforeEach(() => {
    clearTriggerLog();
  });

  describe('CANARY_CONFIG', () => {
    it('has correct email configuration', () => {
      expect(CANARY_CONFIG.notifyEmail).toBe('jkrbn99@gmail.com');
    });

    it('is enabled', () => {
      expect(CANARY_CONFIG.enabled).toBe(true);
    });

    it('has rate limiting configured', () => {
      expect(CANARY_CONFIG.rateLimitWindowMs).toBe(60000);
      expect(CANARY_CONFIG.rateLimitMaxRequests).toBe(10);
    });
  });

  describe('CANARY_TOKENS', () => {
    it('has 10 canary tokens', () => {
      expect(CANARY_TOKENS.length).toBe(10);
    });

    it('all tokens are active', () => {
      CANARY_TOKENS.forEach((token) => {
        expect(token.status).toBe('active');
      });
    });

    it('all tokens have unique IDs', () => {
      const ids = CANARY_TOKENS.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all tokens have unique paths', () => {
      const paths = CANARY_TOKENS.map((t) => t.path);
      expect(new Set(paths).size).toBe(paths.length);
    });
  });

  describe('getCanaryTokenById', () => {
    it('finds token by ID', () => {
      const token = getCanaryTokenById('canary-admin');
      expect(token).toBeDefined();
      expect(token?.name).toBe('Fake Admin Panel');
    });

    it('returns undefined for non-existent ID', () => {
      const token = getCanaryTokenById('non-existent');
      expect(token).toBeUndefined();
    });
  });

  describe('getCanaryTokenByPath', () => {
    it('finds token by path', () => {
      const token = getCanaryTokenByPath('/api/canary/admin');
      expect(token).toBeDefined();
      expect(token?.id).toBe('canary-admin');
    });

    it('returns undefined for non-existent path', () => {
      const token = getCanaryTokenByPath('/non-existent');
      expect(token).toBeUndefined();
    });
  });

  describe('getActiveCanaryTokens', () => {
    it('returns only active tokens', () => {
      const activeTokens = getActiveCanaryTokens();
      expect(activeTokens.length).toBe(CANARY_TOKENS.length);
      activeTokens.forEach((token) => {
        expect(token.status).toBe('active');
      });
    });
  });

  describe('getCanaryTokensByType', () => {
    it('filters tokens by type', () => {
      const webTokens = getCanaryTokensByType('web');
      expect(webTokens.length).toBeGreaterThan(0);
      webTokens.forEach((token) => {
        expect(token.type).toBe('web');
      });
    });

    it('returns empty array for non-existent type', () => {
      const tokens = getCanaryTokensByType('non-existent' as any);
      expect(tokens.length).toBe(0);
    });
  });

  describe('createTrigger', () => {
    it('creates a trigger with correct fields', () => {
      const trigger = createTrigger(
        'test-token',
        'Test Token',
        'web',
        '/test',
        {
          ip: '127.0.0.1',
          userAgent: 'TestAgent/1.0',
          referer: 'http://test.com',
          method: 'GET',
        }
      );

      expect(trigger.tokenId).toBe('test-token');
      expect(trigger.tokenName).toBe('Test Token');
      expect(trigger.tokenType).toBe('web');
      expect(trigger.tokenPath).toBe('/test');
      expect(trigger.ip).toBe('127.0.0.1');
      expect(trigger.userAgent).toBe('TestAgent/1.0');
      expect(trigger.referer).toBe('http://test.com');
      expect(trigger.method).toBe('GET');
      expect(trigger.id).toMatch(/^trigger-/);
      expect(trigger.timestamp).toBeDefined();
    });
  });

  describe('logTrigger', () => {
    it('logs a trigger', () => {
      const trigger = createTrigger('test-token', 'Test Token', 'web', '/test', {
        ip: '127.0.0.1',
        userAgent: 'TestAgent/1.0',
        referer: '',
        method: 'GET',
      });

      logTrigger(trigger);

      const logs = getTriggerLog();
      expect(logs.length).toBe(1);
      expect(logs[0].tokenId).toBe('test-token');
    });

    it('updates token trigger count', () => {
      const trigger = createTrigger('canary-admin', 'Fake Admin Panel', 'web', '/api/canary/admin', {
        ip: '127.0.0.1',
        userAgent: 'TestAgent/1.0',
        referer: '',
        method: 'GET',
      });

      logTrigger(trigger);

      const token = getCanaryTokenById('canary-admin');
      expect(token?.triggerCount).toBe(1);
      expect(token?.lastTriggerIp).toBe('127.0.0.1');
    });
  });

  describe('getTriggerLogByTokenId', () => {
    it('filters triggers by token ID', () => {
      const trigger1 = createTrigger('token-1', 'Token 1', 'web', '/path1', {
        ip: '127.0.0.1',
        userAgent: 'Test',
        referer: '',
        method: 'GET',
      });
      const trigger2 = createTrigger('token-2', 'Token 2', 'web', '/path2', {
        ip: '127.0.0.1',
        userAgent: 'Test',
        referer: '',
        method: 'GET',
      });

      logTrigger(trigger1);
      logTrigger(trigger2);

      const filtered = getTriggerLogByTokenId('token-1');
      expect(filtered.length).toBe(1);
      expect(filtered[0].tokenId).toBe('token-1');
    });
  });

  describe('getTriggerLogByIp', () => {
    it('filters triggers by IP', () => {
      const trigger1 = createTrigger('token-1', 'Token 1', 'web', '/path1', {
        ip: '192.168.1.1',
        userAgent: 'Test',
        referer: '',
        method: 'GET',
      });
      const trigger2 = createTrigger('token-2', 'Token 2', 'web', '/path2', {
        ip: '192.168.1.2',
        userAgent: 'Test',
        referer: '',
        method: 'GET',
      });

      logTrigger(trigger1);
      logTrigger(trigger2);

      const filtered = getTriggerLogByIp('192.168.1.1');
      expect(filtered.length).toBe(1);
      expect(filtered[0].ip).toBe('192.168.1.1');
    });
  });

  describe('getRecentTriggers', () => {
    it('returns triggers from last N minutes', () => {
      const trigger = createTrigger('token-1', 'Token 1', 'web', '/path1', {
        ip: '127.0.0.1',
        userAgent: 'Test',
        referer: '',
        method: 'GET',
      });

      logTrigger(trigger);

      const recent = getRecentTriggers(60);
      expect(recent.length).toBe(1);
    });

    it('excludes old triggers', () => {
      const trigger = createTrigger('token-1', 'Token 1', 'web', '/path1', {
        ip: '127.0.0.1',
        userAgent: 'Test',
        referer: '',
        method: 'GET',
      });

      trigger.timestamp = new Date(Date.now() - 120 * 60 * 1000).toISOString();

      logTrigger(trigger);

      const recent = getRecentTriggers(60);
      expect(recent.length).toBe(0);
    });
  });

  describe('getTriggerStats', () => {
    it('returns correct stats', () => {
      const trigger1 = createTrigger('token-1', 'Token 1', 'web', '/path1', {
        ip: '192.168.1.1',
        userAgent: 'Test',
        referer: '',
        method: 'GET',
      });
      const trigger2 = createTrigger('token-1', 'Token 1', 'web', '/path1', {
        ip: '192.168.1.1',
        userAgent: 'Test',
        referer: '',
        method: 'GET',
      });
      const trigger3 = createTrigger('token-2', 'Token 2', 'dns', '/path2', {
        ip: '192.168.1.2',
        userAgent: 'Test',
        referer: '',
        method: 'GET',
      });

      logTrigger(trigger1);
      logTrigger(trigger2);
      logTrigger(trigger3);

      const stats = getTriggerStats();
      expect(stats.total).toBe(3);
      expect(stats.byType['web']).toBe(2);
      expect(stats.byType['dns']).toBe(1);
      expect(stats.byIp['192.168.1.1']).toBe(2);
      expect(stats.byIp['192.168.1.2']).toBe(1);
    });
  });

  describe('buildEmailAlert', () => {
    it('builds email alert with correct fields', () => {
      const trigger = createTrigger('token-1', 'Test Token', 'web', '/test', {
        ip: '127.0.0.1',
        userAgent: 'TestAgent/1.0',
        referer: 'http://test.com',
        method: 'GET',
      });

      const alert = buildEmailAlert(trigger);

      expect(alert.to).toBe('jkrbn99@gmail.com');
      expect(alert.subject).toContain('Test Token');
      expect(alert.html).toContain('Test Token');
      expect(alert.html).toContain('127.0.0.1');
      expect(alert.html).toContain('TestAgent/1.0');
      expect(alert.html).toContain('http://test.com');
    });
  });
});
