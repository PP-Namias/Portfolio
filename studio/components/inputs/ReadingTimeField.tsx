import React from 'react'
import {set, type StringInputProps} from 'sanity'

import {countPortableTextWords, estimateReadingTime} from '../../utils/text'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ReadingTimeField(props: StringInputProps) {
  const {value, onChange} = props
  const document = (props as unknown as {document?: any}).document
  const body = document?.body ?? null
  const words = countPortableTextWords(body)
  const computed = words > 0 ? estimateReadingTime(body) : ''

  if (!computed) {
    return (
      <div
        style={{
          padding: '0.75rem 1rem',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.04)',
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        Add body content to compute reading time.
      </div>
    )
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
      <div
        style={{
          padding: '0.75rem 1rem',
          borderRadius: 8,
          background: 'linear-gradient(90deg, rgba(99,102,241,0.10), rgba(99,165,255,0.10))',
          fontSize: 14,
          fontWeight: 600,
          color: '#6366f1',
        }}
      >
        {computed} ({words} words)
      </div>
      <input
        aria-label="Computed reading time (read-only)"
        readOnly
        value={(value as string) || computed}
        onChange={(event) => onChange(set(event.target.value))}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 6,
          background: 'transparent',
          color: 'inherit',
        }}
      />
    </div>
  )
}
