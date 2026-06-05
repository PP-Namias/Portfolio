#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Flip `published: true` (and refresh `publishedAt`) on the
 * "My Experience as a Developer in 2026" post by Genrey O. Cristobal.
 *
 * Run with:
 *   node scripts/sanity/publish-genrey-experience-post.mjs
 *
 * Reads the write token from .env.local.
 * Idempotent: re-running refreshes `publishedAt` and keeps it published.
 */

import {readFileSync} from 'node:fs'
import {resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..', '..')

function loadEnvLocal() {
  const envPath = resolve(repoRoot, '.env.local')
  const text = readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    env[key] = value
  }
  return env
}

const env = loadEnvLocal()
const projectId =
  env.SANITY_STUDIO_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = env.SANITY_STUDIO_DATASET || env.NEXT_PUBLIC_SANITY_DATASET
const token = env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET / SANITY_API_WRITE_TOKEN in .env.local'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-10-21',
  useCdn: false,
  token,
})

const today = () => new Date().toISOString()

const POST_ID = 'post-my-experience-as-a-developer-in-2026'

async function run() {
  const patch = client
    .patch(POST_ID)
    .set({published: true, publishedAt: today()})
  const result = await patch.commit()
  console.log('Published Genrey post:', {
    post: POST_ID,
    published: result.published,
    publishedAt: result.publishedAt,
  })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
