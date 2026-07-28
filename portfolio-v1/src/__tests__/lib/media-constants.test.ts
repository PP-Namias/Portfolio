import { describe, it, expect } from 'vitest';
import {
  SANITY_CDN_HOST,
  SANITY_CDN_ALLOWED_PATH_PREFIXES,
  MEDIA_ROUTE_PREFIX,
  DEFAULT_WIDTH,
  DEFAULT_QUALITY,
  DEFAULT_GATEWAY_EXPIRY_SECONDS,
  SIGNATURE_GRACE_PERIOD_SECONDS,
  normalizeInteger,
  normalizeGatewayWidth,
  normalizeGatewayQuality,
  isSanityCdnUrl,
  encodeGatewayTarget,
} from '@/lib/media-constants';

describe('media-constants', () => {
  describe('constants', () => {
    it('SANITY_CDN_HOST is cdn.sanity.io', () => {
      expect(SANITY_CDN_HOST).toBe('cdn.sanity.io');
    });

    it('SANITY_CDN_ALLOWED_PATH_PREFIXES contains images and files', () => {
      expect(SANITY_CDN_ALLOWED_PATH_PREFIXES).toContain('/images/');
      expect(SANITY_CDN_ALLOWED_PATH_PREFIXES).toContain('/files/');
    });

    it('MEDIA_ROUTE_PREFIX is /api/media', () => {
      expect(MEDIA_ROUTE_PREFIX).toBe('/api/media');
    });

    it('DEFAULT_WIDTH is 1200', () => {
      expect(DEFAULT_WIDTH).toBe(1200);
    });

    it('DEFAULT_QUALITY is 85', () => {
      expect(DEFAULT_QUALITY).toBe(85);
    });

    it('DEFAULT_GATEWAY_EXPIRY_SECONDS is 7 days', () => {
      expect(DEFAULT_GATEWAY_EXPIRY_SECONDS).toBe(7 * 24 * 60 * 60);
    });

    it('SIGNATURE_GRACE_PERIOD_SECONDS is 1 hour', () => {
      expect(SIGNATURE_GRACE_PERIOD_SECONDS).toBe(60 * 60);
    });
  });

  describe('normalizeInteger', () => {
    it('returns the parsed value for valid string input', () => {
      expect(normalizeInteger('500', 100, 1, 1000)).toBe(500);
    });

    it('returns fallback for NaN input', () => {
      expect(normalizeInteger('abc', 100, 1, 1000)).toBe(100);
    });

    it('clamps to min', () => {
      expect(normalizeInteger('-10', 100, 1, 1000)).toBe(1);
    });

    it('clamps to max', () => {
      expect(normalizeInteger('5000', 100, 1, 1000)).toBe(1000);
    });

    it('truncates floats', () => {
      expect(normalizeInteger('45.7', 100, 1, 1000)).toBe(45);
    });
  });

  describe('normalizeGatewayWidth', () => {
    it('returns valid width', () => {
      expect(normalizeGatewayWidth('800')).toBe(800);
    });

    it('clamps below minimum', () => {
      expect(normalizeGatewayWidth('1')).toBe(16);
    });

    it('clamps above maximum', () => {
      expect(normalizeGatewayWidth('9999')).toBe(4096);
    });

    it('returns default for invalid', () => {
      expect(normalizeGatewayWidth('invalid')).toBe(1200);
    });
  });

  describe('normalizeGatewayQuality', () => {
    it('returns valid quality', () => {
      expect(normalizeGatewayQuality('75')).toBe(75);
    });

    it('clamps below minimum', () => {
      expect(normalizeGatewayQuality('0')).toBe(1);
    });

    it('clamps above maximum', () => {
      expect(normalizeGatewayQuality('200')).toBe(100);
    });

    it('returns default for invalid', () => {
      expect(normalizeGatewayQuality('invalid')).toBe(85);
    });
  });

  describe('isSanityCdnUrl', () => {
    it('returns true for valid Sanity CDN image URL', () => {
      expect(isSanityCdnUrl('https://cdn.sanity.io/images/proj-id/prod/image-123.jpg')).toBe(true);
    });

    it('returns true for valid Sanity CDN files URL', () => {
      expect(isSanityCdnUrl('https://cdn.sanity.io/files/proj-id/prod/document.pdf')).toBe(true);
    });

    it('returns false for non-HTTPS URL', () => {
      expect(isSanityCdnUrl('http://cdn.sanity.io/images/proj-id/prod/image.jpg')).toBe(false);
    });

    it('returns false for non-Sanity host', () => {
      expect(isSanityCdnUrl('https://example.com/image.jpg')).toBe(false);
    });

    it('returns false for URL with query params', () => {
      expect(isSanityCdnUrl('https://cdn.sanity.io/images/proj-id/prod/image.jpg?w=500')).toBe(false);
    });

    it('returns false for URL with hash', () => {
      expect(isSanityCdnUrl('https://cdn.sanity.io/images/proj-id/prod/image.jpg#section')).toBe(false);
    });

    it('returns false for invalid URL string', () => {
      expect(isSanityCdnUrl('not-a-url')).toBe(false);
    });

    it('returns false for disallowed path prefix', () => {
      expect(isSanityCdnUrl('https://cdn.sanity.io/other/proj-id/prod/data.json')).toBe(false);
    });
  });

  describe('encodeGatewayTarget', () => {
    it('encodes a URL to base64url format', () => {
      const result = encodeGatewayTarget('https://cdn.sanity.io/images/proj-id/prod/image.jpg');
      expect(result).toBeTruthy();
      expect(result).not.toContain('+');
      expect(result).not.toContain('/');
      expect(result).not.toContain('=');
    });

    it('produces consistent output for the same input', () => {
      const input = 'https://example.com/image.png';
      expect(encodeGatewayTarget(input)).toBe(encodeGatewayTarget(input));
    });

    it('encodes special characters correctly', () => {
      const result = encodeGatewayTarget('https://example.com/a b/c?query=1&foo=bar');
      expect(result).toBeTruthy();
    });
  });
});
