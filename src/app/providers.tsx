'use client';

import { ThemeProvider } from 'next-themes';
import { ReactLenis } from 'lenis/react';
import { AccentColorProvider } from '@/hooks/useAccentColor';
import { ModalProvider } from '@/hooks/useModal';
import { CmsContentProvider } from '@/hooks/useCmsContent';
import { SanityLiveRefreshBridge } from '@/hooks/useSanityLiveRefresh';
import type { CmsContent } from '@/lib/cms-content.shared';
import React from 'react';

interface ProvidersProps {
  readonly children: React.ReactNode;
  readonly cmsContent: CmsContent;
}

export function Providers({ children, cmsContent }: ProvidersProps) {
  const showLiveRefreshBridge = process.env.NODE_ENV !== 'test';

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AccentColorProvider>
        <CmsContentProvider value={cmsContent}>
          <ModalProvider>
            <ReactLenis
              root
              options={{
                lerp: 0.12,
                duration: 1.2,
                smoothWheel: true,
                touchMultiplier: 1.5,
                wheelMultiplier: 1,
              }}
            >
              {showLiveRefreshBridge ? <SanityLiveRefreshBridge /> : null}
              {children}
            </ReactLenis>
          </ModalProvider>
        </CmsContentProvider>
      </AccentColorProvider>
    </ThemeProvider>
  );
}
