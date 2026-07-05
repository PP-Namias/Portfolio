import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const TMP_DIR = path.join(os.tmpdir(), 'blog-md-parser-test')

beforeEach(() => {
  if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, { recursive: true })
  fs.mkdirSync(TMP_DIR, { recursive: true })
})

afterEach(() => {
  if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, { recursive: true })
})

function writeTestFile(name: string, content: string) {
  const fp = path.join(TMP_DIR, name)
  fs.writeFileSync(fp, content, 'utf-8')
  return fp
}

describe('md-parser', () => {
  const sampleMd = `---
title: Test Post
slug: test-post
excerpt: This is a test post excerpt that is long enough.
publishedAt: "2026-07-02T00:00:00Z"
published: false
author: PP Namias
tags:
  - test
  - vitest
---

This is the body of the post.

## Section Two

More content here.
`

  it('parseMdFile extracts frontmatter and body', async () => {
    const fp = writeTestFile('test-post.md', sampleMd)
    const { parseMdFile } = await import('../../../scripts/lib/md-parser')
    const result = parseMdFile(fp)

    expect(result.frontmatter.title).toBe('Test Post')
    expect(result.frontmatter.slug).toBe('test-post')
    expect(result.frontmatter.published).toBe(false)
    expect(result.frontmatter.tags).toEqual(['test', 'vitest'])
    expect(result.body).toContain('This is the body')
    expect(result.body).toContain('## Section Two')
    expect(result.filePath).toBe(fp)
  })

  it('writeMdFile creates valid MD with frontmatter', async () => {
    const { writeMdFile } = await import('../../../scripts/lib/md-parser')
    const fp = path.join(TMP_DIR, 'written.md')
    const fm = {
      title: 'Written Post',
      slug: 'written-post',
      excerpt: 'A written post excerpt for testing purposes.',
      publishedAt: '2026-07-02T00:00:00Z',
      published: true,
      author: 'PP Namias',
      tags: ['written'],
    }

    writeMdFile(fp, fm, 'Written body content.')

    expect(fs.existsSync(fp)).toBe(true)
    const raw = fs.readFileSync(fp, 'utf-8')
    expect(raw).toContain('title: Written Post')
    expect(raw).toContain('Written body content.')
  })

  it('listMdFiles returns all .md files except README', async () => {
    writeTestFile(
      'post-a.md',
      '---\ntitle: A\nslug: a\nexcerpt: Excerpt for post A.\npublishedAt: "2026-07-02T00:00:00Z"\npublished: false\nauthor: PP Namias\ntags: [test]\n---\nBody A'
    )
    writeTestFile(
      'post-b.md',
      '---\ntitle: B\nslug: b\nexcerpt: Excerpt for post B.\npublishedAt: "2026-07-02T00:00:00Z"\npublished: false\nauthor: PP Namias\ntags: [test]\n---\nBody B'
    )
    writeTestFile('README.md', '# Blog')

    const { listMdFiles } = await import('../../../scripts/lib/md-parser')
    const files = listMdFiles(TMP_DIR)

    expect(files).toHaveLength(2)
    expect(files.every((f: string) => f.endsWith('.md'))).toBe(true)
    expect(files.every((f: string) => !f.includes('README'))).toBe(true)
  })

  it('listMdFiles returns empty array for nonexistent dir', async () => {
    const { listMdFiles } = await import('../../../scripts/lib/md-parser')
    const files = listMdFiles('/nonexistent/path')
    expect(files).toEqual([])
  })

  it('getSlugFromFilename extracts slug', async () => {
    const { getSlugFromFilename } = await import('../../../scripts/lib/md-parser')
    expect(getSlugFromFilename('my-post.md')).toBe('my-post')
    expect(getSlugFromFilename('README.md')).toBe('README')
  })

  it('getFilePathFromSlug returns correct path', async () => {
    const { getFilePathFromSlug } = await import('../../../scripts/lib/md-parser')
    const result = getFilePathFromSlug('hello-world', TMP_DIR)
    expect(result).toBe(path.join(TMP_DIR, 'hello-world.md'))
  })
})
