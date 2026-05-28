'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export const SANITY_LIVE_REFRESH_INTERVAL_MS = 45_000;
const SANITY_REFRESH_PATHS = new Set(['/', '/blog']);
const MIN_REFRESH_GAP_MS = 5_000;

function shouldRefreshPath(pathname: string): boolean {
  return (
    SANITY_REFRESH_PATHS.has(pathname) ||
    pathname.startsWith('/blog/')
  );
}

export function useSanityLiveRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  const lastRefreshAtRef = useRef(0);

  useEffect(() => {
    // If router or pathname aren't available (e.g. during tests), skip live refresh.
    if (!router || !pathname || !shouldRefreshPath(pathname)) {
      return;
    }

    const triggerRefresh = () => {
      const now = Date.now();

      if (now - lastRefreshAtRef.current < MIN_REFRESH_GAP_MS) {
        return;
      }

      lastRefreshAtRef.current = now;
      router.refresh();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        triggerRefresh();
      }
    };

    const handleFocus = () => {
      triggerRefresh();
    };

    const intervalId = globalThis.setInterval(triggerRefresh, SANITY_LIVE_REFRESH_INTERVAL_MS);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    globalThis.addEventListener('focus', handleFocus);

    return () => {
      globalThis.clearInterval(intervalId as unknown as number);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      globalThis.removeEventListener('focus', handleFocus);
    };
  }, [pathname, router]);
}

export function SanityLiveRefreshBridge() {
  useSanityLiveRefresh();
  return null;
}
