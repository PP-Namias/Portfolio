import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';

const useCmsContentMock = vi.fn();
const featureFlagMock = vi.fn(() => true);

vi.mock('framer-motion', () => {
  const R = require('react');
  const motion = new Proxy(
    {},
    {
      get: (_, tag: string) =>
        R.forwardRef(function MotionTag(
          { children, ...props }: Record<string, unknown>,
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

vi.mock('next/image', () => ({
  default: ({
    alt = '',
    src = '',
    ...props
  }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={typeof alt === 'string' ? alt : ''} src={typeof src === 'string' ? src : ''} {...props} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/hooks/useCmsContent', () => ({
  useCmsContent: () => useCmsContentMock(),
}));

vi.mock('@/lib/features', () => ({
  get IS_BLOG_VISIBLE() {
    return featureFlagMock();
  },
}));

const samplePosts = [
  {
    id: 'a',
    slug: 'alpha',
    title: 'Alpha Post',
    excerpt: 'Alpha excerpt',
    content: '',
    date: '2026-03-15',
    readTime: '4 min',
    tags: ['AI', 'Cloud', 'Edge'],
    coverImage: 'https://cdn.sanity.io/images/x/production/alpha.jpg',
    featured: true,
  },
  {
    id: 'b',
    slug: 'bravo',
    title: 'Bravo Post',
    excerpt: 'Bravo excerpt',
    content: '',
    date: '2026-04-20',
    readTime: '6 min',
    tags: ['Next.js'],
    coverImage: 'bravo.jpg',
  },
  {
    id: 'c',
    slug: 'charlie',
    title: 'Charlie Post',
    excerpt: 'Charlie excerpt',
    content: '',
    date: '2026-01-05',
    readTime: '3 min',
    tags: ['React'],
    coverImage: 'placeholder.png',
  },
  {
    id: 'd',
    slug: 'delta',
    title: 'Delta Post',
    excerpt: 'Delta excerpt',
    content: '',
    date: '2026-05-01',
    readTime: '2 min',
    tags: ['TypeScript'],
    coverImage: 'delta.jpg',
  },
];

import { BlogSection } from '@/components/sections/BlogSection';

describe('BlogSection', () => {
  beforeEach(() => {
    useCmsContentMock.mockReset();
    featureFlagMock.mockReset();
    featureFlagMock.mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders nothing when IS_BLOG_VISIBLE is false', () => {
    featureFlagMock.mockReturnValue(false);
    useCmsContentMock.mockReturnValue({ blogPosts: samplePosts });

    const { container } = render(<BlogSection />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the Blog header and a count badge', () => {
    useCmsContentMock.mockReturnValue({ blogPosts: samplePosts });

    render(<BlogSection />);
    expect(screen.getByRole('heading', { name: /^Blog/ })).toBeInTheDocument();
    expect(screen.getByText(String(samplePosts.length))).toBeInTheDocument();
  });

  it('shows the latest 3 posts sorted by date desc', () => {
    useCmsContentMock.mockReturnValue({ blogPosts: samplePosts });

    render(<BlogSection />);

    const links = screen.getAllByRole('link', { name: /Post/ });
    const slugs = links
      .map((link) => link.getAttribute('href'))
      .filter((href): href is string => !!href && href.startsWith('/blog/'));
    expect(slugs).toEqual(['/blog/delta', '/blog/bravo', '/blog/alpha']);
  });

  it('exposes a "View all" link to /blog', () => {
    useCmsContentMock.mockReturnValue({ blogPosts: samplePosts });

    render(<BlogSection />);
    const viewAll = screen.getByRole('link', { name: /View all/ });
    expect(viewAll).toHaveAttribute('href', '/blog');
  });

  it('renders the empty state when blogPosts is empty', () => {
    useCmsContentMock.mockReturnValue({ blogPosts: [] });

    render(<BlogSection />);
    expect(screen.getByText('No posts yet.')).toBeInTheDocument();
    const visit = screen.getByRole('link', { name: /Visit the blog/ });
    expect(visit).toHaveAttribute('href', '/blog');
  });

  it('hides the "View all" link in the empty state', () => {
    useCmsContentMock.mockReturnValue({ blogPosts: [] });

    render(<BlogSection />);
    expect(screen.queryByRole('link', { name: /View all/ })).not.toBeInTheDocument();
  });

  it('caps visible tag chips at 2 per post', () => {
    useCmsContentMock.mockReturnValue({ blogPosts: [samplePosts[0]] });

    render(<BlogSection />);
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Cloud')).toBeInTheDocument();
    expect(screen.queryByText('Edge')).not.toBeInTheDocument();
  });

  it('renders a cover image with alt text from the post title', () => {
    useCmsContentMock.mockReturnValue({ blogPosts: [samplePosts[0]] });

    render(<BlogSection />);
    const img = screen.getByAltText('Alpha Post');
    expect(img).toBeInTheDocument();
    const src = img.getAttribute('src') || '';
    expect(src.startsWith('/api/media/sanity/') || src.includes('alpha.jpg')).toBe(true);
  });
});
