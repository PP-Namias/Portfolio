import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

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

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'mock-inter' }),
}));

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

vi.mock('lenis/react', () => ({
  ReactLenis: ({ children }: { children: React.ReactNode }) => <div data-testid="lenis-root">{children}</div>,
}));

vi.mock('@/components/ui/FloatingHub', () => ({
  FloatingHub: () => <div data-testid="floating-hub">FloatingHub</div>,
}));

vi.mock('@/components/ui/ScrollToTop', () => ({
  ScrollToTop: () => <div data-testid="scroll-to-top">ScrollToTop</div>,
}));

vi.mock('@/components/ui/Analytics', () => ({
  Analytics: () => <div data-testid="analytics-script">Analytics</div>,
}));

vi.mock('@/components/sections/HeroSection', () => ({ HeroSection: () => <div>HeroSection</div> }));
vi.mock('@/components/sections/AboutSection', () => ({ AboutSection: () => <div>AboutSection</div> }));
vi.mock('@/components/sections/TechStackSection', () => ({ TechStackSection: () => <div>TechStackSection</div> }));
vi.mock('@/components/sections/ProjectsSection', () => ({ ProjectsSection: () => <div>ProjectsSection</div> }));
vi.mock('@/components/sections/CertificationsSection', () => ({ CertificationsSection: () => <div>CertificationsSection</div> }));
vi.mock('@/components/sections/ExperienceTimeline', () => ({ ExperienceTimeline: () => <div>ExperienceTimeline</div> }));
vi.mock('@/components/sections/ConnectSection', () => ({ ConnectSection: () => <div>ConnectSection</div> }));
vi.mock('@/components/sections/GallerySection', () => ({ GallerySection: () => <div>GallerySection</div> }));
vi.mock('@/components/layout/Footer', () => ({ Footer: () => <div>FooterSection</div> }));
vi.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
}));

import RootLayout from '@/app/layout';
import Home from '@/app/page';
import { Providers } from '@/app/providers';
import ErrorPage from '@/app/error';
import NotFoundPage from '@/app/not-found';

describe('app layout and page coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Providers wraps children with theme and lenis wrappers', () => {
    render(
      <Providers>
        <div>Children</div>
      </Providers>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('lenis-root')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('RootLayout returns html tree and includes skip link + shared widgets', () => {
    const tree = RootLayout({ children: <div>AppChild</div> });

    expect((tree as React.ReactElement).type).toBe('html');

    render(tree as React.ReactElement);

    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    expect(screen.getByText('AppChild')).toBeInTheDocument();
    expect(screen.getByTestId('floating-hub')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-script')).toBeInTheDocument();
  });

  it('Home page renders all major section blocks', () => {
    render(<Home />);

    expect(screen.getByText('HeroSection')).toBeInTheDocument();
    expect(screen.getByText('AboutSection')).toBeInTheDocument();
    expect(screen.getByText('TechStackSection')).toBeInTheDocument();
    expect(screen.getByText('ProjectsSection')).toBeInTheDocument();
    expect(screen.getByText('ExperienceTimeline')).toBeInTheDocument();
    expect(screen.getByText('ConnectSection')).toBeInTheDocument();
    expect(screen.getByText('CertificationsSection')).toBeInTheDocument();
    expect(screen.getByText('GallerySection')).toBeInTheDocument();
    expect(screen.getByText('FooterSection')).toBeInTheDocument();
  });

  it('Home page clears sticky side under mobile width branch', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 768,
    });

    render(<Home />);

    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      const stickyBlocks = document.querySelectorAll('.lg\\:sticky');
      expect(stickyBlocks.length).toBe(0);
    });
  });

  it('Error page logs error and supports reset action', () => {
    const reset = vi.fn();
    const error = new Error('Boom');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(<ErrorPage error={error} reset={reset} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Try Again'));
    expect(reset).toHaveBeenCalledTimes(1);

    errorSpy.mockRestore();
  });

  it('NotFound page renders CTA links', () => {
    render(<NotFoundPage />);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByText('Back to Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/blog');
  });
});
