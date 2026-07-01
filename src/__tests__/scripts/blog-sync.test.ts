import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import matter from 'gray-matter'

const TMP_DIR = path.join(os.tmpdir(), 'blog-sync-test')

beforeEach(() => {
  if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, { recursive: true })
  fs.mkdirSync(TMP_DIR, { recursive: true })
})

afterEach(() => {
  if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, { recursive: true })
})

function writeTestPost(slug: string, frontmatter: Record<string, unknown>, body: string) {
  const fp = path.join(TMP_DIR, `${slug}.md`)
  fs.writeFileSync(fp, matter.stringify(body, frontmatter), 'utf-8')
  return fp
}

describe('blog-sync file operations', () => {
  const sampleFm = {
    title: 'Test Post',
    slug: 'test-post',
    excerpt: 'A test post excerpt that is long enough.',
    publishedAt: '2026-07-02T00:00:00Z',
    published: false,
    author: 'PP Namias',
    tags: ['test'],
  }

  it('creates a local post file', () => {
    writeTestPost('my-post', sampleFm, 'Post body content.')
    const raw = fs.readFileSync(path.join(TMP_DIR, 'my-post.md'), 'utf-8')
    const { data, content } = matter(raw)
    expect(data.title).toBe('Test Post')
    expect(data.slug).toBe('test-post')
    expect(content.trim()).toBe('Post body content.')
  })

  it('lists all post files excluding README', () => {
    writeTestPost('post-a', { ...sampleFm, slug: 'post-a' }, 'Body A')
    writeTestPost('post-b', { ...sampleFm, slug: 'post-b' }, 'Body B')
    fs.writeFileSync(path.join(TMP_DIR, 'README.md'), '# Blog', 'utf-8')

    const files = fs.readdirSync(TMP_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md')
    expect(files).toHaveLength(2)
    expect(files).toContain('post-a.md')
    expect(files).toContain('post-b.md')
  })

  it('parses frontmatter correctly from written file', () => {
    writeTestPost(
      'parse-test',
      {
        ...sampleFm,
        featured: true,
        metaTitle: 'SEO Title',
        categories: ['Tech'],
      },
      'Content here'
    )

    const raw = fs.readFileSync(path.join(TMP_DIR, 'parse-test.md'), 'utf-8')
    const { data } = matter(raw)
    expect(data.featured).toBe(true)
    expect(data.metaTitle).toBe('SEO Title')
    expect(data.categories).toEqual(['Tech'])
  })

  it('preserves body content with markdown formatting', () => {
    const body = `# Heading

Some **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`js
const x = 1;
\`\`\`
`
    writeTestPost('md-test', sampleFm, body)
    const raw = fs.readFileSync(path.join(TMP_DIR, 'md-test.md'), 'utf-8')
    const { content } = matter(raw)
    expect(content).toContain('**bold**')
    expect(content).toContain('*italic*')
    expect(content).toContain('- List item 1')
    expect(content).toContain('```js')
  })

  it('overwrites existing file when writing', () => {
    writeTestPost('overwrite', sampleFm, 'Original content.')
    writeTestPost('overwrite', sampleFm, 'Updated content.')
    const raw = fs.readFileSync(path.join(TMP_DIR, 'overwrite.md'), 'utf-8')
    const { content } = matter(raw)
    expect(content.trim()).toBe('Updated content.')
  })

  it('detects published vs draft posts', () => {
    writeTestPost('published', { ...sampleFm, slug: 'published', published: true }, 'Live post')
    writeTestPost('draft', { ...sampleFm, slug: 'draft', published: false }, 'Draft post')

    const files = fs.readdirSync(TMP_DIR).filter((f) => f.endsWith('.md'))
    const statuses = files.map((f) => {
      const raw = fs.readFileSync(path.join(TMP_DIR, f), 'utf-8')
      const { data } = matter(raw)
      return { slug: data.slug, published: data.published }
    })

    expect(statuses.find((s) => s.slug === 'published')?.published).toBe(true)
    expect(statuses.find((s) => s.slug === 'draft')?.published).toBe(false)
  })
})
