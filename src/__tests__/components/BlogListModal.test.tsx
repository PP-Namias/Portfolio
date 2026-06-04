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
      button: R.forwardRef(function MockMotionButton(
        { children, className, onClick, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLButtonElement>
      ) {
        return R.createElement('button', { ref, className, onClick, ...props }, children);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({
    openModal: mockOpenModal,
    closeModal: vi.fn(),
  }),
}));

const mockOpenModal = vi.fn();

vi.mock('@/hooks/useCmsContent', () => ({
  useCmsContent: () => ({
    blogPosts: [
      {
        id: '1',
        slug: 'first-post',
        title: 'First Post',
        excerpt: 'First excerpt',
        readTime: '5',
        tags: ['nextjs'],
        date: '2026-01-01',
        coverImage: '',
        content: '# Hello',
      },
      {
        id: '2',
        slug: 'second-post',
        title: 'Second Post',
        excerpt: 'Second excerpt',
        readTime: '3',
        tags: ['react'],
        date: '2026-02-01',
        coverImage: '',
        content: '# Hi',
      },
    ],
  }),
}));

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
}));

import { BlogListModal } from '@/components/ui/BlogListModal';

describe('BlogListModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders post count and titles from CMS content', () => {
    render(<BlogListModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('2 posts')).toBeInTheDocument();
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('opens blog-post modal for the clicked slug and closes list', async () => {
    vi.useFakeTimers();
    render(<BlogListModal open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('First Post'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60);
    expect(mockOpenModal).toHaveBeenCalledWith('blog-post', 'first-post');

    vi.useRealTimers();
  });

  it('does not render posts when closed', () => {
    render(<BlogListModal open={false} onClose={mockOnClose} />);
    expect(screen.queryByText('First Post')).not.toBeInTheDocument();
  });
});
