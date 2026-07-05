import { describe, it, expect } from 'vitest'
import { frontmatterSchema, validateFrontmatter } from '../../../scripts/lib/frontmatter-schema'

describe('frontmatterSchema', () => {
  const validFrontmatter = {
    title: 'My Blog Post',
    slug: 'my-blog-post',
    excerpt: 'A brief summary of this blog post that is long enough.',
    publishedAt: '2026-07-02T00:00:00Z',
    published: false,
    author: 'PP Namias',
    tags: ['webdev'],
  }

  it('accepts valid frontmatter', () => {
    const result = validateFrontmatter(validFrontmatter)
    expect(result.success).toBe(true)
  })

  it('rejects missing title', () => {
    const { title, ...noTitle } = validFrontmatter
    const result = validateFrontmatter(noTitle)
    expect(result.success).toBe(false)
  })

  it('rejects missing slug', () => {
    const { slug, ...noSlug } = validFrontmatter
    const result = validateFrontmatter(noSlug)
    expect(result.success).toBe(false)
  })

  it('rejects invalid slug format', () => {
    const result = validateFrontmatter({ ...validFrontmatter, slug: 'Invalid Slug!' })
    expect(result.success).toBe(false)
  })

  it('accepts slug with hyphens and numbers', () => {
    const result = validateFrontmatter({ ...validFrontmatter, slug: 'post-123-v2' })
    expect(result.success).toBe(true)
  })

  it('rejects short excerpt', () => {
    const result = validateFrontmatter({ ...validFrontmatter, excerpt: 'Short' })
    expect(result.success).toBe(false)
  })

  it('rejects missing publishedAt', () => {
    const { publishedAt, ...noDate } = validFrontmatter
    const result = validateFrontmatter(noDate)
    expect(result.success).toBe(false)
  })

  it('rejects invalid publishedAt format', () => {
    const result = validateFrontmatter({ ...validFrontmatter, publishedAt: 'not-a-date' })
    expect(result.success).toBe(false)
  })

  it('rejects missing author', () => {
    const { author, ...noAuthor } = validFrontmatter
    const result = validateFrontmatter(noAuthor)
    expect(result.success).toBe(false)
  })

  it('rejects empty tags array', () => {
    const result = validateFrontmatter({ ...validFrontmatter, tags: [] })
    expect(result.success).toBe(false)
  })

  it('rejects missing tags', () => {
    const { tags, ...noTags } = validFrontmatter
    const result = validateFrontmatter(noTags)
    expect(result.success).toBe(false)
  })

  it('defaults featured to false', () => {
    const result = validateFrontmatter(validFrontmatter)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.featured).toBe(false)
  })

  it('accepts optional fields', () => {
    const withOptional = {
      ...validFrontmatter,
      metaTitle: 'SEO Title',
      metaDescription: 'SEO description',
      featured: true,
      readTime: '5 min read',
      coverImage: '/images/cover.jpg',
      sourceId: 'ext-123',
    }
    const result = validateFrontmatter(withOptional)
    expect(result.success).toBe(true)
  })
})
