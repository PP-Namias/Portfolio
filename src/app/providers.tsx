'use client';

import { ThemeProvider } from 'next-themes';
import { ReactLenis } from 'lenis/react';
import { AccentColorProvider } from '@/hooks/useAccentColor';
import { ModalProvider } from '@/hooks/useModal';
import React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AccentColorProvider>
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
            {children}
          </ReactLenis>
        </ModalProvider>
      </AccentColorProvider>
    </ThemeProvider>
  );
}
