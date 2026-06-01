import type {DocumentBadgeComponent, DocumentBadgeDescription} from 'sanity'

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

export const draftBadge: DocumentBadgeComponent = (props) => {
  const doc = props.document as unknown as Doc
  if (doc.published) return null
  return {
    label: 'Draft',
    color: 'gray',
    title: 'Document has not been published yet.',
  }
}

export const publishedBadge: DocumentBadgeComponent = (props) => {
  const doc = props.document as unknown as Doc
  if (!doc.published) return null
  return {
    label: 'Live',
    color: 'green',
    title: 'Document is published and visible on the marketing site.',
  }
}

export const scheduledBadge: DocumentBadgeComponent = (props) => {
  const doc = props.document as unknown as Doc
  if (!isScheduled(doc)) return null
  return {
    label: `Scheduled ${new Date(doc.publishAt as string).toLocaleDateString()}`,
    color: 'blue',
    title: 'Will publish automatically at the scheduled time.',
  }
}

export const staleBadge: DocumentBadgeComponent = (props) => {
  const doc = props.document as unknown as Doc
  if (!isStale(doc)) return null
  return {
    label: 'Stale',
    color: 'amber',
    title: 'Document has not been updated in 30+ days. Review and refresh.',
  }
}

export const expiringSoonBadge: DocumentBadgeComponent = (props) => {
  const doc = props.document as unknown as Doc
  if (!isExpiredSoon(doc)) return null
  return {
    label: 'Expiring soon',
    color: 'red',
    title: 'Certification expires within 90 days. Renew or update before it lapses.',
  }
}

export const featuredBadge: DocumentBadgeComponent = (props) => {
  const doc = props.document as unknown as Doc
  if (!doc.featured) return null
  return {
    label: 'Featured',
    color: 'purple',
    title: 'Document is featured on the marketing site.',
  }
}

export const studioBadges: DocumentBadgeComponent[] = [
  draftBadge,
  publishedBadge,
  scheduledBadge,
  staleBadge,
  expiringSoonBadge,
  featuredBadge,
]

export type {DocumentBadgeDescription, Doc}
