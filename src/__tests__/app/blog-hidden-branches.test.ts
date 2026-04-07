import { describe, it, expect, vi, beforeEach } from 'vitest';

const notFoundMock = vi.fn();

describe('blog hidden feature branches', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    vi.doMock('next/navigation', () => ({
      notFound: notFoundMock,
    }));

    vi.doMock('@/lib/features', () => ({
      IS_BLOG_VISIBLE: false,
    }));

    vi.doMock('@/data/blogPosts', () => ({
      blogPosts: [],
    }));

    vi.doMock('next/link', () => ({
      default: () => null,
    }));

    vi.doMock('@/components/ui/ThemeToggle', () => ({
      ThemeToggle: () => null,
    }));

    vi.doMock('@/app/blog/BlogListClient', () => ({
      default: () => null,
    }));

    vi.doMock('framer-motion', () => ({
      motion: { div: ({ children }: { children: unknown }) => children },
      AnimatePresence: ({ children }: { children: unknown }) => children,
    }));
  });

  it('app/blog/page invokes notFound when blog feature is hidden', async () => {
    const mod = await import('@/app/blog/page');
    mod.default();

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it('app/blog/[slug]/page invokes notFound and yields empty static params when hidden', async () => {
    const mod = await import('@/app/blog/[slug]/page');

    expect(mod.generateStaticParams()).toEqual([]);
    mod.default({ params: { slug: 'x' } });

    expect(notFoundMock).toHaveBeenCalled();
  });
});
