'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SparklesProps {
  className?: string
  count?: number
  color?: string
  minSize?: number
  maxSize?: number
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function Sparkles({
  className,
  count = 20,
  color = '#ec4899',
  minSize = 1,
  maxSize = 3,
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    const sparkles = Array.from({ length: count }, (_, i) => ({
      x: seededRandom(i * 2) * canvas.offsetWidth,
      y: seededRandom(i * 2 + 1) * canvas.offsetHeight,
      size: seededRandom(i * 3) * (maxSize - minSize) + minSize,
      opacity: seededRandom(i * 4),
      twinkleSpeed: seededRandom(i * 5) * 0.02 + 0.01,
      phase: seededRandom(i * 6) * Math.PI * 2,
    }))

    const draw = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.clearRect(0, 0, width, height)

      sparkles.forEach((sparkle) => {
        sparkle.phase += sparkle.twinkleSpeed
        sparkle.opacity = ((Math.sin(sparkle.phase) + 1) / 2) * 0.8 + 0.2

        ctx.beginPath()
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = sparkle.opacity
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [count, color, minSize, maxSize])

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
