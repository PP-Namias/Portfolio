import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SectionErrorBoundary } from '@/components/ui/ErrorBoundary';

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error');
  return <div>Child content</div>;
}

describe('SectionErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <SectionErrorBoundary>
        <ThrowError shouldThrow={false} />
      </SectionErrorBoundary>
    );
    expect(screen.getByText('Child content')).toBeDefined();
  });

  it('renders default fallback when error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <SectionErrorBoundary>
        <ThrowError shouldThrow={true} />
      </SectionErrorBoundary>
    );
    expect(screen.getByText(/Something went wrong/)).toBeDefined();
    consoleSpy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <SectionErrorBoundary fallback={<div>Custom error UI</div>}>
        <ThrowError shouldThrow={true} />
      </SectionErrorBoundary>
    );
    expect(screen.getByText('Custom error UI')).toBeDefined();
    consoleSpy.mockRestore();
  });

  it('passes name to console.error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <SectionErrorBoundary name="TestSection">
        <ThrowError shouldThrow={true} />
      </SectionErrorBoundary>
    );
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
