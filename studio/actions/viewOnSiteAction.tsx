import {type DocumentActionComponent, type DocumentActionProps} from 'sanity'

import {getStudioEnvSnapshot} from '../env'

type ViewOnSite = {
  schemaType: string
  documentId: string
  publishedSlug?: string
}

const HOMEPAGE_TYPES = new Set([
  'heroSection',
  'aboutSection',
  'techStack',
  'profile',
  'siteSettings',
])

const TYPE_PATHS: Record<string, (slug?: string) => string> = {
  post: (slug) => (slug ? `/blog/${slug}` : '/blog'),
  project: (slug) => (slug ? `/projects/${slug}` : '/#projects'),
  certification: () => '/#certifications',
  experience: () => '/#experience',
  galleryImage: () => '/#gallery',
  membership: () => '/#memberships',
  recommendation: () => '/#recommendations',
  resume: () => '/#resume',
  author: () => '/blog',
  category: () => '/blog',
  certificationCategory: () => '/',
  certificationIssuer: () => '/',
  galleryCategory: () => '/',
}

function resolvePath({schemaType, documentId, publishedSlug}: ViewOnSite): string | null {
  if (HOMEPAGE_TYPES.has(schemaType)) return '/'
  const builder = TYPE_PATHS[schemaType]
  if (!builder) return null
  return builder(publishedSlug)
}

export const viewOnSiteAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {id, type, draft, published} = props as DocumentActionProps & {
    draft?: Record<string, unknown>
    published?: Record<string, unknown>
  }
  const slug = (() => {
    const candidate =
      (draft as {slug?: {current?: string}} | undefined)?.slug?.current ??
      (published as {slug?: {current?: string}} | undefined)?.slug?.current
    return candidate
  })()

  const path = resolvePath({schemaType: type, documentId: id, publishedSlug: slug})
  if (!path) return null

  const url = `${getStudioEnvSnapshot().siteUrl}${path}`

  return {
    label: 'View on site',
    icon: () => '↗',
    tooltip: `Open ${url} in a new tab`,
    onHandle: () => {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    },
  }
}
