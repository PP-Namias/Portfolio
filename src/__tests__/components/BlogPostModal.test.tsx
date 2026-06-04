import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', () => {
  const R = require('react');
  return {
    motion: {
      div: R.forwardRef(function MockMotionDiv(
        { children, className, onClick, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, className, onClick, ...props }, children);
      }),
      article: R.forwardRef(function MockMotionArticle(
        { children, className, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLElement>
      ) {
        return R.createElement('article', { ref, className, ...props }, children);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockOpenModal = vi.fn();
vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({
    openModal: mockOpenModal,
    closeModal: vi.fn(),
  }),
}));

vi.mock('@/hooks/useCmsContent', () => ({
  useCmsContent: () => ({
    blogPosts: [
      {
        id: '1',
        slug: 'first-post',
        title: 'First Post',
        excerpt: 'First excerpt',
        readTime: '5',
        tags: ['nextjs', 'caching'],
        date: '2026-01-01',
        coverImage: '',
        content: '# Hello world\n\nThis is a paragraph.',
      },
      {
        id: '2',
        slug: 'middle-post',
        title: 'Middle Post',
        excerpt: 'Middle excerpt',
        readTime: '7',
        tags: ['react'],
        date: '2026-02-01',
        coverImage: '',
        content: '## Subheading\n\nMiddle content.',
      },
      {
        id: '3',
        slug: 'last-post',
        title: 'Last Post',
        excerpt: 'Last excerpt',
        readTime: '4',
        tags: ['typescript'],
        date: '2026-03-01',
        coverImage: '',
        content: 'Last content body.',
      },
    ],
  }),
}));

import { BlogPostModal } from '@/components/ui/BlogPostModal';

describe('BlogPostModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the post title, tags and content for a valid slug', () => {
    render(<BlogPostModal open={true} onClose={mockOnClose} slug="middle-post" />);

    expect(screen.getByText('Middle Post')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('Middle content.')).toBeInTheDocument();
  });

  it('shows a "Post Not Found" message when the slug does not match', () => {
    render(<BlogPostModal open={true} onClose={mockOnClose} slug="nonexistent" />);

    expect(screen.getByText('Post Not Found')).toBeInTheDocument();
  });

  it('shows previous and next post links and navigates on click', () => {
    vi.useFakeTimers();
    render(<BlogPostModal open={true} onClose={mockOnClose} slug="middle-post" />);

    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Last Post')).toBeInTheDocument();

    const nextButton = screen.getByText('Last Post').closest('button');
    if (nextButton) fireEvent.click(nextButton);
    vi.advanceTimersByTime(60);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOpenModal).toHaveBeenCalledWith('blog-post', 'last-post');
    vi.useRealTimers();
  });

  it('shows "Back to Blog" button that opens the list modal', () => {
    vi.useFakeTimers();
    render(<BlogPostModal open={true} onClose={mockOnClose} slug="middle-post" />);

    fireEvent.click(screen.getByText('Back to Blog'));
    vi.advanceTimersByTime(60);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOpenModal).toHaveBeenCalledWith('blog');
    vi.useRealTimers();
  });
});
