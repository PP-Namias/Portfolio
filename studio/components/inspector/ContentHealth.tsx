import React, {useEffect, useMemo, useState} from 'react'
import {useFormValue} from 'sanity'

type Doc = Record<string, unknown>

const WORD_RANGES: Record<string, {min: number; max: number; label: string}> = {
  heroSection: {min: 30, max: 90, label: 'Headline length'},
  aboutSection: {min: 60, max: 600, label: 'About body length'},
  project: {min: 60, max: 320, label: 'Summary length'},
  experience: {min: 100, max: 500, label: 'Description length'},
  certification: {min: 20, max: 200, label: 'Title + description length'},
  post: {min: 200, max: 4000, label: 'Body length'},
  profile: {min: 50, max: 300, label: 'Summary length'},
}

const REQUIRED_FIELDS: Record<string, string[]> = {
  profile: ['fullName', 'title', 'email'],
  project: ['title', 'slug', 'summary'],
  experience: ['role', 'company', 'startDate'],
  certification: ['title', 'issuer'],
  post: ['title', 'slug', 'body'],
  category: ['title', 'slug'],
}

function wordCount(value: unknown): number {
  if (typeof value === 'string') {
    return value.trim().split(/\s+/).filter(Boolean).length
  }
  if (Array.isArray(value)) {
    return value.reduce<number>((acc, block) => {
      if (block && typeof block === 'object' && Array.isArray((block as {children?: unknown[]}).children)) {
        for (const child of (block as {children: unknown[]}).children) {
          if (child && typeof child === 'object' && typeof (child as {text?: unknown}).text === 'string') {
            return acc + String((child as {text: string}).text).trim().split(/\s+/).filter(Boolean).length
          }
        }
      }
      return acc
    }, 0)
  }
  return 0
}

function countImagesWithoutAlt(value: unknown): number {
  if (!Array.isArray(value)) {
    return 0
  }
  let count = 0
  for (const item of value) {
    if (item && typeof item === 'object') {
      const alt = (item as {alt?: unknown}).alt
      if (typeof alt !== 'string' || alt.trim().length < 4) {
        count += 1
      }
    }
  }
  return count
}

function getReferenceTypes(value: unknown): {broken: number; total: number} {
  if (!Array.isArray(value)) {
    return {broken: 0, total: 0}
  }
  let broken = 0
  let total = 0
  for (const ref of value) {
    if (ref && typeof ref === 'object') {
      total += 1
      if (!('_ref' in ref) || !('_type' in ref)) {
        broken += 1
      }
    }
  }
  return {broken, total}
}

function calculateCompleteness(values: Doc, typeName: string): {score: number; missing: string[]} {
  const required = REQUIRED_FIELDS[typeName] || []
  const missing: string[] = []
  let filled = 0

  for (const field of required) {
    const value = values[field]
    if (value !== undefined && value !== null && value !== '') {
      filled++
    } else {
      missing.push(field)
    }
  }

  const score = required.length > 0 ? Math.round((filled / required.length) * 100) : 100
  return {score, missing}
}

