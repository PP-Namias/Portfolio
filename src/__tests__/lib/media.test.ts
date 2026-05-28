import { describe, expect, it } from 'vitest';
import { resolveContentImageSrc } from '@/lib/media';

describe('resolveContentImageSrc', () => {
  it('rewrites Sanity urls through the media gateway', () => {
    const src = resolveContentImageSrc('https://cdn.sanity.io/images/project/production/image-800x600.jpg', {
      folder: 'projects',
    });

    expect(src).toContain('/api/media/sanity/');
    expect(src).toContain('w=1200');
    expect(src).toContain('q=75');
  });

  it('keeps local asset paths intact', () => {
    expect(resolveContentImageSrc('/images/projects/sample.png', { folder: 'projects' })).toBe('/images/projects/sample.png');
  });

  it('falls back for unsupported remote urls', () => {
    expect(resolveContentImageSrc('https://example.com/image.jpg', { fallback: '/images/fallback.png' })).toBe('/images/fallback.png');
  });
});
