'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const INTERVAL_MS = 30
const ITERATION_STEP = 1 / 3

type HackedTextProps = {
  text: string
  className?: string
  charset?: string
}

export const HackedText = ({ text, className, charset = LETTERS }: HackedTextProps) => {
  const [displayText, setDisplayText] = useState<string>(text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const runHack = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }

    let iteration = 0

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }
            if (letter === ' ') {
              return ' '
            }
            return charset[Math.floor(Math.random() * charset.length)]
          })
          .join('')
      )

      if (iteration >= text.length) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }

      iteration += ITERATION_STEP
    }, INTERVAL_MS)
  }, [text, charset])

  useEffect(() => {
    runHack()
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [runHack])

  return (
    <span
      className={cn('cursor-default', className)}
      data-value={text}
      onMouseOver={runHack}
      onFocus={runHack}
      tabIndex={0}
      role="button"
      aria-label={text}
    >
      {displayText}
    </span>
  )
}
