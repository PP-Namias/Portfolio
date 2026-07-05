import { z } from 'zod'

export const frontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(300),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  featured: z.boolean().default(false),
  readTime: z.string().optional(),
  publishedAt: z.string().datetime({ message: 'publishedAt must be a valid ISO datetime' }),
  publishAt: z.string().datetime().optional(),
  published: z.boolean().default(false),
  author: z.string().min(1, 'Author is required'),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  coverImage: z.string().optional(),
  sourceId: z.string().optional(),
})

export type ValidatedFrontmatter = z.infer<typeof frontmatterSchema>

export function validateFrontmatter(data: unknown) {
  return frontmatterSchema.safeParse(data)
}

export function parseFrontmatter(raw: Record<string, unknown>) {
  return frontmatterSchema.safeParse(raw)
}
