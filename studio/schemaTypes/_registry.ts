import {defineField} from 'sanity'

const DOCUMENT_KINDS = ['singleton', 'collection', 'reference', 'object'] as const

export type DocumentKind = (typeof DOCUMENT_KINDS)[number]

export const DOCUMENT_KIND = {
  singleton: 'singleton',
  collection: 'collection',
  reference: 'reference',
  object: 'object',
} as const satisfies Record<DocumentKind, DocumentKind>

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  singleton: 'Singleton',
  collection: 'Collection',
  reference: 'Reference',
  object: 'Object',
}

export type DocumentMeta = {
  name: string
  title: string
  kind: DocumentKind
  description?: string
  previewable: boolean
}

export const DOCUMENT_META: readonly DocumentMeta[] = [
  {
    name: 'aboutSection',
    title: 'About Section',
    kind: 'singleton',
    previewable: true,
    description: 'About copy + education.',
  },
  {
    name: 'profile',
    title: 'Profile',
    kind: 'singleton',
    previewable: true,
    description: 'Hero, profile, and social links.',
  },
  {
    name: 'siteSettings',
    title: 'Site Settings',
    kind: 'singleton',
    previewable: true,
    description: 'Global site settings.',
  },
  {
    name: 'seoSettings',
    title: 'SEO Settings',
    kind: 'singleton',
    previewable: true,
    description: 'Default SEO copy and assets.',
  },
  {
    name: 'mediaSettings',
    title: 'Media Settings',
    kind: 'singleton',
    previewable: true,
    description: 'Media asset defaults.',
  },
  {
    name: 'techStack',
    title: 'Tech Stack',
    kind: 'singleton',
    previewable: true,
    description: 'Tech stack reference data.',
  },
  {
    name: 'resume',
    title: 'Resume',
    kind: 'singleton',
    previewable: false,
    description: 'Active resume file.',
  },
  {
    name: 'experience',
    title: 'Experience',
    kind: 'collection',
    previewable: true,
    description: 'Work history entries.',
  },
  {
    name: 'project',
    title: 'Project',
    kind: 'collection',
    previewable: true,
    description: 'Portfolio projects.',
  },
  {
    name: 'certification',
    title: 'Certification',
    kind: 'collection',
    previewable: true,
    description: 'Certifications and credentials.',
  },
  {
    name: 'galleryImage',
    title: 'Gallery Image',
    kind: 'collection',
    previewable: true,
    description: 'Photo and media gallery.',
  },
  {
    name: 'recommendation',
    title: 'Recommendation',
    kind: 'collection',
    previewable: false,
    description: 'Testimonials.',
  },
  {
    name: 'membership',
    title: 'Membership',
    kind: 'collection',
    previewable: true,
    description: 'Community memberships.',
  },
  {
    name: 'post',
    title: 'Blog Post',
    kind: 'collection',
    previewable: true,
    description: 'Blog posts and articles.',
  },
  {
    name: 'author',
    title: 'Author',
    kind: 'reference',
    previewable: false,
    description: 'Blog post authors.',
  },
  {
    name: 'category',
    title: 'Category',
    kind: 'reference',
    previewable: false,
    description: 'Blog post categories.',
  },
  {
    name: 'certificationCategory',
    title: 'Certification Category',
    kind: 'reference',
    previewable: false,
    description: 'Certification taxonomy.',
  },
  {
    name: 'certificationIssuer',
    title: 'Certification Issuer',
    kind: 'reference',
    previewable: false,
    description: 'Certification issuers.',
  },
  {
    name: 'galleryCategory',
    title: 'Gallery Category',
    kind: 'reference',
    previewable: false,
    description: 'Gallery taxonomy.',
  },
] as const

export const REFERENCEABLE_TYPES: readonly string[] = DOCUMENT_META.filter(
  (m) => m.kind === 'reference' || m.kind === 'singleton',
).map((m) => m.name)

export const COLLECTION_TYPES: readonly string[] = DOCUMENT_META.filter(
  (m) => m.kind === 'collection',
).map((m) => m.name)

export const SINGLETON_TYPES: readonly string[] = DOCUMENT_META.filter(
  (m) => m.kind === 'singleton',
).map((m) => m.name)

export const PREVIEWABLE_TYPES: readonly string[] = DOCUMENT_META.filter((m) => m.previewable).map(
  (m) => m.name,
)

export function getDocumentMeta(name: string): DocumentMeta | undefined {
  return DOCUMENT_META.find((m) => m.name === name)
}

export function isReferenceableType(name: string): boolean {
  return REFERENCEABLE_TYPES.includes(name)
}

const computedDurationField = defineField({
  name: 'computedDuration',
  title: 'Duration (auto)',
  type: 'string',
  readOnly: true,
  hidden: ({parent}) => !parent?.startDate,
  description: 'Auto-computed from startDate and endDate. Updates as you type.',
})

const computedReadingTimeField = defineField({
  name: 'computedReadingTime',
  title: 'Reading time (auto)',
  type: 'string',
  readOnly: true,
  hidden: ({parent}) => !parent?.body,
  description: 'Auto-computed from the post body word count.',
})

export const _registryInternals = {
  DOCUMENT_KINDS,
  computedDurationField,
  computedReadingTimeField,
}
