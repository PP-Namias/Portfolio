import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

describe('OfflineBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true, writable: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders nothing when online and never been offline', () => {
    const { container } = render(<OfflineBanner />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when offline (cached content is the wow moment)', () => {
    render(<OfflineBanner />);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows back online pill briefly after reconnection then hides', () => {
    render(<OfflineBanner />);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/back online/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2800);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
