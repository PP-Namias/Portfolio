/**
 * Sanity Function: scheduled-publish
 *
 * Triggers: scheduled (_scheduledAt in document mutation payload)
 *
 * This file is a deployable Sanity Function. It runs server-side on the
 * Sanity platform whenever a document mutation is scheduled. It promotes
 * any post or project whose publishAt is in the past.
 *
 * Deploy:
 *   cd functions/scheduled-publish
 *   npx sanity functions deploy scheduled-publish
 */
import {createClient} from '@sanity/client'

type ScheduledDoc = {
  _id: string
  _type: string
  publishAt?: string
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'nl0qw78w',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2025-10-21',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function scheduledPublish(_event: unknown) {
  const now = new Date().toISOString()
  const query = `*[_type in ["post", "project"] && defined(publishAt) && publishAt <= $now && published != true]`
  const docs = await client.fetch<ScheduledDoc[]>(query, {now})
  if (docs.length === 0) {
    return {promoted: 0}
  }

  const transaction = client.transaction()
  for (const doc of docs) {
    transaction.patch(doc._id, {set: {published: true, publishedAt: now}})
  }
  await transaction.commit()

  return {promoted: docs.length, ids: docs.map((d) => d._id)}
}

export default scheduledPublish
