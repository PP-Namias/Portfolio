'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface GlobeProps {
  className?: string
  markers?: Array<{
    lat: number
    lng: number
    label?: string
  }>
}

export function Globe({ className, markers = [] }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let rotation = 0

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) / 2 - 20

      ctx.clearRect(0, 0, width, height)

      // Draw globe outline
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw latitude lines
      for (let i = -60; i <= 60; i += 30) {
        const y = centerY + (i / 90) * radius
        const lineWidth = Math.cos((i * Math.PI) / 180) * radius
        ctx.beginPath()
        ctx.ellipse(centerX, y, lineWidth, 5, 0, 0, Math.PI * 2)
        ctx.strokeStyle = '#1e293b'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Draw longitude lines
      for (let i = 0; i < 360; i += 30) {
        const angle = ((i + rotation) * Math.PI) / 180
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, Math.abs(Math.cos(angle)) * radius, radius, 0, 0, Math.PI * 2)
        ctx.strokeStyle = '#1e293b'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Draw markers
      markers.forEach((marker) => {
        const lat = (marker.lat * Math.PI) / 180
        const lng = ((marker.lng + rotation) * Math.PI) / 180
        const x = centerX + radius * Math.cos(lat) * Math.sin(lng)
        const y = centerY - radius * Math.sin(lat)

        if (Math.cos(lng) > 0) {
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          ctx.fillStyle = '#ec4899'
          ctx.fill()
        }
      })

      rotation += 0.2
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [markers])

  return (
    <div className={cn('relative', className)}>
      <canvas ref={canvasRef} width={300} height={300} className="w-full h-full" />
    </div>
  )
}
