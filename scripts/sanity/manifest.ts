export type SanitySourceKind = 'singleton' | 'collection' | 'taxonomy' | 'embedded'

export interface SanitySourceMapping {
  sourceFile: string
  targetModel: string
  kind: SanitySourceKind
  notes: string[]
}

export const phaseOneSanityManifest: SanitySourceMapping[] = [
  {
    sourceFile: 'profile (archived migration fixture)',
    targetModel: 'profile singleton document',
    kind: 'singleton',
    notes: [
      'Archived after the Sanity cutover.',
      'Preserves the existing summary, highlights, and education structure in Sanity only.',
    ],
  },
  {
    sourceFile: 'experiences (archived migration fixture)',
    targetModel: 'experience documents',
    kind: 'collection',
    notes: [
      'Archived after the Sanity cutover.',
      'Keep ordering stable for the timeline in Sanity.',
      'Preserve the experience images array for gallery-linked references in Sanity.',
    ],
  },
  {
    sourceFile: 'projects (archived migration fixture)',
    targetModel: 'project documents',
    kind: 'collection',
    notes: [
      'Archived after the Sanity cutover.',
      'Keep gallery and impact metrics intact in Sanity.',
      'Preserve category, role, featured rank, and status fields in Sanity.',
    ],
  },
  {
    sourceFile: 'certifications (archived migration fixture)',
    targetModel: 'certification documents with issuer/category references',
    kind: 'taxonomy',
    notes: [
      'Archived after the Sanity cutover.',
      'Normalize flat certification rows into referenced docs in Sanity.',
      'Preserve the original tag list alongside the first tag used for category lookup.',
    ],
  },
  {
    sourceFile: 'gallery (archived migration fixture)',
    targetModel: 'galleryImage documents with galleryCategory references',
    kind: 'taxonomy',
    notes: [
      'Archived after the Sanity cutover.',
      'URL-encode media filenames with spaces in Sanity.',
      'Preserve mediaType, tags, and source media path for each gallery item.',
    ],
  },
  {
    sourceFile: 'technologies (archived migration fixture)',
    targetModel: 'techStack singleton document',
    kind: 'singleton',
    notes: ['Archived after the Sanity cutover.', 'Preserve the full technologies array with logo and proficiency fields in Sanity.'],
  },
  {
    sourceFile: 'blog (archived migration fixture)',
    targetModel: 'post documents with author/category references',
    kind: 'taxonomy',
    notes: [
      'Archived after the Sanity cutover.',
      'Enforce slug uniqueness and publication status normalization in Sanity.',
      'Preserve source id, readTime, tags, and the cover image path alongside the generated asset.',
    ],
  },
  {
    sourceFile: 'socials (archived migration fixture)',
    targetModel: 'heroSection.socialLinks nested array',
    kind: 'embedded',
    notes: ['Archived after the Sanity cutover.', 'Keep social links nested under heroSection for Phase 1 in Sanity.'],
  },
  {
    sourceFile: 'memberships (archived migration fixture)',
    targetModel: 'membership documents',
    kind: 'collection',
    notes: ['Archived after the Sanity cutover.', 'Model memberships as editable documents for future expansion in Sanity.'],
  },
  {
    sourceFile: 'recommendations (archived migration fixture)',
    targetModel: 'recommendation documents',
    kind: 'collection',
    notes: [
      'Archived after the Sanity cutover.',
      'Keep the collection path ready for future real testimonials without changing the contract.',
    ],
  },
]

export const phaseOneMigrationTasks = [
  'Resolve canonical project and dataset values.',
  'Confirm schema ownership for each source file.',
  'Seed taxonomy/reference documents first.',
  'Import singleton documents second.',
  'Import collection documents last.',
  'Produce a dry-run report before any write step.',
]

export function summarizePhaseOneManifest(): string {
  return phaseOneSanityManifest
    .map((entry, index) => `${index + 1}. ${entry.sourceFile} -> ${entry.targetModel}`)
    .join('\n')
}
