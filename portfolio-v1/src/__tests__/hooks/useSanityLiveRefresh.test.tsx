import { act, render } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const refreshMock = vi.fn();
const mocks = vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS = '300';
  return { pathname: '/' };
});

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

import { useSanityLiveRefresh } from '@/hooks/useSanityLiveRefresh';

const POLL_MS = 300;

function liveResponse(version: number, draftMode = false): Response {
  return new Response(
    JSON.stringify({
      ok: true,
      version,
      draftMode,
      pollIntervalMs: POLL_MS,
      revalidatePaths: ['/'],
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
}

function TestHarness() {
  useSanityLiveRefresh();
  return <div />;
}

function setLiveVersion(version: number, draftMode = false): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async () => liveResponse(version, draftMode));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('useSanityLiveRefresh', () => {
  beforeEach(() => {
    refreshMock.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('seeds the baseline version on mount without refreshing', async () => {
    setLiveVersion(1);

    act(() => {
      render(<TestHarness />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('does not refresh while the version is unchanged', async () => {
    setLiveVersion(1);

    act(() => {
      render(<TestHarness />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      vi.advanceTimersByTime(POLL_MS);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('refreshes exactly once when the version changes', async () => {
    setLiveVersion(1);

    act(() => {
      render(<TestHarness />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    setLiveVersion(2);
    act(() => {
      vi.advanceTimersByTime(POLL_MS);
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(refreshMock).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(POLL_MS);
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it('respects the minimum refresh gap between refreshes', async () => {
    setLiveVersion(1);

    act(() => {
      render(<TestHarness />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    setLiveVersion(2);
    act(() => {
      vi.advanceTimersByTime(POLL_MS);
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(refreshMock).toHaveBeenCalledTimes(1);

    setLiveVersion(3);
    act(() => {
      vi.advanceTimersByTime(POLL_MS);
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(refreshMock).toHaveBeenCalledTimes(1);

    setLiveVersion(4);
    act(() => {
      vi.advanceTimersByTime(6_000);
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(refreshMock).toHaveBeenCalledTimes(2);
  });

  it('checks for changes when the tab regains focus', async () => {
    setLiveVersion(1);

    act(() => {
      render(<TestHarness />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    setLiveVersion(2);
    act(() => {
      window.dispatchEvent(new Event('focus'));
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it('does not refresh when draft mode is active', async () => {
    setLiveVersion(1);

    act(() => {
      render(<TestHarness />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    setLiveVersion(2, true);
    act(() => {
      vi.advanceTimersByTime(POLL_MS);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('does not poll on non-CMS paths', async () => {
    mocks.pathname = '/contact';
    const fetchMock = setLiveVersion(1);

    act(() => {
      render(<TestHarness />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      vi.advanceTimersByTime(POLL_MS);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
