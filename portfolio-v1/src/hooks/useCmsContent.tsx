'use client';

import React, {createContext, useContext, useMemo} from 'react';

import {fallbackCmsContent, type CmsContent} from '@/lib/cms-content.shared';

const CmsContentContext = createContext<CmsContent | null>(null);

export function CmsContentProvider({children, value}: Readonly<{children: React.ReactNode; value: CmsContent}>) {
  const memoizedValue = useMemo(() => value, [value]);
  return <CmsContentContext.Provider value={memoizedValue}>{children}</CmsContentContext.Provider>;
}

export function useCmsContent(): CmsContent {
  return useContext(CmsContentContext) ?? fallbackCmsContent;
}
