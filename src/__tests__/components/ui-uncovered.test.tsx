import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

const openModalMock = vi.fn();
const toggleThemeMock = vi.fn();

let mockedTheme = {
  isDark: true,
  mounted: true,
  toggleTheme: toggleThemeMock,
};

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
    useScroll: () => ({ scrollYProgress: 0.5 }),
    useSpring: (value: unknown) => value,
  };
});

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

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockedTheme,
}));

vi.mock('@/components/ui/Modal', () => ({
  Modal: ({ open, title, children }: { open: boolean; title: string; children: React.ReactNode }) => (
    open ? <div data-testid="mock-modal"><h2>{title}</h2>{children}</div> : null
  ),
}));

vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({
    openModal: openModalMock,
    closeModal: vi.fn(),
  }),
}));

vi.mock('@/data/experience', () => ({
  experiences: [
    {
      position: 'Engineer',
      company: 'Company A',
      startedAt: '2024-01-01',
      endedAt: null,
      type: 'Full-time',
      modality: 'Hybrid',
      country: 'PH',
      summary: 'Worked on automation.',
      highlights: ['Built systems'],
      achievements: ['Award'],
      technologies: ['TypeScript'],
      images: ['sample.png'],
      relatedProjects: [],
    },
  ],
}));

import { AccentColorProvider } from '@/hooks/useAccentColor';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Footer } from '@/components/layout/Footer';
import { ColorSchemePicker } from '@/components/ui/ColorSchemePicker';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { TimelineItem } from '@/components/ui/TimelineItem';
import { ExperienceModal } from '@/components/ui/ExperienceModal';

describe('uncovered UI components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedTheme = {
      isDark: true,
      mounted: true,
      toggleTheme: toggleThemeMock,
    };

    Object.defineProperty(globalThis, 'scrollTo', {
      writable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('Button renders internal link, external link, and button variants', () => {
    const { rerender } = render(<Button internal href="/blog">Open Blog</Button>);
    expect(screen.getByText('Open Blog').closest('a')).toHaveAttribute('href', '/blog');

    rerender(<Button href="https://example.com">External</Button>);
    const external = screen.getByText('External').closest('a');
    expect(external).toHaveAttribute('target', '_blank');

    const onClick = vi.fn();
    rerender(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Card renders content and hover classes', () => {
    render(<Card hover>Body</Card>);
    expect(screen.getByText('Body')).toBeInTheDocument();
    const cardEl = screen.getByText('Body').closest('div');
    expect(cardEl?.className).toContain('hover:border-accent-pink');
  });

  it('ThemeToggle renders and triggers toggle', () => {
    render(<ThemeToggle />);
    const btn = screen.getByLabelText('Switch to light mode');
    fireEvent.click(btn);
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);

    mockedTheme = { ...mockedTheme, isDark: false, mounted: true };
    render(<ThemeToggle />);
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('ThemeToggle renders placeholder when not mounted', () => {
    mockedTheme = { ...mockedTheme, mounted: false };
    render(<ThemeToggle />);
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('ScrollToTop appears after scrolling and scrolls to page top', () => {
    render(<ScrollToTop />);
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();

    Object.defineProperty(globalThis, 'scrollY', { value: 500, configurable: true });
    fireEvent.scroll(globalThis);

    const button = screen.getByLabelText('Scroll to top');
    fireEvent.click(button);
    expect(globalThis.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('ReadingProgress renders fixed top bar', () => {
    render(<ReadingProgress />);
    const progress = document.querySelector('.fixed.top-0.left-0.right-0');
    expect(progress).toBeInTheDocument();
  });

  it('VerifiedBadge renders accessible icon', () => {
    render(<VerifiedBadge />);
    expect(screen.getByLabelText('Verified')).toBeInTheDocument();
  });

  it('Footer renders CTA, social links and copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/Interested in working together/i)).toBeInTheDocument();
    expect(screen.getByText(/Let's connect/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it('ColorSchemePicker opens options and selects a scheme', async () => {
    render(
      <AccentColorProvider>
        <ColorSchemePicker />
      </AccentColorProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.click(screen.getByLabelText(/Select accent color/i));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: 'Blue' }));
    expect(localStorage.getItem('accent-color')).toBe('blue');

    fireEvent.keyDown(document, { key: 'Escape' });
  });

  it('ProjectCard renders metadata, tags and links', () => {
    render(
      <ProjectCard
        index={0}
        project={{
          title: 'System X',
          description: 'A modern app.',
          year: 2026,
          tags: ['React', 'TypeScript', 'AI'],
          image: 'cover.png',
          liveURL: 'https://example.com/live',
          repositoryURL: 'https://example.com/repo',
          processURL: null,
        }}
      />
    );

    expect(screen.getByText('System X')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(screen.getByText('Code').closest('a')).toHaveAttribute('href', 'https://example.com/repo');
    expect(screen.getByText('Live').closest('a')).toHaveAttribute('href', 'https://example.com/live');
  });

  it('TimelineItem expands details when item has details', () => {
    render(
      <TimelineItem
        index={0}
        isLast={false}
        item={{
          position: 'Developer',
          company: 'Acme',
          startedAt: '2024-01-01',
          endedAt: null,
          type: 'Full-time',
          modality: 'Hybrid',
          country: 'PH',
          summary: 'Did things',
          highlights: ['Highlight 1'],
          achievements: ['Achievement 1'],
          technologies: ['React'],
          images: [],
          relatedProjects: [],
        }}
      />
    );

    fireEvent.click(screen.getByText('Developer'));
    expect(screen.getByText('Did things')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Achievement 1')).toBeInTheDocument();
  });

  it('ExperienceModal renders experience content when open', () => {
    render(<ExperienceModal open onClose={vi.fn()} />);

    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Company A')).toBeInTheDocument();
    expect(screen.getByText('Built systems')).toBeInTheDocument();
    expect(screen.getByText('Award')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
