'use client'

import { useEffect } from 'react'

export function usePerformance(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    let renderCount = 0

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          renderCount++
          const renderTime = entry.duration
          if (renderTime > 16) {
            console.warn(`[Performance] ${componentName}: Slow render (${renderTime.toFixed(2)}ms)`)
          }
        }
      }
    })

    observer.observe({ entryTypes: ['measure'] })

    return () => {
      observer.disconnect()
    }
  }, [componentName])
}
