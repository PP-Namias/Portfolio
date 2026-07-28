import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SwrConfigProvider } from '@/lib/swr-config';

vi.mock('swr', () => ({
  SWRConfig: ({ value, children }: { value: Record<string, unknown>; children: React.ReactNode }) => (
    <div data-testid="swr-config" data-config={JSON.stringify(value)}>
      {children}
    </div>
  ),
}));

describe('SwrConfigProvider', () => {
  it('renders children', () => {
    render(
      <SwrConfigProvider>
        <div data-testid="child">content</div>
      </SwrConfigProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('wraps children in SWRConfig', () => {
    render(
      <SwrConfigProvider>
        <div>child</div>
      </SwrConfigProvider>
    );
    expect(screen.getByTestId('swr-config')).toBeInTheDocument();
  });

  it('provides SWR configuration with expected values', () => {
    render(
      <SwrConfigProvider>
        <div>child</div>
      </SwrConfigProvider>
    );
    const configEl = screen.getByTestId('swr-config');
    const config = JSON.parse(configEl.getAttribute('data-config')!);
    expect(config.dedupingInterval).toBe(5000);
    expect(config.revalidateIfStale).toBe(true);
    expect(config.revalidateOnFocus).toBe(false);
    expect(config.revalidateOnReconnect).toBe(true);
    expect(config.errorRetryCount).toBe(2);
    expect(config.errorRetryInterval).toBe(10000);
    expect(config.keepPreviousData).toBe(true);
  });
});
