'use client'

import { cn } from '@/lib/utils'
import React, { useRef, useEffect } from 'react'
import { useMouseEnter } from './3d-card'

export const CardItem = ({
  as: Tag = 'div',
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType
  children: React.ReactNode
  className?: string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
  [key: string]: unknown
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isMouseEntered] = useMouseEnter()

  const handleAnimations = () => {
    if (!ref.current) return
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally re-runs on hover state only
  useEffect(() => {
    handleAnimations()
  }, [isMouseEntered])

  return (
    <Tag
      ref={ref}
      className={cn('w-fit transition-transform duration-200 ease-linear', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
