import { act, render } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const refreshMock = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

import {
  SANITY_LIVE_REFRESH_INTERVAL_MS,
  useSanityLiveRefresh,
} from '@/hooks/useSanityLiveRefresh';

function TestHarness() {
  useSanityLiveRefresh();
  return <div />;
}

describe('useSanityLiveRefresh', () => {
  beforeEach(() => {
    refreshMock.mockClear();
    vi.useFakeTimers();
  });

  it('refreshes the route on the polling interval', () => {
    act(() => {
      render(<TestHarness />);
    });

    expect(refreshMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(SANITY_LIVE_REFRESH_INTERVAL_MS);
    });

    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it('refreshes when the tab regains focus', () => {
    act(() => {
      render(<TestHarness />);
    });

    act(() => {
      window.dispatchEvent(new Event('focus'));
    });

    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
