import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

vi.mock('@/hooks/useAccentColor', () => ({
  AccentColorProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="accent-provider">{children}</div>,
}));

vi.mock('@/hooks/useModal', () => ({
  ModalProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="modal-provider">{children}</div>,
}));

vi.mock('@/hooks/useCmsContent', () => ({
  CmsContentProvider: ({ children, value }: { children: React.ReactNode; value: unknown }) => (
    <div data-testid="cms-provider" data-value={JSON.stringify(value?.seoSettings?.siteTitle)}>{children}</div>
  ),
  useCmsContent: () => ({ profile: { name: '', title: '', email: '' }, hero: {}, socialLinks: [], experiences: [] }),
}));

vi.mock('@/lib/swr-config', () => ({
  SwrConfigProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="swr-provider">{children}</div>,
}));

vi.mock('@/components/ui/LenisProvider', () => ({
  LenisProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="lenis-provider">{children}</div>,
}));

import { Providers } from '@/app/providers';
import { fallbackCmsContent } from '@/lib/cms-content.shared';

describe('Providers', () => {
  it('renders children inside all provider wrappers', () => {
    render(<Providers><div data-testid="child">Content</div></Providers>);
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('accent-provider')).toBeInTheDocument();
    expect(screen.getByTestId('modal-provider')).toBeInTheDocument();
    expect(screen.getByTestId('cms-provider')).toBeInTheDocument();
    expect(screen.getByTestId('swr-provider')).toBeInTheDocument();
    expect(screen.getByTestId('lenis-provider')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('passes cmsContent to CmsContentProvider', () => {
    render(<Providers cmsContent={fallbackCmsContent}><div>Child</div></Providers>);
    const cms = screen.getByTestId('cms-provider');
    expect(cms.getAttribute('data-value')).toContain(fallbackCmsContent.seoSettings.siteTitle);
  });

  it('nests providers in correct order', () => {
    const { container } = render(<Providers><div>Child</div></Providers>);
    const theme = container.querySelector('[data-testid="theme-provider"]');
    const accent = theme?.querySelector('[data-testid="accent-provider"]');
    const modal = accent?.querySelector('[data-testid="modal-provider"]');
    const swr = modal?.querySelector('[data-testid="swr-provider"]');
    const lenis = swr?.querySelector('[data-testid="lenis-provider"]');
    expect(lenis).toBeInTheDocument();
    expect(lenis?.textContent).toBe('Child');
  });
});
