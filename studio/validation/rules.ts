import type {Rule, ValidationContext} from 'sanity'

type ValidatorFactory = (options?: Record<string, unknown>) => any
type RuleFactory = (rule: any) => any

export const headlineLength: ValidatorFactory = (options = {}) => {
  const min = (options.min as number) ?? 10
  const max = (options.max as number) ?? 90
  return (rule: Rule) =>
    rule
      .min(min)
      .max(max)
      .warning(
        `Recommended headline length is ${min}-${max} characters for SEO and hero presentation.`,
      )
}

export const httpsOnly: RuleFactory = (rule: Rule) =>
  rule
    .uri({scheme: ['https']})
    .warning('Live URLs should use https:// for security and SEO.')

export const dateOrder =
  (earlierField: string) =>
  (rule: any) =>
    rule.custom((value: unknown, context: ValidationContext) => {
      const document = context.document as Record<string, unknown> | undefined
      const earlier = document?.[earlierField]
      if (typeof earlier === 'string' && typeof value === 'string') {
        if (new Date(earlier) > new Date(value)) {
          return 'Issue date must be before expiry.'
        }
      }
      return true
    })

export const uniqueSlug: RuleFactory = (rule: Rule) =>
  rule
    .required()
    .custom(async (value: unknown) => {
      if (!value || typeof value !== 'object') {
        return 'Slug is required.'
      }
      const slug = (value as {current?: string}).current
      if (!slug) {
        return 'Slug cannot be empty.'
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return 'Use lowercase letters, numbers, and hyphens only.'
      }
      return true
    })

export const requireAltText: RuleFactory = (rule: Rule) =>
  rule
    .custom((value: unknown) => {
      if (value == null) {
        return true
      }
      const alt = (value as {alt?: unknown}).alt
      if (typeof alt !== 'string' || alt.trim().length < 4) {
        return 'Add descriptive alt text (4+ characters) for accessibility.'
      }
      return true
    })
    .warning()

export const requiredString: ValidatorFactory = (options = {}) => {
  const min = (options.min as number) ?? 2
  const max = (options.max as number) ?? 240
  return (rule: Rule) => rule.required().min(min).max(max)
}

export const summaryLength: ValidatorFactory = (options = {}) => {
  const min = (options.min as number) ?? 40
  const max = (options.max as number) ?? 280
  return (rule: Rule) =>
    rule
      .min(min)
      .max(max)
      .warning(
        `Summaries between ${min} and ${max} characters perform best in social cards and meta tags.`,
      )
}

// ─── New validation rules for EPIC-D ─────────────────────────

export const seoTitleLength: RuleFactory = (rule: Rule) =>
  rule
    .min(30)
    .max(60)
    .warning('SEO title should be 30-60 characters for optimal search display.')

export const seoDescriptionLength: RuleFactory = (rule: Rule) =>
  rule
    .min(120)
    .max(160)
    .warning('Meta description should be 120-160 characters for optimal search display.')

export const requiredForPublish: ValidatorFactory = (options = {}) => {
  const requiredFields = (options.fields as string[]) ?? []
  return (rule: any) =>
    rule.custom((value: unknown, context: ValidationContext) => {
      const document = context.document as Record<string, unknown> | undefined
      if (!document) return true

      const status = document.status as string | undefined
      if (status === 'completed' || status === 'in-progress') {
        const missing = requiredFields.filter((f) => !document[f])
        if (missing.length > 0) {
          return `Required for published projects: ${missing.join(', ')}`
        }
      }
      return true
    })
}

export const yearRange: RuleFactory = (rule: Rule) =>
  rule.min(2000).max(2100).integer().warning('Year should be between 2000 and 2100.')

export const maxArrayItems: ValidatorFactory = (options = {}) => {
  const max = (options.max as number) ?? 10
  return (rule: Rule) =>
    rule.max(max).warning(`Recommended maximum of ${max} items for this field.`)
}

export const uniqueTitle: ValidatorFactory = (options = {}) => {
  const schemaType = (options.schemaType as string) ?? ''
  return (rule: Rule) =>
    rule.custom(async (value: unknown, context: ValidationContext) => {
      if (!value || typeof value !== 'string') return true

      const document = context.document as {_id?: string} | undefined
      const documentId = document?._id
      if (!documentId) return true

      const {getClient} = context
      const client = getClient({apiVersion: '2024-01-01'})
      const slug = value.trim().toLowerCase()

      const query = `count(*[_type == $schemaType && lower(trim(title)) == $slug && !(_id in [$draftId, $publishedId])]) > 0`
      const draftId = `drafts.${documentId}`
      const publishedId = documentId.replace('drafts.', '')

      const exists = await client.fetch(query, {
        schemaType,
        slug,
        draftId,
        publishedId,
      })

      if (exists) {
        return `A ${schemaType} with this title already exists. Use a unique title.`
      }
      return true
    })
}
