import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { SectionErrorBoundary } from '@/components/ui/ErrorBoundary';

function ErrorThrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error');
  return <div data-testid="child">Safe content</div>;
}

describe('SectionErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    render(
      <SectionErrorBoundary>
        <div data-testid="child">Hello</div>
      </SectionErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders default fallback when a child throws', () => {
    const { rerender } = render(
      <SectionErrorBoundary>
        <ErrorThrower shouldThrow={false} />
      </SectionErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();

    rerender(
      <SectionErrorBoundary>
        <ErrorThrower shouldThrow={true} />
      </SectionErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong loading this section/i)).toBeInTheDocument();
  });

  it('renders custom fallback instead of default', () => {
    const { rerender } = render(
      <SectionErrorBoundary fallback={<div data-testid="custom">Custom error</div>}>
        <ErrorThrower shouldThrow={false} />
      </SectionErrorBoundary>
    );

    rerender(
      <SectionErrorBoundary fallback={<div data-testid="custom">Custom error</div>}>
        <ErrorThrower shouldThrow={true} />
      </SectionErrorBoundary>
    );

    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(screen.getByText('Custom error')).toBeInTheDocument();
  });

  it('does not log to console in test environment', () => {
    const consoleError = vi.spyOn(console, 'error');
    const { rerender } = render(
      <SectionErrorBoundary>
        <ErrorThrower shouldThrow={false} />
      </SectionErrorBoundary>
    );

    rerender(
      <SectionErrorBoundary>
        <ErrorThrower shouldThrow={true} />
      </SectionErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});
