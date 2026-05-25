export type SanitySourceKind = 'singleton' | 'collection' | 'taxonomy' | 'embedded'

export interface SanitySourceMapping {
  sourceFile: string
  targetModel: string
  kind: SanitySourceKind
  notes: string[]
}

export const phaseOneSanityManifest: SanitySourceMapping[] = [
  {
    sourceFile: 'portfolio-resources/data/profile.json',
    targetModel: 'profile singleton document',
    kind: 'singleton',
    notes: [
      'Uses a dedicated singleton document for profile copy and education.',
      'Preserves the existing summary, highlights, and education structure.',
    ],
  },
  {
    sourceFile: 'portfolio-resources/data/experiences.json',
    targetModel: 'experience documents',
    kind: 'collection',
    notes: [
      'Normalize position/role naming during import.',
      'Keep ordering stable for the timeline.',
      'Preserve the experience images array for gallery-linked references.',
    ],
  },
  {
    sourceFile: 'portfolio-resources/data/projects.json',
    targetModel: 'project documents',
    kind: 'collection',
    notes: [
      'Preserve detailURL > liveURL > repositoryURL link precedence.',
      'Keep gallery and impact metrics intact.',
    ],
  },
  {
    sourceFile: 'portfolio-resources/data/certifications.json',
    targetModel: 'certification documents with issuer/category references',
    kind: 'taxonomy',
    notes: [
      'Seed issuer and category reference documents before certification import.',
      'Normalize flat certification rows into referenced docs.',
    ],
  },
  {
    sourceFile: 'portfolio-resources/data/gallery.json',
    targetModel: 'galleryImage documents with galleryCategory references',
    kind: 'taxonomy',
    notes: [
      'URL-encode media filenames with spaces.',
      'Preserve createdAt and alt text where available.',
    ],
  },
  {
    sourceFile: 'portfolio-resources/data/technologies.json',
    targetModel: 'techStack singleton document',
    kind: 'singleton',
    notes: ['Preserve the full technologies array with logo and proficiency fields.'],
  },
  {
    sourceFile: 'portfolio-resources/data/blog.json',
    targetModel: 'post documents with author/category references',
    kind: 'taxonomy',
    notes: ['Enforce slug uniqueness and publication status normalization.'],
  },
  {
    sourceFile: 'portfolio-resources/data/socials.json',
    targetModel: 'heroSection.socialLinks nested array',
    kind: 'embedded',
    notes: ['Keep social links nested under heroSection for Phase 1.'],
  },
  {
    sourceFile: 'portfolio-resources/data/memberships.json',
    targetModel: 'membership documents',
    kind: 'collection',
    notes: ['Model memberships as editable documents for future expansion.'],
  },
  {
    sourceFile: 'portfolio-resources/data/recommendations.json',
    targetModel: 'recommendation documents',
    kind: 'collection',
    notes: [
      'Source is currently empty, so the runner should report a deliberate no-op.',
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
