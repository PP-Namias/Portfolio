import React from 'react'
import {set, type StringInputProps} from 'sanity'

import {formatDuration, parseDateLike} from '../../utils/text'

export function ExperienceDurationField(props: StringInputProps) {
  const {value, onChange} = props
  const document = (props as unknown as {document?: any}).document
  const startDate = document?.startDate ?? null
  const endDate = document?.endDate ?? null

  const start = parseDateLike(startDate)
  if (!start) {
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
        Add a start date to compute the duration.
      </div>
    )
  }

  const computed = formatDuration(startDate, endDate) || (value as string) || ''

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
      <div
        style={{
          padding: '0.75rem 1rem',
          borderRadius: 8,
          background: 'linear-gradient(90deg, rgba(255,99,165,0.10), rgba(99,102,241,0.10))',
          fontSize: 14,
          fontWeight: 600,
          color: '#ff63a5',
        }}
      >
        {computed || '—'}
      </div>
      <input
        aria-label="Computed duration (read-only)"
        readOnly
        value={computed}
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
