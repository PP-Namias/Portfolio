'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const DEFAULT_SANITY_LIVE_POLL_MS = 15_000;
const SANITY_REFRESH_PATHS = new Set(['/', '/blog', '/projects']);
const MIN_REFRESH_GAP_MS = 5_000;

const SANITY_LIVE_POLL_MS = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_SANITY_LIVE_POLL_MS);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : DEFAULT_SANITY_LIVE_POLL_MS;
})();

function shouldRefreshPath(pathname: string): boolean {
  return (
    SANITY_REFRESH_PATHS.has(pathname) ||
    pathname.startsWith('/blog/') ||
    pathname.startsWith('/projects/')
  );
}

interface LiveStatus {
  ok?: boolean;
  version?: number;
  draftMode?: boolean;
  pollIntervalMs?: number;
  revalidatePaths?: string[];
}

export function useSanityLiveRefresh() {
  const lastRefreshAtRef = useRef(0);
  const lastVersionRef = useRef<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !shouldRefreshPath(pathname)) {
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

    const checkVersion = async () => {
      try {
        const res = await fetch('/api/sanity/live', { cache: 'no-store' });
        if (!res.ok) {
          return;
        }
        const status = (await res.json()) as LiveStatus;
        if (status.draftMode) {
          return;
        }
        if (
          typeof status.version === 'number' &&
          lastVersionRef.current !== null &&
          status.version !== lastVersionRef.current
        ) {
          triggerRefresh();
        }
        if (typeof status.version === 'number') {
          lastVersionRef.current = status.version;
        }
      } catch {
        // Network or parse failure — retry on the next poll cycle.
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkVersion();
      }
    };

    const handleFocus = () => {
      void checkVersion();
    };

    void checkVersion();

    const intervalId = globalThis.setInterval(() => {
      void checkVersion();
    }, SANITY_LIVE_POLL_MS);

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