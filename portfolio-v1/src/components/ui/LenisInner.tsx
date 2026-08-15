'use client';

import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

export function LenisInner({ children }: { children: ReactNode }) {
  return (
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
  );
}
