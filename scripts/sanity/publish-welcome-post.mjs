import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'

const env = readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .filter((l) => l && !l.startsWith('#'))
  .reduce((a, l) => {
    const [k, ...v] = l.split('=')
    a[k.trim()] = v.join('=').trim()
    return a
  }, {})

const c = createClient({
  projectId: env.SANITY_STUDIO_PROJECT_ID,
  dataset: env.SANITY_STUDIO_DATASET,
  apiVersion: '2025-10-21',
  useCdn: false,
  token: env.SANITY_API_WRITE_TOKEN,
})

const result = await c
  .patch('post-hi-welcome-to-my-blog-portfolio')
  .set({published: true, publishedAt: new Date().toISOString()})
  .commit()

console.log(JSON.stringify({_id: result._id, published: result.published, publishedAt: result.publishedAt}, null, 2))
