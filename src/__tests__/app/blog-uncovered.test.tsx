import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', () => {
  const R = require('react');

  const motion = new Proxy(
    {},
    {
      get: (_, tag: string) =>
        R.forwardRef(function MotionTag(
          {
            children,
            whileHover: _whileHover,
            whileTap: _whileTap,
            whileInView: _whileInView,
            initial: _initial,
            animate: _animate,
            exit: _exit,
            transition: _transition,
            variants: _variants,
            custom: _custom,
            layout: _layout,
            viewport: _viewport,
            ...props
          }: Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) {
          return R.createElement(tag, { ref, ...props }, children);
        }),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: ({
    alt = '',
    src = '',
    fill: _fill,
    priority: _priority,
    ...props
  }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={typeof alt === 'string' ? alt : ''}
      src={typeof src === 'string' ? src : ''}
      {...props}
    />
  ),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));

vi.mock('remark-gfm', () => ({
  default: () => undefined,
}));

vi.mock('rehype-highlight', () => ({
  default: () => undefined,
}));

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <button>ThemeToggle</button>,
}));

vi.mock('@/components/ui/ReadingProgress', () => ({
  ReadingProgress: () => <div>ReadingProgress</div>,
}));

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
}));

vi.mock('@/data/blogPosts', () => ({
  blogPosts: [
    {
      id: '1',
      slug: 'hello-world',
      title: 'Hello World',
      excerpt: 'Intro post excerpt',
      content: '# Hello\n\nThis is markdown content.',
      date: '2026-01-10',
      readTime: '5 min',
      tags: ['AI', 'Web'],
      coverImage: '/images/blog/hello-world.jpg',
    },
    {
      id: '2',
      slug: 'deep-dive',
      title: 'Deep Dive',
      excerpt: 'Advanced post excerpt',
      content: '## Deep\n\nMore content.',
      date: '2026-02-20',
      readTime: '7 min',
      tags: ['Cloud', 'Next.js'],
      coverImage: '/images/blog/deep-dive.jpg',
    },
  ],
}));

import BlogLayout from '@/app/blog/layout';
import BlogPage from '@/app/blog/page';
import BlogListClient from '@/app/blog/BlogListClient';
import BlogPostContent from '@/app/blog/[slug]/BlogPostContent';
import BlogPostPage, { generateMetadata, generateStaticParams } from '@/app/blog/[slug]/page';
import { notFound } from 'next/navigation';

const mockedNotFound = vi.mocked(notFound);

describe('blog route and content coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('BlogLayout returns children untouched', () => {
    const out = BlogLayout({ children: <div>blog-child</div> });
    render(out as React.ReactElement);
    expect(screen.getByText('blog-child')).toBeInTheDocument();
  });

  it('BlogListClient renders cards for posts', () => {
    render(
      <BlogListClient
        posts={[
          {
            id: '1',
            slug: 'post-1',
            title: 'Post 1',
            excerpt: 'Excerpt 1',
            content: 'Content 1',
            date: '2026-01-01',
            readTime: '3 min',
            tags: ['A', 'B', 'C'],
            coverImage: '/images/blog/post-1.jpg',
          },
        ]}
      />
    );

    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Excerpt 1')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
  });

  it('BlogPostContent renders missing post fallback state', () => {
    render(<BlogPostContent slug="missing-slug" />);
    expect(screen.getByText('Post Not Found')).toBeInTheDocument();
    expect(screen.getByText(/doesn't exist/i)).toBeInTheDocument();
  });

  it('BlogPostContent renders post content and navigation', () => {
    render(<BlogPostContent slug="deep-dive" />);

    expect(screen.getByText('Deep Dive')).toBeInTheDocument();
    expect(screen.getByText('ReadingProgress')).toBeInTheDocument();
    expect(screen.getByText('ThemeToggle')).toBeInTheDocument();
    expect(screen.getByTestId('markdown')).toHaveTextContent('## Deep');
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('BlogPage renders title and list when blog is visible', () => {
    render(<BlogPage />);

    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText(/Thoughts on AI/i)).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(mockedNotFound).not.toHaveBeenCalled();
  });

  it('generateStaticParams and generateMetadata work for existing and missing slugs', () => {
    const params = generateStaticParams();
    expect(params).toEqual([{ slug: 'hello-world' }, { slug: 'deep-dive' }]);

    const existing = generateMetadata({ params: { slug: 'hello-world' } });
    expect(existing.title).toContain('Hello World');

    const missing = generateMetadata({ params: { slug: 'missing' } });
    expect(missing.title).toContain('Post Not Found');
  });

  it('BlogPostPage renders JSON-LD script and post content', () => {
    const { container } = render(<BlogPostPage params={{ slug: 'hello-world' }} />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    const jsonLdScript = container.querySelector('script[type="application/ld+json"]');
    expect(jsonLdScript).toBeInTheDocument();
    expect(jsonLdScript?.innerHTML).toContain('Article');
  });
});
