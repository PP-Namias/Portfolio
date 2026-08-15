import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('next/font/google', () => ({ Inter: () => ({ variable: 'mock-inter' }) }));

vi.mock('next/headers', () => ({ draftMode: vi.fn().mockResolvedValue({ isEnabled: false }) }));

vi.mock('next-sanity', () => ({ VisualEditing: () => null }));

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light', setTheme: vi.fn() }),
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

vi.mock('@/components/ui/MagicCursor', () => ({
  MagicCursor: () => <div data-testid="magic-cursor">Cursor</div>,
}));

vi.mock('@/components/seo/JsonLd', () => ({
  JsonLd: ({ id }: { id: string }) => <script data-testid="jsonld" data-id={id} />,
}));

vi.mock('@/app/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <div data-testid="providers">{children}</div>,
}));

vi.mock('@/lib/features', () => ({
  IS_MAGIC_CURSOR_VISIBLE: true,
  IS_STREAMING_SSR_ENABLED: true,
  IS_BLOG_VISIBLE: true,
  IS_PROJECTS_REVAMP_ENABLED: true,
  IS_LANGGRAPH_ENABLED: true,
  IS_CHAT_STREAMING_ENABLED: true,
  IS_CHAT_THREADING_ENABLED: true,
}));

vi.mock('@/lib/site-config', () => ({
  SITE_URL: 'https://namias.tech',
  SITE_NAME: 'Jhon Keneth Namias | Portfolio',
  SITE_DESCRIPTION: 'Full Stack Engineer & AI Automation Specialist',
}));

vi.mock('@/lib/sections/seo.server', () => ({
  fetchSeoData: vi.fn().mockResolvedValue({
    siteTitle: 'Jhon Keneth Namias | Portfolio',
    siteDescription: 'Full Stack Engineer & AI Automation Specialist',
    canonicalUrl: 'https://namias.tech',
    ogImageUrl: '/og-image.png',
    twitterImageUrl: '/og-image.png',
    noindex: false,
    nofollow: false,
  }),
}));

import RootLayout from '@/app/layout';

describe('RootLayout', () => {
  it('returns an html element', async () => {
    const tree = await RootLayout({ children: <div>Child</div> });
    expect((tree as React.ReactElement).type).toBe('html');
  });

  it('renders children inside the layout', async () => {
    const tree = await RootLayout({ children: <div data-testid="child">Child</div> });
    render(tree as React.ReactElement);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('includes skip-to-main-content link', async () => {
    const tree = await RootLayout({ children: <div>Child</div> });
    render(tree as React.ReactElement);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('includes Providers wrapper', async () => {
    const tree = await RootLayout({ children: <div>Child</div> });
    render(tree as React.ReactElement);
    expect(screen.getByTestId('providers')).toBeInTheDocument();
  });

  it('includes FloatingHub and ScrollToTop', async () => {
    const tree = await RootLayout({ children: <div>Child</div> });
    render(tree as React.ReactElement);
    expect(screen.getByTestId('floating-hub')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
  });

  it('includes MagicCursor in test mode', async () => {
    const tree = await RootLayout({ children: <div>Child</div> });
    render(tree as React.ReactElement);
    expect(screen.getByTestId('magic-cursor')).toBeInTheDocument();
  });

  it('includes Analytics script in head', async () => {
    const tree = await RootLayout({ children: <div>Child</div> });
    render(tree as React.ReactElement);
    expect(screen.getByTestId('analytics-script')).toBeInTheDocument();
  });

  it('includes JSON-LD structured data', async () => {
    const tree = await RootLayout({ children: <div>Child</div> });
    render(tree as React.ReactElement);
    const jsonld = screen.getByTestId('jsonld');
    expect(jsonld).toBeInTheDocument();
    expect(jsonld.getAttribute('data-id')).toBe('layout-jsonld-test');
  });

  it('sets html lang attribute to en on the React element', async () => {
    const tree = await RootLayout({ children: <div>Child</div> }) as React.ReactElement;
    expect(tree.props.lang).toBe('en');
  });

  it('sets suppressHydrationWarning on the React element', async () => {
    const tree = await RootLayout({ children: <div>Child</div> }) as React.ReactElement;
    expect(tree.props.suppressHydrationWarning).toBe(true);
  });
});
