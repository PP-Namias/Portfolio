import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { CmsContentProvider, useCmsContent } from '@/hooks/useCmsContent';
import { fallbackCmsContent } from '@/lib/cms-content.shared';

function TestConsumer() {
  const content = useCmsContent();
  return <div data-testid="content">{content.profile.name ?? 'no-name'}</div>;
}

describe('useCmsContent', () => {
  it('returns fallback content when no provider is present', () => {
    render(<TestConsumer />);
    expect(screen.getByTestId('content')).toHaveTextContent(
      fallbackCmsContent.profile.name
    );
  });

  it('returns provided content when wrapped in CmsContentProvider', () => {
    const customContent = {
      ...fallbackCmsContent,
      profile: { ...fallbackCmsContent.profile, name: 'Custom Name' },
    };
    render(
      <CmsContentProvider value={customContent}>
        <TestConsumer />
      </CmsContentProvider>
    );
    expect(screen.getByTestId('content')).toHaveTextContent('Custom Name');
  });

  it('uses useMemo on the provider value', () => {
    const content = { ...fallbackCmsContent };
    const { rerender } = render(
      <CmsContentProvider value={content}>
        <TestConsumer />
      </CmsContentProvider>
    );
    expect(screen.getByTestId('content')).toHaveTextContent(
      fallbackCmsContent.profile.name
    );
    rerender(
      <CmsContentProvider value={content}>
        <TestConsumer />
      </CmsContentProvider>
    );
  });

  it('provides full CmsContent shape from provider', () => {
    render(
      <CmsContentProvider value={fallbackCmsContent}>
        <TestConsumer />
      </CmsContentProvider>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
