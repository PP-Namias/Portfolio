'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedBeamProps {
  className?: string
  duration?: number
  delay?: number
}

export function AnimatedBeam({ className, duration = 2, delay = 0 }: AnimatedBeamProps) {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    const animate = () => {
      path.style.transition = `stroke-dashoffset ${duration}s ease-in-out ${delay}s`
      path.style.strokeDashoffset = '0'
    }

    animate()
  }, [duration, delay])

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d="M0,50 Q25,0 50,50 T100,50"
          fill="none"
          stroke="url(#beamGradient)"
          strokeWidth="0.5"
        />
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
