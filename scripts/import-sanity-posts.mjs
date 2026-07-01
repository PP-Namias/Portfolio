#!/usr/bin/env node
/**
 * Import Sanity Posts to Local MD Files
 *
 * One-time bootstrap script to pull all Sanity blog posts
 * into local Markdown files with YAML frontmatter.
 *
 * Usage:
 *   node scripts/import-sanity-posts.mjs
 *   node scripts/import-sanity-posts.mjs --force   # Overwrite existing files
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { portableTextToMarkdown } from './lib/portable-text-to-md.ts'

const SANITY_API_VERSION = 'v2024-01-01'
const CONTENT_DIR = path.resolve(process.cwd(), 'content/blog')
const FORCE = process.argv.includes('--force')

function getEnv(name, fallback) {
  const value = process.env[name]?.trim() || fallback
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

async function fetchAllPosts() {
  const projectId = getEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', process.env.SANITY_PROJECT_ID)
  const dataset = getEnv('NEXT_PUBLIC_SANITY_DATASET', process.env.SANITY_DATASET || 'production')
  const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN

  const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id, title, "slug": slug.current, excerpt, body, tags, publishedAt, publishAt,
    coverImagePath, featured, metaTitle, metaDescription, sourceId, published,
    "author": author->name, "categories": categories[]->title
  }`

  const url = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Sanity query error: ${res.status} ${await res.text()}`)
  return (await res.json()).result
}

function writePost(post) {
  const filename = `${post.slug}.md`
  const filePath = path.join(CONTENT_DIR, filename)

  if (fs.existsSync(filePath) && !FORCE) {
    return { status: 'skipped', slug: post.slug }
  }

  const frontmatter = {
    title: post.title || '',
    slug: post.slug,
    excerpt: post.excerpt || '',
    metaTitle: post.metaTitle || undefined,
    metaDescription: post.metaDescription || undefined,
    featured: post.featured || false,
    readTime: post.readTime || undefined,
    publishedAt: post.publishedAt || new Date().toISOString(),
    publishAt: post.publishAt || undefined,
    published: post.published || false,
    author: post.author || 'PP Namias',
    categories: post.categories || [],
    tags: post.tags || [],
    coverImage: post.coverImagePath || undefined,
    sourceId: post.sourceId || undefined,
  }

  const body = portableTextToMarkdown(post.body)
  const content = matter.stringify(body, frontmatter)

  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')

  return { status: FORCE && fs.existsSync(filePath) ? 'updated' : 'created', slug: post.slug }
}

async function main() {
  console.log('--- Import Sanity Posts to Local MD ---\n')

  if (FORCE) console.log('  [FORCE MODE] Existing files will be overwritten.\n')

  const posts = await fetchAllPosts()
  if (!posts?.length) {
    console.log('No posts found in Sanity.')
    return
  }

  console.log(`Found ${posts.length} posts in Sanity.\n`)

  const results = { created: 0, updated: 0, skipped: 0 }
  for (const post of posts) {
    const result = writePost(post)
    console.log(`  ${result.status.toUpperCase().padEnd(8)} ${result.slug}`)
    results[result.status]++
  }

  console.log(`\nDone! Created: ${results.created} | Updated: ${results.updated} | Skipped: ${results.skipped}`)
  console.log(`\nContent directory: ${CONTENT_DIR}`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
