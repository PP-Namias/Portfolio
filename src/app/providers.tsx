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
              lerp: 0.1,
              duration: 1.2,
              smoothWheel: true,
            }}
          >
            {children}
          </ReactLenis>
        </ModalProvider>
      </AccentColorProvider>
    </ThemeProvider>
  );
}
