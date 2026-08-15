import { createClient } from '@sanity/client'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const studioRoot = resolve(__dirname, '..')
const repoRoot = resolve(studioRoot, '..')
const blogDir = resolve(repoRoot, 'content', 'blog')

dotenv.config({ path: resolve(repoRoot, '.env.local') })
dotenv.config({ path: resolve(studioRoot, '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nl0qw78w',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-02-19',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: content }

  const raw = match[1]
  const body = match[2].trim()
  const frontmatter = {}

  for (const line of raw.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    let key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()

    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    }

    if (value === 'true') value = true
    else if (value === 'false') value = false

    frontmatter[key] = value
  }

  return { frontmatter, body }
}

function mdToPortableText(md) {
  const blocks = []
  const lines = md.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({
        _type: 'block',
        style: 'normal',
        children: [{
          _type: 'span',
          text: codeLines.join('\n'),
          marks: ['code'],
        }],
      })
      i++
      continue
    }

    if (line.startsWith('## ')) {
      const text = line.slice(3).trim()
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text }],
      })
      i++
      continue
    }

    if (line.startsWith('### ')) {
      const text = line.slice(4).trim()
      blocks.push({
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text }],
      })
      i++
      continue
    }

    if (line.startsWith('> ')) {
      const text = line.slice(2).trim()
      blocks.push({
        _type: 'block',
        style: 'blockquote',
        children: [{ _type: 'span', text }],
      })
      i++
      continue
    }

    if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
      const listItems = []
      while (i < lines.length && (lines[i].match(/^[-*]\s/) || lines[i].match(/^\d+\.\s/))) {
        const itemText = lines[i].replace(/^[-*]\s|\d+\.\s/, '').trim()
        if (itemText) listItems.push(itemText)
        i++
      }
      if (listItems.length > 0) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          listItem: line.match(/^\d+\.\s/) ? 'number' : 'bullet',
          level: 1,
          children: [{ _type: 'span', text: listItems.join('; ') }],
        })
      }
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    if (line.startsWith('---')) {
      i++
      continue
    }

    const text = line.trim()
    if (text) {
      blocks.push({
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text }],
      })
    }
    i++
  }

  return blocks
}

function extractReadTime(readTimeStr) {
  if (!readTimeStr) return '5 min read'
  const match = readTimeStr.match(/\d+/)
  return match ? `${match[0]} min read` : '5 min read'
}

async function main() {
  if (!existsSync(blogDir)) {
    console.error('Blog directory not found:', blogDir)
    process.exit(1)
  }

  const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'))
  console.log(`Found ${files.length} blog post files\n`)

  for (const file of files) {
    const content = readFileSync(resolve(blogDir, file), 'utf8')
    const { frontmatter, body } = parseFrontmatter(content)

    if (!frontmatter.slug) {
      console.log(`  ⏭️  Skipping ${file} (no slug in frontmatter)`)
      continue
    }

    const slug = frontmatter.slug
    const title = frontmatter.title || slug
    const excerpt = frontmatter.excerpt || ''
    const publishedAt = frontmatter.publishedAt || new Date().toISOString()
    const readTime = extractReadTime(frontmatter.readTime)
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : []
    const featured = frontmatter.featured || false

    const bodyBlocks = body ? mdToPortableText(body) : []

    console.log(`  📝 Creating/updating: ${title}`)

    const existing = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{_id}`,
      { slug }
    )

    if (existing) {
      await client.patch(existing._id).set({
        title,
        excerpt,
        readTime,
        tags,
        featured,
        publishedAt,
        body: bodyBlocks,
      }).commit()
      console.log(`    ✅ Updated (${existing._id})`)
    } else {
      const doc = {
        _type: 'post',
        title,
        slug: { _type: 'slug', current: slug },
        excerpt,
        readTime,
        tags,
        featured,
        publishedAt,
        published: true,
        body: bodyBlocks,
      }
      const result = await client.create(doc)
      console.log(`    ✅ Created (${result._id})`)
    }
  }

  console.log('\nDone! All posts pushed to Sanity.')
}

main().catch((err) => {
  console.error('Script failed:', err)
  process.exit(1)
})
