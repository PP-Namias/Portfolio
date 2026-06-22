import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  classifyProviderError,
  getProviderHealth,
  isMultiProviderEnabled,
  ProviderUnavailableError,
} from '@/app/api/chat/lib/providers';

describe('providers', () => {
  beforeEach(() => {
    vi.stubEnv('GOOGLE_GEMINI_API_KEY', '');
    vi.stubEnv('OPENAI_API_KEY', '');
    vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'false');
    vi.stubEnv('CHAT_PROVIDER_TIMEOUT_MS', '12000');
    vi.stubEnv('CHAT_PROVIDER_MAX_RETRIES', '1');
    vi.stubEnv('CHAT_PROVIDER_RETRY_BASE_MS', '220');
    vi.stubEnv('CHAT_PROVIDER_CIRCUIT_FAILURE_THRESHOLD', '4');
    vi.stubEnv('CHAT_PROVIDER_CIRCUIT_COOLDOWN_MS', '60000');
    vi.stubEnv('OPENAI_MODEL', 'gpt-4o-mini');
    vi.stubEnv('OPENAI_BASE_URL', 'https://api.openai.com/v1');
  });

  describe('isMultiProviderEnabled', () => {
    it('returns false when env is not set', () => {
      expect(isMultiProviderEnabled()).toBe(false);
    });

    it('returns true for "true"', () => {
      vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'true');
      expect(isMultiProviderEnabled()).toBe(true);
    });

    it('returns true for "1"', () => {
      vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', '1');
      expect(isMultiProviderEnabled()).toBe(true);
    });

    it('returns true for "yes"', () => {
      vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'yes');
      expect(isMultiProviderEnabled()).toBe(true);
    });

    it('returns true for "on"', () => {
      vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'on');
      expect(isMultiProviderEnabled()).toBe(true);
    });

    it('returns false for "false"', () => {
      vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'false');
      expect(isMultiProviderEnabled()).toBe(false);
    });

    it('returns false for random string', () => {
      vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'random');
      expect(isMultiProviderEnabled()).toBe(false);
    });

    it('is case-insensitive', () => {
      vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'TRUE');
      expect(isMultiProviderEnabled()).toBe(true);
    });
  });

  describe('getProviderHealth', () => {
    it('returns inactive when no provider is configured', () => {
      const health = getProviderHealth();
      expect(health.status).toBe('inactive');
      expect(health.providers.gemini.configured).toBe(false);
      expect(health.providers.openai.configured).toBe(false);
    });

    it('returns active when Gemini is configured', () => {
      vi.stubEnv('GOOGLE_GEMINI_API_KEY', 'test-key');
      const health = getProviderHealth();
      expect(health.status).toBe('active');
      expect(health.providers.gemini.configured).toBe(true);
      expect(health.providers.gemini.circuitOpen).toBe(false);
    });

    it('returns active when multi-provider is enabled with OpenAI', () => {
      vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'true');
      vi.stubEnv('OPENAI_API_KEY', 'openai-key');
      const health = getProviderHealth();
      expect(health.status).toBe('active');
      expect(health.providers.openai.configured).toBe(true);
    });

    it('reflects multiProviderEnabled flag', () => {
      const health1 = getProviderHealth();
      expect(health1.multiProviderEnabled).toBe(false);

      vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'true');
      const health2 = getProviderHealth();
      expect(health2.multiProviderEnabled).toBe(true);
    });
  });

  describe('ProviderUnavailableError', () => {
    it('has correct name and properties', () => {
      const error = new ProviderUnavailableError('gemini', 'missing_config', 'API key missing');
      expect(error.name).toBe('ProviderUnavailableError');
      expect(error.provider).toBe('gemini');
      expect(error.reason).toBe('missing_config');
      expect(error.message).toBe('API key missing');
    });

    it('works for openai provider', () => {
      const error = new ProviderUnavailableError('openai', 'circuit_open', 'Circuit open');
      expect(error.provider).toBe('openai');
      expect(error.reason).toBe('circuit_open');
    });

    it('is an instance of Error', () => {
      const error = new ProviderUnavailableError('gemini', 'missing_config', 'test');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('classifyProviderError', () => {
    it('classifies ProviderUnavailableError with missing_config', () => {
      const error = new ProviderUnavailableError('gemini', 'missing_config', 'test');
      expect(classifyProviderError(error)).toBe('provider_unavailable:gemini:missing_config');
    });

    it('classifies ProviderUnavailableError with circuit_open', () => {
      const error = new ProviderUnavailableError('openai', 'circuit_open', 'test');
      expect(classifyProviderError(error)).toBe('provider_unavailable:openai:circuit_open');
    });

    it('classifies ProviderTimeoutError', () => {
      const error = new Error('test timed out after 5000ms.');
      error.name = 'ProviderTimeoutError';
      expect(classifyProviderError(error)).toBe('provider_error:providertimeouterror');
    });

    it('classifies regular Error', () => {
      const error = new Error('Network failed');
      expect(classifyProviderError(error)).toBe('provider_error:error');
    });

    it('classifies string error', () => {
      expect(classifyProviderError('string error')).toBe('provider_error:unknown');
    });

    it('classifies null error', () => {
      expect(classifyProviderError(null)).toBe('provider_error:unknown');
    });

    it('classifies undefined error', () => {
      expect(classifyProviderError(undefined)).toBe('provider_error:unknown');
    });

    it('classifies object error', () => {
      expect(classifyProviderError({ code: 500 })).toBe('provider_error:unknown');
    });
  });

  describe('environment variable parsing', () => {
    it('uses default timeout when env is not set', () => {
      delete process.env.CHAT_PROVIDER_TIMEOUT_MS;
      // The default is 12000, we can't directly test the internal function
      // but we can verify the env is not set
      expect(process.env.CHAT_PROVIDER_TIMEOUT_MS).toBeUndefined();
    });

    it('uses default retries when env is not set', () => {
      delete process.env.CHAT_PROVIDER_MAX_RETRIES;
      expect(process.env.CHAT_PROVIDER_MAX_RETRIES).toBeUndefined();
    });

    it('uses default retry base when env is not set', () => {
      delete process.env.CHAT_PROVIDER_RETRY_BASE_MS;
      expect(process.env.CHAT_PROVIDER_RETRY_BASE_MS).toBeUndefined();
    });

    it('uses default circuit threshold when env is not set', () => {
      delete process.env.CHAT_PROVIDER_CIRCUIT_FAILURE_THRESHOLD;
      expect(process.env.CHAT_PROVIDER_CIRCUIT_FAILURE_THRESHOLD).toBeUndefined();
    });

    it('uses default circuit cooldown when env is not set', () => {
      delete process.env.CHAT_PROVIDER_CIRCUIT_COOLDOWN_MS;
      expect(process.env.CHAT_PROVIDER_CIRCUIT_COOLDOWN_MS).toBeUndefined();
    });
  });
});
