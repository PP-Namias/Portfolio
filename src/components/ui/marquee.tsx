'use client'

import { cn } from '@/lib/utils'

interface MarqueeProps {
  className?: string
  children: React.ReactNode
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
}

export function Marquee({
  className,
  children,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
      style={
        {
          '--duration': '40s',
          '--gap': '1rem',
        } as React.CSSProperties
      }
    >
      {vertical ? (
        <div
          className={cn(
            'flex flex-col gap-[var(--gap)]',
            reverse ? 'animate-marquee-vertical-reverse' : 'animate-marquee-vertical'
          )}
        >
          {Array.from({ length: repeat }).map((_, i) => (
            <div key={i} className="flex flex-col gap-[var(--gap)]">
              {children}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div
            className={cn(
              'flex shrink-0 items-center justify-around gap-[var(--gap)]',
              reverse ? 'animate-marquee-reverse' : 'animate-marquee',
              pauseOnHover && 'group-hover:[animation-play-state:paused]'
            )}
          >
            {Array.from({ length: repeat }).map((_, i) => (
              <div key={i} className="flex items-center gap-[var(--gap)]">
                {children}
              </div>
            ))}
          </div>
          <div
            className={cn(
              'flex shrink-0 items-center justify-around gap-[var(--gap)]',
              reverse ? 'animate-marquee-reverse' : 'animate-marquee',
              pauseOnHover && 'group-hover:[animation-play-state:paused]'
            )}
            aria-hidden
          >
            {Array.from({ length: repeat }).map((_, i) => (
              <div key={i} className="flex items-center gap-[var(--gap)]">
                {children}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
