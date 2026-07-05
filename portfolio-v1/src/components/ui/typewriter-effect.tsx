'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TypewriterEffectProps {
  words: string[]
  className?: string
  speed?: number
  deleteSpeed?: number
  pauseDuration?: number
}

export function TypewriterEffect({
  words,
  className,
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentWord.length) {
            setDisplayText(currentWord.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? deleteSpeed : speed
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex, words, speed, deleteSpeed, pauseDuration])

  return (
    <span className={cn(className)}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
