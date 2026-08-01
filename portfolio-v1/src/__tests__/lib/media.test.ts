import { describe, expect, it } from 'vitest';
import { resolveContentImageSrc, parseImageDimensions, decodeGatewayTarget } from '@/lib/media';

describe('resolveContentImageSrc', () => {
  it('rewrites Sanity urls through the media gateway', () => {
    const src = resolveContentImageSrc('https://cdn.sanity.io/images/project/production/image-800x600.jpg', {
      folder: 'projects',
    });

    expect(src).toContain('/api/media/sanity/');
    expect(src).toContain('w=1200');
    expect(src).toContain('q=85');
  });

  it('keeps local asset paths intact', () => {
    expect(resolveContentImageSrc('/images/projects/sample.png', { folder: 'projects' })).toBe('/images/projects/sample.png');
  });

  it('falls back for unsupported remote urls', () => {
    expect(resolveContentImageSrc('https://example.com/image.jpg', { fallback: '/images/fallback.png' })).toBe('/images/fallback.png');
  });
});

describe('parseImageDimensions', () => {
  it('extracts dimensions from a raw Sanity CDN url', () => {
    expect(
      parseImageDimensions('https://cdn.sanity.io/images/nl0qw78w/production/abc123-1808x1064.jpg')
    ).toEqual({ width: 1808, height: 1064 });
  });

  it('extracts dimensions from a media gateway url', () => {
    const raw = 'https://cdn.sanity.io/images/nl0qw78w/production/abc123-1536x2048.jpg';
    const gateway = resolveContentImageSrc(raw);
    expect(parseImageDimensions(gateway)).toEqual({ width: 1536, height: 2048 });
  });

  it('returns null when the url has no dimensions', () => {
    expect(parseImageDimensions('https://cdn.sanity.io/images/nl0qw78w/production/abc123.jpg')).toBeNull();
    expect(parseImageDimensions('/images/blog/post.jpg')).toBeNull();
    expect(parseImageDimensions(null)).toBeNull();
    expect(parseImageDimensions('')).toBeNull();
  });
});

describe('decodeGatewayTarget', () => {
  it('decodes an encoded gateway target back to the raw url', () => {
    const raw = 'https://cdn.sanity.io/images/nl0qw78w/production/abc123-800x600.jpg';
    const gateway = resolveContentImageSrc(raw);
    const encoded = gateway.match(/\/api\/media\/sanity\/([A-Za-z0-9_-]+)/)?.[1];
    expect(encoded).toBeDefined();
    expect(decodeGatewayTarget(encoded!)).toBe(raw);
  });

  it('returns null for invalid input', () => {
    expect(decodeGatewayTarget('%%%')).toBeNull();
  });
});
