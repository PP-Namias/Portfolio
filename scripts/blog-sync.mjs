#!/usr/bin/env node
/**
 * Blog Sync Script
 *
 * Bidirectional sync between local MD files and Sanity CMS.
 *
 * Usage:
 *   node scripts/blog-sync.mjs --pull          # Pull from Sanity to local
 *   node scripts/blog-sync.mjs --push          # Push local to Sanity (dry-run)
 *   node scripts/blog-sync.mjs --push --force  # Push with overwrite
 *   node scripts/blog-sync.mjs --diff          # Compare local vs Sanity
 *   node scripts/blog-sync.mjs --push --include-drafts  # Include unpublished posts
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const SANITY_API_VERSION = 'v2024-01-01'
const CONTENT_DIR = path.resolve(process.cwd(), 'content/blog')

function getEnv(name, fallback) {
  const value = process.env[name]?.trim() || fallback
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

function getSanityConfig() {
  return {
    projectId: getEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', process.env.SANITY_PROJECT_ID),
    dataset: getEnv('NEXT_PUBLIC_SANITY_DATASET', process.env.SANITY_DATASET || 'production'),
    token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  }
}

async function sanityQuery(query, params) {
  const { projectId, dataset, token } = getSanityConfig()
  let url = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  if (params) {
    const paramsEncoded = encodeURIComponent(JSON.stringify(params))
    url += `&*=${paramsEncoded}`
  }
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Sanity query error: ${res.status} ${await res.text()}`)
  return (await res.json()).result
}

async function sanityMutate(mutations) {
  const { projectId, dataset, token } = getSanityConfig()
  const url = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${dataset}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations }),
  })
  if (!res.ok) throw new Error(`Sanity mutation error: ${res.status} ${await res.text()}`)
  return res.json()
}

function listLocalPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md')
}

function parseLocalPost(filename) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data, body: content.trim(), filename }
}

function writeLocalPost(filename, frontmatter, body) {
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true })
  const content = matter.stringify(body, frontmatter)
  fs.writeFileSync(path.join(CONTENT_DIR, filename), content, 'utf-8')
}

function portableTextToMd(blocks) {
  if (!Array.isArray(blocks)) return ''
  const lines = []
  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue
    const text = (block.children || []).map((c) => c.text || '').join(' ').trim()
    if (!text) continue
    if (block.style === 'h1') lines.push(`# ${text}`)
    else if (block.style === 'h2') lines.push(`## ${text}`)
    else if (block.style === 'h3') lines.push(`### ${text}`)
    else lines.push(text)
    lines.push('')
  }
  return lines.join('\n').trim()
}

function mdToPortableText(md) {
  const lines = md.split('\n')
  const blocks = []
  for (const line of lines) {
    if (line.trim() === '') continue
    if (line.startsWith('```')) continue
    let style = 'normal'
    let text = line
    if (line.startsWith('### ')) { style = 'h3'; text = line.slice(4) }
    else if (line.startsWith('## ')) { style = 'h2'; text = line.slice(3) }
    else if (line.startsWith('# ')) { style = 'h1'; text = line.slice(2) }
    blocks.push({
      _type: 'block',
      _key: `k${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      style,
      children: [{ _type: 'span', _key: `s${Date.now().toString(36)}`, text }],
      markDefs: [],
    })
  }
  return blocks
}

function parseArgs() {
  const args = process.argv.slice(2)
  return {
    pull: args.includes('--pull'),
    push: args.includes('--push'),
    diff: args.includes('--diff'),
    force: args.includes('--force'),
    includeDrafts: args.includes('--include-drafts'),
    dryRun: args.includes('--dry-run') || (!args.includes('--push') && !args.includes('--pull') && !args.includes('--diff')),
  }
}

async function cmdDiff() {
  console.log('--- Diff: Local vs Sanity ---\n')
  const remotePosts = await sanityQuery('*[_type == "post" && defined(slug.current)]{ _id, "slug": slug.current, title, published, publishedAt, _updatedAt }')
  const remoteMap = new Map((remotePosts || []).map((p) => [p.slug, p]))
  const localFiles = listLocalPosts()

  for (const file of localFiles) {
    const { frontmatter } = parseLocalPost(file)
    const remote = remoteMap.get(frontmatter.slug)
    remoteMap.delete(frontmatter.slug)
    if (!remote) {
      console.log(`  NEW LOCAL  ${frontmatter.slug} (${frontmatter.published ? 'published' : 'draft'})`)
    } else if (remote._updatedAt > frontmatter.publishedAt) {
      console.log(`  MODIFIED   ${frontmatter.slug} (remote is newer)`)
    } else {
      console.log(`  IN-SYNC    ${frontmatter.slug}`)
    }
  }

  for (const [slug] of remoteMap) {
    console.log(`  NEW REMOTE ${slug}`)
  }

  console.log(`\nLocal: ${localFiles.length} files | Remote: ${(remotePosts || []).length} documents`)
}

async function cmdPull() {
  console.log('--- Pull: Sanity -> Local ---\n')
  const remotePosts = await sanityQuery(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      _id, title, "slug": slug.current, excerpt, body, tags, publishedAt, publishAt,
      coverImagePath, featured, metaTitle, metaDescription, sourceId, published,
      "author": author->name, "categories": categories[]->title
    }`
  )

  if (!remotePosts?.length) {
    console.log('No posts found in Sanity.')
    return
  }

  let created = 0, skipped = 0
  for (const post of remotePosts) {
    const filename = `${post.slug}.md`
    const filePath = path.join(CONTENT_DIR, filename)

    if (fs.existsSync(filePath) && !args.force) {
      console.log(`  SKIP ${post.slug} (local file exists)`)
      skipped++
      continue
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

    const body = portableTextToMd(post.body)
    writeLocalPost(filename, frontmatter, body)
    console.log(`  CREATE ${post.slug}`)
    created++
  }

  console.log(`\nCreated: ${created} | Skipped: ${skipped}`)
}

async function cmdPush() {
  console.log('--- Push: Local -> Sanity ---\n')
  if (args.dryRun) console.log('  [DRY RUN] No changes will be made.\n')

  const localFiles = listLocalPosts()
  let wouldCreate = 0, wouldUpdate = 0, skipped = 0

  for (const file of localFiles) {
    const { frontmatter, body } = parseLocalPost(file)

    if (!frontmatter.published && !args.includeDrafts) {
      console.log(`  SKIP ${frontmatter.slug} (draft, use --include-drafts)`)
      skipped++
      continue
    }

    const existing = await sanityQuery(
      '*[_type == "post" && slug.current == $slug][0]{ _id }',
      { slug: frontmatter.slug }
    )

    const doc = {
      _type: 'post',
      _id: `post-${frontmatter.slug}`,
      title: frontmatter.title,
      slug: { _type: 'slug', current: frontmatter.slug },
      excerpt: frontmatter.excerpt,
      body: mdToPortableText(body),
      tags: frontmatter.tags,
      publishedAt: frontmatter.publishedAt,
      publishAt: frontmatter.publishAt,
      featured: frontmatter.featured,
      metaTitle: frontmatter.metaTitle,
      metaDescription: frontmatter.metaDescription,
      coverImagePath: frontmatter.coverImage,
      sourceId: frontmatter.sourceId,
      published: frontmatter.published,
    }

    if (existing) {
      if (!args.dryRun) {
        await sanityMutate([{ patch: { id: existing._id, set: doc } }])
      }
      console.log(`  UPDATE ${frontmatter.slug}`)
      wouldUpdate++
    } else {
      if (!args.dryRun) {
        await sanityMutate([{ createOrReplace: doc }])
      }
      console.log(`  CREATE ${frontmatter.slug}`)
      wouldCreate++
    }
  }

  console.log(`\nWould create: ${wouldCreate} | Would update: ${wouldUpdate} | Skipped: ${skipped}`)
}

const args = parseArgs()

try {
  if (args.diff) await cmdDiff()
  else if (args.pull) await cmdPull()
  else if (args.push) await cmdPush()
  else {
    console.log('Usage: node scripts/blog-sync.mjs [--pull|--push|--diff] [--force] [--include-drafts] [--dry-run]')
  }
} catch (err) {
  console.error('Error:', err.message)
  process.exit(1)
}
