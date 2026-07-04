'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface BackgroundBeamsProps {
  className?: string
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
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

    const accentRgb =
      getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() ||
      '236 72 153'

    const beams = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      speed: 0.5 + Math.random() * 1,
      angle: Math.random() * Math.PI * 2,
      length: 100 + Math.random() * 200,
    }))

    const draw = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.clearRect(0, 0, width, height)

      beams.forEach((beam) => {
        beam.angle += 0.01
        beam.x += Math.cos(beam.angle) * beam.speed
        beam.y += Math.sin(beam.angle) * beam.speed

        if (beam.x < -beam.length) beam.x = width + beam.length
        if (beam.x > width + beam.length) beam.x = -beam.length
        if (beam.y < -beam.length) beam.y = height + beam.length
        if (beam.y > height + beam.length) beam.y = -beam.length

        const gradient = ctx.createLinearGradient(
          beam.x,
          beam.y,
          beam.x + Math.cos(beam.angle) * beam.length,
          beam.y + Math.sin(beam.angle) * beam.length
        )
        gradient.addColorStop(0, `rgba(${accentRgb}, 0)`)
        gradient.addColorStop(0.5, `rgba(${accentRgb}, 0.3)`)
        gradient.addColorStop(1, `rgba(${accentRgb}, 0)`)

        ctx.beginPath()
        ctx.moveTo(beam.x, beam.y)
        ctx.lineTo(
          beam.x + Math.cos(beam.angle) * beam.length,
          beam.y + Math.sin(beam.angle) * beam.length
        )
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.5 }}
        aria-hidden="true"
      />
    </div>
  )
}
