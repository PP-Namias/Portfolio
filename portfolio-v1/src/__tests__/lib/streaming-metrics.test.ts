import { describe, it, expect } from 'vitest';
import { createServerTimingHeader, parseServerTimingHeader } from '@/lib/streaming-metrics';

describe('streaming-metrics', () => {
  describe('createServerTimingHeader', () => {
    it('creates a header string from metrics object', () => {
      const result = createServerTimingHeader({ hero: 120, about: 45 });
      expect(result).toContain('hero;dur=120');
      expect(result).toContain('about;dur=45');
    });

    it('handles empty object', () => {
      expect(createServerTimingHeader({})).toBe('');
    });

    it('rounds duration values', () => {
      const result = createServerTimingHeader({ test: 45.7 });
      expect(result).toBe('test;dur=46');
    });

    it('handles single metric', () => {
      expect(createServerTimingHeader({ single: 100 })).toBe('single;dur=100');
    });
  });

  describe('parseServerTimingHeader', () => {
    it('parses a header string into metrics object', () => {
      const result = parseServerTimingHeader('hero;dur=120, about;dur=45');
      expect(result).toEqual({ hero: 120, about: 45 });
    });

    it('handles empty string', () => {
      expect(parseServerTimingHeader('')).toEqual({});
    });

    it('handles malformed entries gracefully', () => {
      const result = parseServerTimingHeader('valid;dur=100, broken, also-broken;no-dur');
      expect(result.valid).toBe(100);
      expect(Object.keys(result).length).toBeGreaterThanOrEqual(1);
    });

    it('parses numeric string values', () => {
      const result = parseServerTimingHeader('a;dur=50');
      expect(result.a).toBe(50);
    });

    it('is round-trip compatible', () => {
      const original = { sectionA: 200, sectionB: 150 };
      const header = createServerTimingHeader(original);
      const parsed = parseServerTimingHeader(header);
      expect(parsed).toEqual(original);
    });
  });
});
