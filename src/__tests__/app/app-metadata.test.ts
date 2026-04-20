import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/og', () => ({
  ImageResponse: class {
    element: unknown;
    options: unknown;

    constructor(element: unknown, options: unknown) {
      this.element = element;
      this.options = options;
    }
  },
}));

import OpenGraphImage, {
  runtime as ogRuntime,
  size as ogSize,
  contentType as ogContentType,
} from '@/app/opengraph-image';
import TwitterImage, {
  runtime as twRuntime,
  size as twSize,
  contentType as twContentType,
} from '@/app/twitter-image';

describe('app metadata routes', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('generates open graph image with expected runtime and metadata', () => {
    const response = OpenGraphImage() as unknown as { options: { width: number; height: number } };

    expect(ogRuntime).toBe('edge');
    expect(ogContentType).toBe('image/png');
    expect(ogSize).toEqual({ width: 1200, height: 630 });
    expect(response).toBeTruthy();
    expect(response.options).toMatchObject({ width: 1200, height: 630 });
  });

  it('generates twitter image with expected runtime and metadata', () => {
    const response = TwitterImage() as unknown as { options: { width: number; height: number } };

    expect(twRuntime).toBe('edge');
    expect(twContentType).toBe('image/png');
    expect(twSize).toEqual({ width: 1200, height: 630 });
    expect(response).toBeTruthy();
    expect(response.options).toMatchObject({ width: 1200, height: 630 });
  });

  it('sitemap returns only homepage when blog is hidden', async () => {
    vi.doMock('@/lib/features', () => ({ IS_BLOG_VISIBLE: false }));
    vi.doMock('@/data/blogPosts', () => ({ blogPosts: [] }));

    const mod = await import('@/app/sitemap');
    const result = mod.default();

    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://namias.tech');
  });

  it('sitemap includes blog and post entries when blog is visible', async () => {
    vi.doMock('@/lib/features', () => ({ IS_BLOG_VISIBLE: true }));
    vi.doMock('@/data/blogPosts', () => ({
      blogPosts: [
        { slug: 'post-1', date: '2026-01-01' },
        { slug: 'post-2', date: '2026-02-01' },
      ],
    }));

    const mod = await import('@/app/sitemap');
    const result = mod.default();

    expect(result.length).toBe(4);
    expect(result.some((entry) => entry.url.endsWith('/contact'))).toBe(false);
    expect(result.some((entry) => entry.url.endsWith('/blog'))).toBe(true);
    expect(result.some((entry) => entry.url.endsWith('/blog/post-1'))).toBe(true);
    expect(result.some((entry) => entry.url.endsWith('/blog/post-2'))).toBe(true);
  });
});
