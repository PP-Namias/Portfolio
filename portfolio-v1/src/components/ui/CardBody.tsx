'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const CardBody = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        'w-auto sm:w-[30rem] h-auto rounded-xl p-6 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]',
        className
      )}
    >
      {children}
    </div>
  )
}