export function ContentHealth() {
  const rawFormValues = useFormValue([])
  const rawValues = useMemo(() => rawFormValues || {}, [rawFormValues])
  const values = useMemo(() => rawValues as Doc, [rawValues])
  const typeName = (values._type as string) || 'unknown'

  const completeness = useMemo(() => calculateCompleteness(values, typeName), [typeName, values])

  const wordMetric = useMemo(() => {
    const range = WORD_RANGES[typeName as keyof typeof WORD_RANGES]
    if (!range) {
      return null
    }
    const candidateFields = ['summary', 'aboutContent', 'body', 'title', 'description', 'excerpt']
    let total = 0
    for (const field of candidateFields) {
      total += wordCount(values[field])
    }
    const within = total >= range.min && total <= range.max
    return {range, total, within}
  }, [typeName, values])

  const altMetric = useMemo(() => {
    const images = values.images || values.gallery || values.image ? [values.image] : []
    return {missing: countImagesWithoutAlt(images.filter(Boolean))}
  }, [values])

  const refMetric = useMemo(() => {
    const candidateFields = ['categories', 'author', 'issuer', 'category', 'references']
    let total = {broken: 0, total: 0}
    for (const field of candidateFields) {
      const v = values[field]
      if (Array.isArray(v) || (v && typeof v === 'object')) {
        const r = getReferenceTypes(Array.isArray(v) ? v : [v])
        total = {broken: total.broken + r.broken, total: total.total + r.total}
      }
    }
    return total
  }, [values])

  const lastEdited = values._updatedAt as string | undefined
  const [ageDays, setAgeDays] = useState<number | null>(null)
  useEffect(() => {
    if (!lastEdited) {
      setAgeDays(null)
      return
    }
    setAgeDays(
      Math.floor((Date.now() - new Date(lastEdited).getTime()) / (1000 * 60 * 60 * 24)),
    )
  }, [lastEdited])

  const scoreColor = completeness.score >= 80 ? '#166534' : completeness.score >= 50 ? '#92400e' : '#991b1b'
  const scoreBg = completeness.score >= 80 ? 'rgba(34,197,94,0.12)' : completeness.score >= 50 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'

  return (
    <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13}}>
      <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', letterSpacing: 0.5}}>
        Content health
      </div>

      {/* Completeness Score */}
      <div style={{padding: 16, borderRadius: 10, background: scoreBg, color: scoreColor}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
          <span style={{fontWeight: 600}}>Completeness</span>
          <span style={{fontSize: 24, fontWeight: 700}}>{completeness.score}%</span>
        </div>
        {completeness.missing.length > 0 && (
          <div style={{fontSize: 12, opacity: 0.85}}>
            Missing: {completeness.missing.join(', ')}
          </div>
        )}
      </div>

      {wordMetric ? (
        <Stat
          label={wordMetric.range.label}
          value={`${wordMetric.total} words`}
          status={wordMetric.within ? 'ok' : 'warn'}
          hint={`Recommended ${wordMetric.range.min}-${wordMetric.range.max}`}
        />
      ) : null}

      <Stat
        label="Images without alt text"
        value={`${altMetric.missing}`}
        status={altMetric.missing === 0 ? 'ok' : 'error'}
        hint={altMetric.missing === 0 ? 'All images have descriptive alt text.' : 'Add alt text to each image for accessibility.'}
      />

      <Stat
        label="References"
        value={`${refMetric.total - refMetric.broken}/${refMetric.total} healthy`}
        status={refMetric.broken === 0 ? 'ok' : 'error'}
        hint={refMetric.broken === 0 ? 'All references resolve.' : `${refMetric.broken} reference(s) cannot be resolved.`}
      />

      <Stat
        label="Last edited"
        value={ageDays == null ? 'Never' : `${ageDays} day${ageDays === 1 ? '' : 's'} ago`}
        status={ageDays == null ? 'warn' : ageDays > 30 ? 'warn' : 'ok'}
        hint={ageDays != null && ageDays > 30 ? 'Consider a refresh to keep content current.' : 'Recently edited.'}
      />
    </div>
  )
}

function Stat({label, value, status, hint}: {label: string; value: string; status: 'ok' | 'warn' | 'error'; hint?: string}) {
  const palette: Record<typeof status, {bg: string; color: string; icon: string}> = {
    ok: {bg: 'rgba(34,197,94,0.12)', color: '#166534', icon: '✓'},
    warn: {bg: 'rgba(245,158,11,0.12)', color: '#92400e', icon: '!'},
    error: {bg: 'rgba(239,68,68,0.12)', color: '#991b1b', icon: '✕'},
  }
  const p = palette[status]
  return (
    <div style={{padding: 12, borderRadius: 10, background: p.bg, color: p.color}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={{fontWeight: 600}}>{label}</span>
        <span style={{fontSize: 16}}>{p.icon} {value}</span>
      </div>
      {hint ? <div style={{fontSize: 12, marginTop: 4, opacity: 0.85}}>{hint}</div> : null}
    </div>
  )
}
