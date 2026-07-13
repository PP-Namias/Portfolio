'use client';

import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';

interface LenisWrapperProps {
  children: ReactNode;
}

const LenisWrapper: ComponentType<LenisWrapperProps> = dynamic(
  () => import('./LenisInner').then((mod) => mod.LenisInner),
  {
    ssr: false,
    loading: () => <>{null}</>,
  },
);

export function LenisProvider({ children }: { children: ReactNode }) {
  return <LenisWrapper>{children}</LenisWrapper>;
}
