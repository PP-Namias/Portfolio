'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useSWR from 'swr';

const DEFAULT_SANITY_LIVE_POLL_MS = 15_000;
const SANITY_REFRESH_PATHS = new Set(['/', '/blog', '/projects']);
const MIN_REFRESH_GAP_MS = 5_000;
const LIVE_URL = '/api/sanity/live';

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

async function fetchLiveStatus(url: string): Promise<LiveStatus> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`sanity live endpoint returned ${res.status}`);
  }
  return (await res.json()) as LiveStatus;
}

export function useSanityLiveRefresh() {
  const lastRefreshAtRef = useRef(0);
  const lastVersionRef = useRef<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const enabled = !!pathname && shouldRefreshPath(pathname);

  const { mutate } = useSWR(enabled ? LIVE_URL : null, fetchLiveStatus, {
    dedupingInterval: 0,
    revalidateOnFocus: false,
    refreshInterval: enabled ? SANITY_LIVE_POLL_MS : 0,
    onSuccess: (status) => {
      if (!status || status.draftMode) {
        return;
      }
      if (
        typeof status.version === 'number' &&
        lastVersionRef.current !== null &&
        status.version !== lastVersionRef.current
      ) {
        const now = Date.now();
        if (now - lastRefreshAtRef.current >= MIN_REFRESH_GAP_MS) {
          lastRefreshAtRef.current = now;
          router.refresh();
        }
      }
      if (typeof status.version === 'number') {
        lastVersionRef.current = status.version;
      }
    },
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void mutate();
      }
    };
    const handleFocus = () => {
      void mutate();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    globalThis.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      globalThis.removeEventListener('focus', handleFocus);
    };
  }, [enabled, mutate]);
}

export function SanityLiveRefreshBridge() {
  useSanityLiveRefresh();
  return null;
}
