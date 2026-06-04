'use client';

import type { SWRConfiguration } from 'swr';
import { SWRConfig } from 'swr';

const swrConfig: SWRConfiguration = {
  dedupingInterval: 5_000,
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 2,
  errorRetryInterval: 10_000,
  keepPreviousData: true,
};

export function SwrConfigProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
