'use client'

import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  span?: 'default' | 'col-span-2' | 'row-span-2' | 'col-span-2-row-span-2'
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn('grid w-full grid-cols-1 md:grid-cols-3 gap-4', className)}>{children}</div>
  )
}

export function BentoCard({ children, className, span = 'default' }: BentoCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-accent-pink/50',
        span === 'col-span-2' && 'md:col-span-2',
        span === 'row-span-2' && 'md:row-span-2',
        span === 'col-span-2-row-span-2' && 'md:col-span-2 md:row-span-2',
        className
      )}
    >
      {children}
    </div>
  )
}
