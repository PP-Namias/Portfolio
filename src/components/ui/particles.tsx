'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ParticlesProps {
  className?: string
  count?: number
  color?: string
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function Particles({ className, count = 50, color = '#ec4899' }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let animationId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    const resolvedColor =
      color === '#ec4899'
        ? `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '236 72 153'})`
        : color

    const particles = Array.from({ length: count }, (_, i) => ({
      x: seededRandom(i * 2) * canvas.offsetWidth,
      y: seededRandom(i * 2 + 1) * canvas.offsetHeight,
      vx: (seededRandom(i * 3) - 0.5) * 0.5,
      vy: (seededRandom(i * 4) - 0.5) * 0.5,
      size: seededRandom(i * 5) * 2 + 1,
      opacity: seededRandom(i * 6) * 0.5 + 0.2,
    }))

    const draw = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.clearRect(0, 0, width, height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = resolvedColor
        ctx.globalAlpha = particle.opacity
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
  }, [count, color])

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
    </div>
  )
}
