import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
          initial: _initial,
          animate: _animate,
          exit: _exit,
          transition: _transition,
          variants: _variants,
          custom: _custom,
          layout: _layout,
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
        initial: _initial,
        animate: _animate,
        exit: _exit,
        transition: _transition,
        variants: _variants,
        custom: _custom,
        layout: _layout,
        ...props
      }: Record<string, unknown>) =>
        R.createElement('a', { className, onClick, href, download, target, rel, role, tabIndex, ...props }, children),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual<typeof import('lucide-react')>('lucide-react');
  return {
    ...actual,
    Share2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-share2" {...props} />,
    // Twitter is intentionally undefined so HubMenu falls back to Share2.
    Twitter: undefined,
  };
});

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: false,
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

vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({
    openModal: vi.fn(),
    closeModal: vi.fn(),
  }),
}));

describe('HubMenu social icon fallback', () => {
  it('falls back to Share2 icon when a social icon mapping is missing', () => {
    render(<HubMenu onClose={vi.fn()} onOpenChat={vi.fn()} />);

    fireEvent.click(screen.getByText('Connect'));

    const xLink = screen.getByLabelText('@PP_Namias');
    expect(within(xLink).getByTestId('icon-share2')).toBeInTheDocument();
  });
});
