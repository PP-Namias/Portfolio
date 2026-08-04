import { describe, it, expect, vi } from 'vitest';

vi.mock('next/font/google', () => ({ Inter: () => ({ variable: 'mock-inter' }) }));

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

vi.mock('@/lib/sections/seo.server', () => ({
  fetchSeoData: vi.fn().mockResolvedValue({
    siteTitle: 'Jhon Keneth Ryan B. Namias | Full Stack Engineer & AI Specialist',
    siteDescription: 'Full Stack Engineering, AI Automation, and project management.',
    canonicalUrl: 'https://namias.tech',
    ogImageUrl: '/og-image.png',
    twitterImageUrl: '/og-image.png',
    noindex: false,
    nofollow: false,
  }),
}));

describe('app metadata routes', () => {
  it('root metadata declares the static open graph image with dimensions', async () => {
    const { generateMetadata } = await import('@/app/layout');
    const meta = await generateMetadata();
    const images = meta.openGraph?.images as Array<Record<string, unknown>> | undefined;

    expect(images).toBeDefined();
    expect(images[0]).toMatchObject({ url: '/og-image.png', width: 1200, height: 630 });
    expect(images[0].alt).toContain('Jhon Keneth Ryan B. Namias');
  });

  it('root metadata declares the twitter card with a large summary image', async () => {
    const { generateMetadata } = await import('@/app/layout');
    const meta = await generateMetadata();

    expect(meta.twitter?.card).toBe('summary_large_image');
    expect(meta.twitter?.images).toContain('/og-image.png');
  });

  it('sitemap returns homepage and projects listing when blog is hidden', async () => {
    vi.resetModules();
    vi.doMock('@/lib/features', () => ({ IS_BLOG_VISIBLE: false, IS_PROJECTS_REVAMP_ENABLED: false }));

    const mod = await import('@/app/sitemap');
    const result = await mod.default();

    expect(result).toHaveLength(2);
    expect(result[0].url).toBe('https://namias.tech');
    expect(result[1].url).toBe('https://namias.tech/projects');
  });

  it('sitemap includes blog and post entries when blog is visible', async () => {
    vi.resetModules();
    vi.doMock('@/lib/features', () => ({ IS_BLOG_VISIBLE: true, IS_PROJECTS_REVAMP_ENABLED: false }));

    const mod = await import('@/app/sitemap');
    const result = await mod.default();

    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.some((entry) => entry.url.endsWith('/contact'))).toBe(false);
    expect(result.some((entry) => entry.url.endsWith('/blog'))).toBe(true);
  });
});