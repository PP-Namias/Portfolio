import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HubMenu } from '@/components/ui/HubMenu';

vi.mock('framer-motion', () => {
  const R = require('react');
  return {
    motion: {
      button: R.forwardRef(function MockButton(
        {
          children,
          className,
          onClick,
          role,
          tabIndex,
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
        ref: React.Ref<HTMLButtonElement>
      ) {
        return R.createElement('button', { ref, className, onClick, role, tabIndex, ...props }, children);
      }),
      div: R.forwardRef(function MockDiv(
        {
          children,
          className,
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
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, className, ...props }, children);
      }),
      a: ({
        children,
        className,
        onClick,
        href,
        download,
        target,
        rel,
        role,
        tabIndex,
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
      }: Record<string, unknown>) =>
        R.createElement('a', { className, onClick, href, download, target, rel, role, tabIndex, ...props }, children),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
}));

vi.mock('@/data/socials', () => ({
  socialLinks: [
    { name: 'cal', icon: 'calendar', label: 'Schedule a Meeting', link: 'https://cal.com/pp-namias', featured: true },
    { name: 'github', icon: 'github', label: 'PP-Namias', link: 'https://github.com/PP-Namias' },
    { name: 'linkedin', icon: 'linkedin', label: 'LinkedIn', link: 'https://www.linkedin.com/in/pp-namias/' },
    { name: 'x', icon: 'twitter', label: '@PP_Namias', link: 'https://x.com/PP_Namias' },
    { name: 'instagram', icon: 'instagram', label: '@pp_namias', link: 'https://www.instagram.com/pp_namias/' },
  ],
}));

vi.mock('@/data/profile', () => ({
  profile: {
    name: 'Jhon Keneth Ryan Namias',
    title: 'Full Stack Engineer',
    email: 'pp.namias@gmail.com',
  },
}));

const mockOpenModal = vi.fn();
vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({
    openModal: mockOpenModal,
    closeModal: vi.fn(),
  }),
}));

describe('HubMenu with blog feature enabled', () => {
  const mockOnClose = vi.fn();
  const mockOnOpenChat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders blog menu item with internal href', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);

    expect(screen.getByText('Read Blog')).toBeInTheDocument();
    expect(screen.getByText('Latest articles & tutorials')).toBeInTheDocument();

    const blogLink = screen.getByText('Read Blog').closest('a');
    expect(blogLink).toHaveAttribute('href', '/blog');
  });

  it('closes menu when blog item is clicked', () => {
    render(<HubMenu onClose={mockOnClose} onOpenChat={mockOnOpenChat} />);

    const blogLink = screen.getByText('Read Blog').closest('a');
    blogLink?.addEventListener('click', (event) => event.preventDefault());
    if (blogLink) {
      fireEvent.click(blogLink);
    }
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
