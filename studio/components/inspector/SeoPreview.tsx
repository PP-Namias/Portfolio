import React, {useMemo} from 'react'
import {useDocumentPane, useFormValue} from 'sanity'

type SeoFields = {
  title?: string
  description?: string
  image?: unknown
  siteUrl?: string
}

const META_TITLE_LIMIT = 60
const META_DESC_LIMIT = 160
const WARN_TITLE_MIN = 30
const WARN_DESC_MIN = 70

function trim(value: unknown, max: number): string {
  if (typeof value !== 'string') {
    return ''
  }
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

function resolveImageUrl(image: unknown): string | null {
  if (!image || typeof image !== 'object') {
    return null
  }
  const candidate = (image as {asset?: {url?: string}}).asset?.url
  return typeof candidate === 'string' ? candidate : null
}

function getSiteUrl(): string {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/sanity-preview-origin=([^;]+)/)
    if (match) {
      return decodeURIComponent(match[1])
    }
  }
  return 'https://namias.tech'
}

export function SeoPreview() {
  const {documentId, documentType} = useDocumentPane() as {documentId?: string; documentType?: string}
  const values = (useFormValue([]) || {}) as Record<string, unknown>

  const seo: SeoFields = useMemo(() => {
    const v = values
    return {
      title: (v.seoTitle as string) || (v.title as string) || (v.fullName as string) || (v.name as string),
      description: (v.seoDescription as string) || (v.excerpt as string) || (v.summary as string),
      image: v.seoImage || v.ogImage || v.image || v.mainImage,
      siteUrl: getSiteUrl(),
    }
  }, [values])

  const titleLen = (seo.title || '').length
  const descLen = (seo.description || '').length
  const imageUrl = resolveImageUrl(seo.image)

  const issues: {label: string; tone: 'warn' | 'error'}[] = []
  if (!seo.title) {
    issues.push({label: 'Missing SEO title', tone: 'error'})
  } else if (titleLen < WARN_TITLE_MIN) {
    issues.push({label: `Title is short (${titleLen} chars; aim for ${WARN_TITLE_MIN}-${META_TITLE_LIMIT})`, tone: 'warn'})
  } else if (titleLen > META_TITLE_LIMIT) {
    issues.push({label: `Title exceeds ${META_TITLE_LIMIT} chars and will be truncated in search results.`, tone: 'warn'})
  }

  if (!seo.description) {
    issues.push({label: 'Missing meta description', tone: 'error'})
  } else if (descLen < WARN_DESC_MIN) {
    issues.push({label: `Description is short (${descLen} chars; aim for ${WARN_DESC_MIN}-${META_DESC_LIMIT})`, tone: 'warn'})
  } else if (descLen > META_DESC_LIMIT) {
    issues.push({label: `Description exceeds ${META_DESC_LIMIT} chars and will be truncated.`, tone: 'warn'})
  }

  if (!imageUrl) {
    issues.push({label: 'Missing social share image (1200x630 recommended).', tone: 'warn'})
  }

  return (
    <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 16, fontSize: 13}}>
      <div>
        <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.55)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5}}>
          Google SERP preview
        </div>
        <div style={{padding: 14, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, background: '#fff', color: '#1f1f1f'}}>
          <div style={{fontSize: 12, color: '#1a0dab'}}>{seo.siteUrl}</div>
          <div style={{fontSize: 18, color: '#1a0dab', lineHeight: 1.3, marginTop: 4}}>
            {trim(seo.title, META_TITLE_LIMIT) || 'Untitled'}
          </div>
          <div style={{fontSize: 13, color: '#4d5156', lineHeight: 1.5, marginTop: 4}}>
            {trim(seo.description, META_DESC_LIMIT) || 'No description set.'}
          </div>
        </div>
      </div>

      <div>
        <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.55)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5}}>
          Social card preview (1200x630)
        </div>
        <div style={{aspectRatio: '1200/630', background: '#0d0d0f', borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', padding: 24}}>
          {imageUrl ? (
            <img src={imageUrl} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            <div>
              <div style={{fontSize: 22, fontWeight: 700}}>{trim(seo.title, 80) || 'Untitled'}</div>
              <div style={{fontSize: 14, opacity: 0.7, marginTop: 8}}>{trim(seo.description, 140) || 'No description'}</div>
            </div>
          )}
        </div>
      </div>

      <div>
        <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.55)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5}}>
          Health
        </div>
        {issues.length === 0 ? (
          <div style={{padding: 10, borderRadius: 8, background: 'rgba(34,197,94,0.12)', color: '#166534', fontWeight: 600}}>
            All SEO signals look healthy.
          </div>
        ) : (
          <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6}}>
            {issues.map((issue) => (
              <li
                key={issue.label}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: issue.tone === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                  color: issue.tone === 'error' ? '#991b1b' : '#92400e',
                  fontWeight: 500,
                }}
              >
                {issue.tone === 'error' ? '✕' : '⚠'} {issue.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {documentId && documentType ? (
        <div style={{fontSize: 11, color: 'rgba(0,0,0,0.45)'}}>
          Document: {documentType}#{documentId}
        </div>
      ) : null}
    </div>
  )
}
