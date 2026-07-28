import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@/hooks/useCmsContent', () => ({
  CmsContentProvider: ({ value, children }: { value: unknown; children: React.ReactNode }) => (
    <div data-testid="cms-provider" data-value={JSON.stringify((value as Record<string, unknown>)?.profile?.name ?? '')}>
      {children}
    </div>
  ),
  useCmsContent: () => null,
}));

import { SectionProvider } from '@/components/sections/SectionProvider';

describe('SectionProvider', () => {
  it('renders children', () => {
    render(<SectionProvider data={{}}><div data-testid="child">content</div></SectionProvider>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('wraps children in CmsContentProvider', () => {
    render(<SectionProvider data={{}}><div>child</div></SectionProvider>);
    expect(screen.getByTestId('cms-provider')).toBeInTheDocument();
  });

  it('merges partial profile data with defaults', () => {
    render(
      <SectionProvider data={{ profile: { name: 'John', title: 'Dev' } as any }}>
        <div>child</div>
      </SectionProvider>
    );
    const provider = screen.getByTestId('cms-provider');
    expect(provider.getAttribute('data-value')).toContain('John');
  });

  it('merges partial seoSettings with defaults', () => {
    const { container } = render(
      <SectionProvider data={{ seoSettings: { siteTitle: 'Custom Title' } as any }}>
        <div>child</div>
      </SectionProvider>
    );
    expect(container.querySelector('[data-testid="cms-provider"]')).toBeInTheDocument();
  });

  it('merges partial siteSettings with defaults', () => {
    render(
      <SectionProvider data={{ siteSettings: { footer: { leadText: 'Custom footer' } } as any }}>
        <div>child</div>
      </SectionProvider>
    );
    expect(screen.getByTestId('cms-provider')).toBeInTheDocument();
  });
});
