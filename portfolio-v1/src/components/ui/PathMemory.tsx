'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { PATH_MEMORY_KEY } from '@/lib/path-memory'

export function PathMemory() {
  const pathname = usePathname()
  const prevRef = useRef<string | null>(null)

  useEffect(() => {
    if (prevRef.current !== null && prevRef.current !== pathname) {
      try {
        sessionStorage.setItem(PATH_MEMORY_KEY, prevRef.current)
      } catch {}
    }
    prevRef.current = pathname
  }, [pathname])

  return null
}
