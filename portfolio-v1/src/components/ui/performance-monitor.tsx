'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export function PerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          Sentry.addBreadcrumb({
            category: 'performance',
            message: `${entry.name}: ${entry.duration.toFixed(2)}ms`,
            level: entry.duration > 100 ? 'warning' : 'info',
          })
        }
      }
    })

    observer.observe({ entryTypes: ['measure'] })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
