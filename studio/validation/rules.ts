import type {Rule, ValidationContext} from 'sanity'

type ValidatorFactory = (options?: Record<string, unknown>) => (rule: Rule) => Rule

export const headlineLength: ValidatorFactory = (options = {}) => {
  const min = (options.min as number) ?? 10
  const max = (options.max as number) ?? 90
  return (rule) =>
    rule
      .min(min)
      .max(max)
      .warning(`Recommended headline length is ${min}-${max} characters for SEO and hero presentation.`)
}

export const httpsOnly = (rule: Rule) =>
  rule
    .uri({scheme: ['https']})
    .warning('Live URLs should use https:// for security and SEO.')

export const dateOrder =
  (earlierField: string) =>
  (rule: Rule, context: ValidationContext) => {
    const document = context.document as Record<string, unknown> | undefined
    const earlier = document?.[earlierField]
    if (typeof earlier === 'string' && typeof context.value === 'string') {
      if (new Date(earlier) > new Date(context.value)) {
        return 'Issue date must be before expiry.'
      }
    }
    return true
  }

export const uniqueSlug = (rule: Rule) =>
  rule
    .required()
    .custom(async (value, context) => {
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

export const requireAltText = (rule: Rule) =>
  rule
    .custom((value, context) => {
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
  return (rule) => rule.required().min(min).max(max)
}

export const summaryLength: ValidatorFactory = (options = {}) => {
  const min = (options.min as number) ?? 40
  const max = (options.max as number) ?? 280
  return (rule) =>
    rule
      .min(min)
      .max(max)
      .warning(`Summaries between ${min} and ${max} characters perform best in social cards and meta tags.`)
}
