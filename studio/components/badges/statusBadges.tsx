import type {DocumentBadgeComponent} from 'sanity'

type Doc = {
  _updatedAt?: string
  _createdAt?: string
  publishedAt?: string
  publishAt?: string
  published?: boolean
  expiresAt?: string
  neverExpires?: boolean
  status?: string
  featured?: boolean
}

const STALE_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

function isStale(doc: Doc): boolean {
  const ts = doc._updatedAt || doc._createdAt
  if (!ts) return false
  const age = Date.now() - new Date(ts).getTime()
  return age > STALE_DAYS * DAY_MS
}

function isScheduled(doc: Doc): boolean {
  if (!doc.publishAt) return false
  return new Date(doc.publishAt).getTime() > Date.now()
}

function isExpiredSoon(doc: Doc): boolean {
  if (doc.neverExpires || !doc.expiresAt) return false
  const ms = new Date(doc.expiresAt).getTime() - Date.now()
  return ms > 0 && ms < 90 * DAY_MS
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function readDoc(props: any): Doc {
  return (props?.document ?? props) as Doc
}

export const draftBadge: DocumentBadgeComponent = (props) => {
  const doc = readDoc(props)
  if (doc.published) return null
  return {
    label: 'Draft',
    color: 'gray' as const,
    title: 'Document has not been published yet.',
  } as any
}

export const publishedBadge: DocumentBadgeComponent = (props) => {
  const doc = readDoc(props)
  if (!doc.published) return null
  return {
    label: 'Live',
    color: 'success' as const,
    title: 'Document is published and visible on the marketing site.',
  } as any
}

export const scheduledBadge: DocumentBadgeComponent = (props) => {
  const doc = readDoc(props)
  if (!isScheduled(doc)) return null
  return {
    label: `Scheduled ${new Date(doc.publishAt as string).toLocaleDateString()}`,
    color: 'primary' as const,
    title: 'Will publish automatically at the scheduled time.',
  } as any
}

export const staleBadge: DocumentBadgeComponent = (props) => {
  const doc = readDoc(props)
  if (!isStale(doc)) return null
  return {
    label: 'Stale',
    color: 'warning' as const,
    title: 'Document has not been updated in 30+ days. Review and refresh.',
  } as any
}

export const expiringSoonBadge: DocumentBadgeComponent = (props) => {
  const doc = readDoc(props)
  if (!isExpiredSoon(doc)) return null
  return {
    label: 'Expiring soon',
    color: 'danger' as const,
    title: 'Certification expires within 90 days. Renew or update before it lapses.',
  } as any
}

export const featuredBadge: DocumentBadgeComponent = (props) => {
  const doc = readDoc(props)
  if (!doc.featured) return null
  return {
    label: 'Featured',
    color: 'primary' as const,
    title: 'Document is featured on the marketing site.',
  } as any
}

export const studioBadges: DocumentBadgeComponent[] = [
  draftBadge,
  publishedBadge,
  scheduledBadge,
  staleBadge,
  expiringSoonBadge,
  featuredBadge,
]
