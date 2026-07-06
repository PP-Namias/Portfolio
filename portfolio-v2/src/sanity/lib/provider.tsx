"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { CmsContent } from "@/sanity/lib/get-cms-content";
import { fallbackCmsContent } from "@/sanity/lib/fallback";

interface SanityDataContextValue {
  cms: CmsContent;
  isLoading: boolean;
}

const SanityDataContext = createContext<SanityDataContextValue>({
  cms: fallbackCmsContent,
  isLoading: false,
});

export function useSanityData() {
  return useContext(SanityDataContext);
}

interface SanityDataProviderProps {
  initialData?: CmsContent | null;
  children: React.ReactNode;
}

export function SanityDataProvider({
  initialData,
  children,
}: SanityDataProviderProps) {
  const [cms, setCms] = useState<CmsContent>(
    initialData ?? fallbackCmsContent
  );
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData) {
      fetch("/api/sanity/data")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setCms(data);
          }
        })
        .catch(() => {
          setCms(fallbackCmsContent);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialData]);

  return (
    <SanityDataContext.Provider value={{ cms, isLoading }}>
      {children}
    </SanityDataContext.Provider>
  );
}
