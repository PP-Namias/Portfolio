import { createClient } from '@sanity/client'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..', '..')
dotenv.config({ path: resolve(repoRoot, '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nl0qw78w',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-02-19',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const posts = await client.fetch(
  '*[_type == "post" && published == true && defined(slug.current)] | order(publishedAt desc){title,"slug":slug.current,excerpt,readTime,tags,publishedAt,featured,sourceId,published}'
)

console.log(JSON.stringify(posts, null, 2))
