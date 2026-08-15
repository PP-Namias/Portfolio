import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const featureState = vi.hoisted(() => ({ realtime: true }));

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
  IS_MAGIC_CURSOR_VISIBLE: false,
  IS_PROJECTS_REVAMP_ENABLED: true,
  IS_STREAMING_SSR_ENABLED: true,
  IS_PWA_ENABLED: false,
  IS_OFFLINE_BANNER_VISIBLE: true,
  IS_LANGGRAPH_ENABLED: true,
  IS_CHAT_STREAMING_ENABLED: true,
  IS_CHAT_THREADING_ENABLED: false,
  get IS_REALTIME_SANITY_ENABLED() {
    return featureState.realtime;
  },
}));

vi.mock('next/headers', () => ({
  draftMode: () => Promise.resolve({ isEnabled: false }),
}));

vi.mock('@/lib/sections/seo.server', () => ({
  fetchSeoData: async () => ({
    siteTitle: 'Test Title',
    siteDescription: 'Test Description',
    canonicalUrl: 'https://namias.tech',
    ogImageUrl: '',
    twitterImageUrl: '',
    noindex: false,
    nofollow: false,
  }),
}));

vi.mock('@/lib/sections/hero.server', () => ({
  fetchHeroData: async () => ({
    profile: { name: 'Test Name', title: 'Test Role', email: 'test@example.com', location: 'Test City' },
    hero: { roles: ['Test Role'], availabilityLabel: '', profileImageUrl: '' },
    socialLinks: [],
  }),
}));

vi.mock('@/hooks/useSanityLiveRefresh', () => ({
  SanityLiveRefreshBridge: () => <div data-testid="sanity-live-bridge" />,
}));

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
    useReducedMotion: () => false,
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
  useTheme: () => ({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: vi.fn(),
  }),
}));

vi.mock('@/components/ui/LenisProvider', () => ({
  LenisProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="lenis-root">{children}</div>,
}));

vi.mock('@/components/ui/FloatingHub', () => ({
  FloatingHub: () => <div data-testid="floating-hub">FloatingHub</div>,
  FloatingHubWithBoundary: () => <div data-testid="floating-hub">FloatingHub</div>,
}));

vi.mock('@/components/ui/ScrollToTop', () => ({
  ScrollToTop: () => <div data-testid="scroll-to-top">ScrollToTop</div>,
}));

vi.mock('@/components/ui/Analytics', () => ({
  Analytics: () => <script data-testid="analytics-script" />,
}));

vi.mock('@/components/sections/HeroSection', () => ({ HeroSection: () => <div>HeroSection</div> }));
vi.mock('@/components/sections/AboutSection', () => ({ AboutSection: () => <div>AboutSection</div> }));
vi.mock('@/components/sections/TechStackSection', () => ({ TechStackSection: () => <div>TechStackSection</div> }));
vi.mock('@/components/sections/ProjectsSection', () => ({ ProjectsSection: () => <div>ProjectsSection</div> }));
vi.mock('@/components/sections/ProjectsSectionRevamped', () => ({ ProjectsSectionRevamped: () => <div>ProjectsSectionRevamped</div> }));
vi.mock('@/components/sections/CertificationsSection', () => ({ CertificationsSection: () => <div>CertificationsSection</div> }));
vi.mock('@/components/sections/BlogSection', () => ({ BlogSection: () => <div>BlogSection</div> }));
vi.mock('@/components/sections/ExperienceTimeline', () => ({ ExperienceTimeline: () => <div>ExperienceTimeline</div> }));
vi.mock('@/components/sections/ConnectSection', () => ({ ConnectSection: () => <div>ConnectSection</div> }));
vi.mock('@/components/sections/GallerySection', () => ({ GallerySection: () => <div>GallerySection</div> }));
vi.mock('@/components/layout/Footer', () => ({ Footer: () => <div>FooterSection</div> }));
vi.mock('@/components/sections/HomeContentStreaming', () => ({
  HomeContentStreaming: () => (
    <div>
      <div>HeroSection</div>
      <div>AboutSection</div>
      <div>TechStackSection</div>
      <div>ProjectsSectionRevamped</div>
      <div>ExperienceTimeline</div>
      <div>ConnectSection</div>
      <div>BlogSection</div>
      <div>CertificationsSection</div>
      <div>GallerySection</div>
      <div>FooterSection</div>
    </div>
  ),
}));
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
import { fallbackCmsContent } from '@/lib/cms-content.shared';

