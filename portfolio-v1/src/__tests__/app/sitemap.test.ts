import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
  IS_PROJECTS_REVAMP_ENABLED: true,
}));

vi.mock('@/lib/site-config', () => ({
  SITE_URL: 'https://namias.tech',
}));

vi.mock('@/lib/cms-content.server', () => ({
  getCmsContent: vi.fn().mockResolvedValue({
    blogPosts: [
      { slug: 'hello-world', title: 'Hello', date: '2026-01-15' },
      { slug: 'second-post', title: 'Second', date: '2026-02-20' },
    ],
  }),
  getProjectSlugsForStaticParams: vi.fn().mockResolvedValue([
    { slug: 'project-one' },
    { slug: 'project-two' },
  ]),
}));

import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('returns base entries for root and projects list', async () => {
    const entries = await sitemap();
    const urls = entries.map((e: { url: string }) => e.url);
    expect(urls).toContain('https://namias.tech');
    expect(urls).toContain('https://namias.tech/projects');
  });

  it('includes blog list page and blog post entries', async () => {
    const entries = await sitemap();
    const urls = entries.map((e: { url: string }) => e.url);
    expect(urls).toContain('https://namias.tech/blog');
    expect(urls).toContain('https://namias.tech/blog/hello-world');
    expect(urls).toContain('https://namias.tech/blog/second-post');
  });

  it('includes project detail page entries', async () => {
    const entries = await sitemap();
    const urls = entries.map((e: { url: string }) => e.url);
    expect(urls).toContain('https://namias.tech/projects/project-one');
    expect(urls).toContain('https://namias.tech/projects/project-two');
  });

  it('sets priority values on entries', async () => {
    const entries = await sitemap();
    const root = entries.find((e: { url: string }) => e.url === 'https://namias.tech');
    expect(root?.priority).toBe(1);
    const blog = entries.find((e: { url: string }) => e.url === 'https://namias.tech/blog');
    expect(blog?.priority).toBe(0.8);
    const post = entries.find((e: { url: string }) => e.url === 'https://namias.tech/blog/hello-world');
    expect(post?.priority).toBe(0.7);
  });
});
