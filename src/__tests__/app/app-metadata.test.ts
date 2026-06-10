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

vi.mock('@/lib/cms-content.server', () => ({
  getCmsContent: vi.fn().mockResolvedValue({
    blogPosts: [
      { slug: 'hello-world', title: 'Hello World', date: '2026-01-10' },
      { slug: 'deep-dive', title: 'Deep Dive', date: '2026-02-20' },
    ],
    siteSettings: { blog: { title: 'Blog', description: 'Test', backLabel: 'Back' } },
  }),
  getBlogPostSlugsForStaticParams: vi.fn().mockResolvedValue([
    { slug: 'hello-world' },
    { slug: 'deep-dive' },
  ]),
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

    const mod = await import('@/app/sitemap');
    const result = await mod.default();

    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://namias.tech');
  });

  it('sitemap includes blog and post entries when blog is visible', async () => {
    vi.doMock('@/lib/features', () => ({ IS_BLOG_VISIBLE: true }));

    const mod = await import('@/app/sitemap');
    const result = await mod.default();

    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.some((entry) => entry.url.endsWith('/contact'))).toBe(false);
    expect(result.some((entry) => entry.url.endsWith('/blog'))).toBe(true);
  });
});
