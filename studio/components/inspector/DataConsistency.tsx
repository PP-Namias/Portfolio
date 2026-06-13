import React, {useEffect, useState, useMemo} from 'react'
import {useFormValue, useClient} from 'sanity'

interface ConsistencyCheck {
  name: string
  status: 'pass' | 'warn' | 'fail'
  message: string
}

function extractReferences(value: unknown): {_ref: string; _type?: string}[] {
  const refs: {_ref: string; _type?: string}[] = []
  if (!value || typeof value !== 'object') return refs

  if (Array.isArray(value)) {
    for (const item of value) {
      refs.push(...extractReferences(item))
    }
  } else {
    const obj = value as Record<string, unknown>
    if ('_ref' in obj && typeof obj._ref === 'string') {
      refs.push({_ref: obj._ref, _type: obj._type as string | undefined})
    }
    for (const v of Object.values(obj)) {
      refs.push(...extractReferences(v))
    }
  }
  return refs
}

export function DataConsistency() {
  const values = (useFormValue([]) || {}) as Record<string, unknown>
  const client = useClient()
  const [checks, setChecks] = useState<ConsistencyCheck[]>([])
  const [loading, setLoading] = useState(true)

  const references = useMemo(() => extractReferences(values), [values])

  useEffect(() => {
    async function runChecks() {
      setLoading(true)
      const results: ConsistencyCheck[] = []

      // Check reference integrity
      const uniqueRefs = [...new Set(references.map((r) => r._ref))]
      for (const ref of uniqueRefs.slice(0, 20)) {
        try {
          const doc = await client.fetch(`*[_id == $id][0]{_id}`, {id: ref})
          if (!doc) {
            results.push({
              name: `Broken reference`,
              status: 'fail',
              message: `Reference "${ref}" does not resolve to any document`,
            })
          }
        } catch {
          results.push({
            name: `Reference check failed`,
            status: 'warn',
            message: `Could not verify reference "${ref}"`,
          })
        }
      }

      // Check required fields based on type
      const typeName = values._type as string
      const requiredFields: Record<string, string[]> = {
        project: ['title', 'slug', 'summary'],
        post: ['title', 'slug', 'body'],
        certification: ['title', 'issuer'],
        experience: ['role', 'company'],
      }

      const required = requiredFields[typeName] || []
      const missing = required.filter((f) => !values[f])
      if (missing.length > 0) {
        results.push({
          name: 'Missing required fields',
          status: 'fail',
          message: `Missing: ${missing.join(', ')}`,
        })
      } else if (required.length > 0) {
        results.push({
          name: 'Required fields',
          status: 'pass',
          message: `All ${required.length} required fields present`,
        })
      }

      // Check slug format
      const slug = values.slug as {current?: string} | undefined
      if (slug?.current) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)) {
          results.push({
            name: 'Slug format',
            status: 'fail',
            message: 'Slug contains invalid characters',
          })
        } else {
          results.push({
            name: 'Slug format',
            status: 'pass',
            message: 'Slug format is valid',
          })
        }
      }

      // Check image alt text
      const imageFields = ['image', 'mainImage', 'profileImage', 'ogImage']
      let imagesWithoutAlt = 0
      for (const field of imageFields) {
        const img = values[field] as {alt?: string} | undefined
        if (img && (!img.alt || img.alt.length < 4)) {
          imagesWithoutAlt++
        }
      }
      if (imagesWithoutAlt > 0) {
        results.push({
          name: 'Image alt text',
          status: 'warn',
          message: `${imagesWithoutAlt} image(s) missing alt text`,
        })
      }

      setChecks(results)
      setLoading(false)
    }

    runChecks()
  }, [values, references, client])

  const statusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <span style={{color: '#30bf78'}}>✓</span>
      case 'fail': return <span style={{color: '#f03e2f'}}>✕</span>
      default: return <span style={{color: '#eab917'}}>!</span>
    }
  }

  const statusBg = (status: string) => {
    switch (status) {
      case 'pass': return 'rgba(34,197,94,0.08)'
      case 'fail': return 'rgba(239,68,68,0.08)'
      default: return 'rgba(245,158,11,0.08)'
    }
  }

  return (
    <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13}}>
      <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', letterSpacing: 0.5}}>
        Data Consistency
      </div>

      {loading ? (
        <div style={{padding: 12, textAlign: 'center', color: 'rgba(0,0,0,0.5)'}}>
          Checking consistency...
        </div>
      ) : checks.length === 0 ? (
        <div style={{padding: 12, borderRadius: 8, background: 'rgba(34,197,94,0.08)', color: '#166534', fontWeight: 600}}>
          All consistency checks passed.
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {checks.map((check, i) => (
            <div
              key={i}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: statusBg(check.status),
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <span style={{fontSize: 14, marginTop: 1}}>{statusIcon(check.status)}</span>
              <div>
                <div style={{fontWeight: 600}}>{check.name}</div>
                <div style={{fontSize: 12, opacity: 0.8}}>{check.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{fontSize: 11, color: 'rgba(0,0,0,0.4)'}}>
        {references.length} reference(s) found in document
      </div>
    </div>
  )
}
