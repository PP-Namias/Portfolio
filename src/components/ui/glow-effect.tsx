'use client'

import { cn } from '@/lib/utils'

interface GlowEffectProps {
  className?: string
  color?: string
  size?: number
  blur?: number
}

export function GlowEffect({
  className,
  color = '#ec4899',
  size = 200,
  blur = 100,
}: GlowEffectProps) {
  return (
    <div
      className={cn('absolute pointer-events-none', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity: 0.3,
      }}
    />
  )
}
