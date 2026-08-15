import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/cms-content.server', () => ({
  querySanity: vi.fn(),
  CONTENT_TAGS: { post: 'post' },
}));

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
}));

import { fetchBlogData } from '@/lib/sections/blog.server';
import { querySanity } from '@/lib/cms-content.server';

describe('fetchBlogData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns blog posts when CMS returns data', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { title: 'Post 1', slug: 'post-1', publishedAt: '2026-01-01', excerpt: 'Exc 1', readTime: '5 min' },
      { title: 'Post 2', slug: 'post-2', publishedAt: '2026-01-02', excerpt: 'Exc 2', readTime: '3 min' },
    ]);
    const result = await fetchBlogData();
    expect(result.blogPosts).toHaveLength(2);
    expect(result.blogPosts[0].title).toBe('Post 1');
    expect(result.blogPosts[1].slug).toBe('post-2');
  });

  it('returns empty array when CMS returns null', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await fetchBlogData();
    expect(result.blogPosts).toEqual([]);
  });

  it('returns empty array when CMS returns empty array', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const result = await fetchBlogData();
    expect(result.blogPosts).toEqual([]);
  });

  it('handles missing optional fields gracefully', async () => {
    (querySanity as ReturnType<typeof vi.fn>).mockResolvedValue([
      { slug: 'minimal' },
    ]);
    const result = await fetchBlogData();
    expect(result.blogPosts).toHaveLength(1);
    expect(result.blogPosts[0].title).toBe('');
    expect(result.blogPosts[0].tags).toEqual([]);
  });
});
