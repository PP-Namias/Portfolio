import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSanityAssetKind,
  decodeGatewayTarget,
  createMediaGatewaySignature,
  verifyMediaGatewaySignature,
  buildMediaGatewayUrl,
} from '@/lib/media-gateway';
import {
  normalizeGatewayWidth,
  normalizeGatewayQuality,
  isSanityCdnUrl,
  encodeGatewayTarget,
} from '@/lib/media-constants';

describe('media-constants', () => {
  describe('normalizeGatewayWidth', () => {
    it('returns default for undefined', () => {
      expect(normalizeGatewayWidth(undefined)).toBe(1200);
    });
    it('parses valid width', () => {
      expect(normalizeGatewayWidth('800')).toBe(800);
    });
    it('clamps to min 16', () => {
      expect(normalizeGatewayWidth('1')).toBe(16);
    });
    it('clamps to max 4096', () => {
      expect(normalizeGatewayWidth('9999')).toBe(4096);
    });
  });

  describe('normalizeGatewayQuality', () => {
    it('returns default for undefined', () => {
      expect(normalizeGatewayQuality(undefined)).toBe(85);
    });
    it('parses valid quality', () => {
      expect(normalizeGatewayQuality('50')).toBe(50);
    });
    it('clamps to max 100', () => {
      expect(normalizeGatewayQuality('200')).toBe(100);
    });
  });

  describe('isSanityCdnUrl', () => {
    it('returns true for valid CDN image URL', () => {
      expect(isSanityCdnUrl('https://cdn.sanity.io/images/proj-id/image.jpg')).toBe(true);
    });
    it('returns true for valid CDN file URL', () => {
      expect(isSanityCdnUrl('https://cdn.sanity.io/files/proj-id/file.pdf')).toBe(true);
    });
    it('returns false for non-CDN URL', () => {
      expect(isSanityCdnUrl('https://example.com/img.jpg')).toBe(false);
    });
    it('returns false for URL with query params', () => {
      expect(isSanityCdnUrl('https://cdn.sanity.io/images/proj-id/img.jpg?w=100')).toBe(false);
    });
    it('returns false for invalid URL', () => {
      expect(isSanityCdnUrl('not-a-url')).toBe(false);
    });
  });

  describe('encodeGatewayTarget', () => {
    it('encodes URL to base64url', () => {
      const encoded = encodeGatewayTarget('https://cdn.sanity.io/images/proj/img.jpg');
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);
    });
  });
});

describe('media-gateway', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getSanityAssetKind', () => {
    it('returns image for /images/ path', () => {
      expect(getSanityAssetKind('https://cdn.sanity.io/images/proj/img.jpg')).toBe('image');
    });
    it('returns file for /files/ path', () => {
      expect(getSanityAssetKind('https://cdn.sanity.io/files/proj/file.pdf')).toBe('file');
    });
    it('returns unknown for non-CDN URL', () => {
      expect(getSanityAssetKind('https://example.com/img.jpg')).toBe('unknown');
    });
    it('returns unknown for invalid URL', () => {
      expect(getSanityAssetKind('not-a-url')).toBe('unknown');
    });
  });

  describe('decodeGatewayTarget', () => {
    it('decodes base64url encoded string', () => {
      const original = 'https://cdn.sanity.io/images/proj/img.jpg';
      const encoded = encodeGatewayTarget(original);
      expect(decodeGatewayTarget(encoded)).toBe(original);
    });
    it('returns empty string for invalid base64', () => {
      expect(decodeGatewayTarget('')).toBe('');
    });
  });

  describe('createMediaGatewaySignature', () => {
    it('returns null when no secret', () => {
      vi.stubEnv('SANITY_MEDIA_GATEWAY_SECRET', '');
      expect(createMediaGatewaySignature({ targetUrl: 'https://cdn.sanity.io/images/proj/img.jpg' })).toBeNull();
    });

    it('creates signature with secret', () => {
      vi.stubEnv('SANITY_MEDIA_GATEWAY_SECRET', 'test-secret');
      const result = createMediaGatewaySignature({ targetUrl: 'https://cdn.sanity.io/images/proj/img.jpg' });
      expect(result).not.toBeNull();
      expect(result?.exp).toBeDefined();
      expect(result?.sig).toBeDefined();
    });

    it('uses provided expiresAt', () => {
      vi.stubEnv('SANITY_MEDIA_GATEWAY_SECRET', 'test-secret');
      const result = createMediaGatewaySignature({
        targetUrl: 'https://cdn.sanity.io/images/proj/img.jpg',
        expiresAt: 12345,
      });
      expect(result?.exp).toBe(12345);
    });
  });

  describe('verifyMediaGatewaySignature', () => {
    it('returns invalid when no secret', () => {
      vi.stubEnv('SANITY_MEDIA_GATEWAY_SECRET', '');
      expect(verifyMediaGatewaySignature({ targetUrl: 'url', signature: 'sig', expiresAt: 999 })).toEqual({ valid: false, expired: false });
    });

    it('returns invalid when no signature', () => {
      vi.stubEnv('SANITY_MEDIA_GATEWAY_SECRET', 'test-secret');
      expect(verifyMediaGatewaySignature({ targetUrl: 'url' })).toEqual({ valid: false, expired: false });
    });

    it('returns invalid when expired beyond grace', () => {
      vi.stubEnv('SANITY_MEDIA_GATEWAY_SECRET', 'test-secret');
      const past = Math.floor(Date.now() / 1000) - 100000;
      expect(verifyMediaGatewaySignature({ targetUrl: 'url', signature: 'bad', expiresAt: past })).toEqual({ valid: false, expired: true });
    });

    it('validates correct signature', () => {
      vi.stubEnv('SANITY_MEDIA_GATEWAY_SECRET', 'test-secret');
      const targetUrl = 'https://cdn.sanity.io/images/proj/img.jpg';
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const sig = createMediaGatewaySignature({ targetUrl, expiresAt: exp });
      expect(verifyMediaGatewaySignature({ targetUrl, signature: sig?.sig, expiresAt: exp })).toEqual({ valid: true, expired: false });
    });
  });

  describe('buildMediaGatewayUrl', () => {
    it('returns empty for null/empty URL', () => {
      expect(buildMediaGatewayUrl(null)).toBe('');
      expect(buildMediaGatewayUrl('')).toBe('');
    });

    it('returns relative path as-is', () => {
      expect(buildMediaGatewayUrl('/images/local.jpg')).toBe('/images/local.jpg');
    });

    it('returns empty for non-Sanity URL', () => {
      expect(buildMediaGatewayUrl('https://example.com/img.jpg')).toBe('');
    });

    it('builds URL for valid Sanity CDN URL', () => {
      const url = buildMediaGatewayUrl('https://cdn.sanity.io/images/proj/img.jpg');
      expect(url).toContain('/api/media/sanity/');
      expect(url).toContain('w=');
      expect(url).toContain('q=');
    });

    it('includes signature when sign=true', () => {
      vi.stubEnv('SANITY_MEDIA_GATEWAY_SECRET', 'test-secret');
      const url = buildMediaGatewayUrl('https://cdn.sanity.io/images/proj/img.jpg', { sign: true });
      expect(url).toContain('exp=');
      expect(url).toContain('sig=');
    });
  });
});
