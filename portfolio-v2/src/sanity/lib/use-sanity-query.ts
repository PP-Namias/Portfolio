"use client";

import useSWR from "swr";
import type { CmsContent } from "@/sanity/lib/get-cms-content";

const fetcher = (url: string): Promise<CmsContent> =>
  fetch(url).then((res) => res.json() as Promise<CmsContent>);

export function useSanityQuery<T extends keyof CmsContent>(
  key: T
): {
  data: CmsContent[T] | undefined;
  error: Error | undefined;
  isLoading: boolean;
} {
  const { data, error, isLoading } = useSWR<CmsContent>(
    "/api/sanity/data",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data: data?.[key],
    error,
    isLoading,
  };
}
