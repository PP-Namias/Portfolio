'use client';

import React, {createContext, useContext} from 'react';

import { fallbackCmsContent, type CmsContent } from '@/lib/cms-content.shared';

const CmsContentContext = createContext<CmsContent | null>(null);

export function CmsContentProvider({children, value}: Readonly<{children: React.ReactNode; value: CmsContent}>) {
  return <CmsContentContext.Provider value={value}>{children}</CmsContentContext.Provider>;
}

export function useCmsContent(): CmsContent {
  return useContext(CmsContentContext) ?? fallbackCmsContent;
}
