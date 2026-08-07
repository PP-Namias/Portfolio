'use client'

import type { ReactNode } from 'react'
import { LenisInner } from './LenisInner'

export function LenisProvider({ children }: { children: ReactNode }) {
  return <LenisInner>{children}</LenisInner>
}