describe('app layout and page coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Providers wraps children with theme and lenis wrappers', () => {
    render(
      <Providers cmsContent={fallbackCmsContent}>
        <div>Children</div>
      </Providers>
    );

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('lenis-root')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('RootLayout returns html tree and includes skip link + shared widgets', async () => {
    const tree = await RootLayout({ children: <div>AppChild</div> });

    expect((tree as React.ReactElement).type).toBe('html');

    const domWarningSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(tree as React.ReactElement);
    domWarningSpy.mockRestore();

    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    expect(screen.getByText('AppChild')).toBeInTheDocument();
    expect(screen.getByTestId('floating-hub')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
  });

  it('Home page renders all major section blocks', () => {
    render(<Home />);

    expect(screen.getByText('HeroSection')).toBeInTheDocument();
    expect(screen.getByText('AboutSection')).toBeInTheDocument();
    expect(screen.getByText('TechStackSection')).toBeInTheDocument();
    expect(screen.getByText('ProjectsSectionRevamped')).toBeInTheDocument();
    expect(screen.getByText('ExperienceTimeline')).toBeInTheDocument();
    expect(screen.getByText('ConnectSection')).toBeInTheDocument();
    expect(screen.getByText('CertificationsSection')).toBeInTheDocument();
    expect(screen.getByText('BlogSection')).toBeInTheDocument();
    expect(screen.getByText('GallerySection')).toBeInTheDocument();
    expect(screen.getByText('FooterSection')).toBeInTheDocument();
  });

  it('Home page clears sticky side under mobile width branch', async () => {
    Object.defineProperty(globalThis, 'innerWidth', {
      configurable: true,
      value: 768,
    });

    render(<Home />);

    fireEvent(globalThis as unknown as Window, new Event('resize'));

    await waitFor(() => {
      const stickyBlocks = document.querySelectorAll(String.raw`.lg\:sticky`);
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

    expect(screen.getByText(/404/)).toBeTruthy();
    expect(screen.getByText(/Page not found/)).toBeTruthy();
    expect(screen.getByText(/Back to home/).closest('a')).toHaveAttribute('href', '/');
  });

  it('mounts the SanityLiveRefreshBridge in the streaming branch when realtime is enabled', async () => {
    const savedVitest = process.env.VITEST;
    const savedNodeEnv = process.env.NODE_ENV;
    process.env.VITEST = 'false';
    process.env.NODE_ENV = 'production';
    featureState.realtime = true;
    try {
      const tree = await RootLayout({ children: <div>StreamingChild</div> });

      expect((tree as React.ReactElement).type).toBe('html');

      const domWarningSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      render(tree as React.ReactElement);
      domWarningSpy.mockRestore();

      expect(screen.getByText('StreamingChild')).toBeInTheDocument();
      expect(screen.getByTestId('sanity-live-bridge')).toBeInTheDocument();
    } finally {
      process.env.VITEST = savedVitest;
      process.env.NODE_ENV = savedNodeEnv;
    }
  });

  it('omits the SanityLiveRefreshBridge when the realtime flag is off', async () => {
    const savedVitest = process.env.VITEST;
    const savedNodeEnv = process.env.NODE_ENV;
    process.env.VITEST = 'false';
    process.env.NODE_ENV = 'production';
    featureState.realtime = false;
    try {
      const tree = await RootLayout({ children: <div>StreamingChild</div> });

      const domWarningSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      render(tree as React.ReactElement);
      domWarningSpy.mockRestore();

      expect(screen.getByText('StreamingChild')).toBeInTheDocument();
      expect(screen.queryByTestId('sanity-live-bridge')).not.toBeInTheDocument();
    } finally {
      process.env.VITEST = savedVitest;
      process.env.NODE_ENV = savedNodeEnv;
    }
  });
});
