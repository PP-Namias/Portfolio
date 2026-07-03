'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PerformanceMetrics {
  renderCount: number
  reRenderCount: number
  slowRenders: number
  averageRenderTime: number
}

export function PerformanceDashboard({ className }: { className?: string }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    reRenderCount: 0,
    slowRenders: 0,
    averageRenderTime: 0,
  })

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    let renderCount = 0
    let reRenderCount = 0
    let slowRenders = 0
    let totalRenderTime = 0

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          renderCount++
          totalRenderTime += entry.duration
          if (entry.duration > 16) {
            slowRenders++
          }
        }
        if (entry.entryType === 'navigation') {
          reRenderCount++
        }
      }
    })

    observer.observe({ entryTypes: ['measure', 'navigation'] })

    const interval = setInterval(() => {
      setMetrics({
        renderCount,
        reRenderCount,
        slowRenders,
        averageRenderTime: renderCount > 0 ? totalRenderTime / renderCount : 0,
      })
    }, 1000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className={cn('rounded-lg border bg-card p-4 shadow-sm', className)}>
      <h3 className="text-sm font-semibold mb-3">Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{metrics.renderCount}</div>
          <div className="text-xs text-muted-foreground">Renders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{metrics.reRenderCount}</div>
          <div className="text-xs text-muted-foreground">Re-renders</div>
        </div>
        <div className="text-center">
          <div
            className={cn(
              'text-2xl font-bold',
              metrics.slowRenders > 0 ? 'text-destructive' : 'text-primary'
            )}
          >
            {metrics.slowRenders}
          </div>
          <div className="text-xs text-muted-foreground">Slow Renders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {metrics.averageRenderTime.toFixed(1)}ms
          </div>
          <div className="text-xs text-muted-foreground">Avg Render Time</div>
        </div>
      </div>
    </div>
  )
}
