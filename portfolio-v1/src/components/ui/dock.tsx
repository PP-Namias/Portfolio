'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DockProps {
  children: React.ReactNode
  className?: string
  magnification?: number
  distance?: number
}

interface DockItemProps {
  children: React.ReactNode
  className?: string
  mouseX: MotionValue<number>
  magnification?: number
  distance?: number
}

export function Dock({ children, className, magnification = 60, distance = 150 }: DockProps) {
  const mouseX = useMotionValue<number>(Infinity)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto flex items-end gap-2 rounded-2xl bg-card px-4 py-2 shadow-lg border',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export function DockItem({
  children,
  className,
  mouseX,
  magnification = 60,
  distance = 150,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const distanceCalc = useTransform(mouseX, (val: number) => {
    if (!ref.current) return 0
    const bounds = ref.current.getBoundingClientRect()
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distanceCalc, [-distance, 0, distance], [40, magnification, 40])

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <div ref={ref} className={cn('flex flex-col items-center', className)}>
      <motion.div
        style={{ width, height: width }}
        className="flex items-center justify-center rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
      >
        {children}
      </motion.div>
    </div>
  )
}
