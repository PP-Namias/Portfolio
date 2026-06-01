/**
 * Sanity Function: scheduled-publish
 *
 * Scheduled trigger (every 5 minutes). Promotes any `post` or `project`
 * whose `publishAt` is in the past by setting `published: true` and
 * stamping `publishedAt` with the current time.
 *
 * Trigger: scheduled (cron `*/5 * * * *`)
 * Inputs: none (queries the dataset)
 * Outputs: {promoted: number, ids: string[]}
 */
import {createClient} from '@sanity/client'
import {scheduledEventHandler} from '@sanity/functions'

type ScheduledDoc = {
  _id: string
  _type: string
  publishAt?: string
}

export const handler = scheduledEventHandler(async ({context}) => {
  const client = createClient({
    ...context.clientOptions,
    useCdn: false,
    apiVersion: '2026-02-19',
  })

  const now = new Date().toISOString()
  const query = `*[_type in ["post", "project"] && defined(publishAt) && publishAt <= $now && published != true]`
  const docs = await client.fetch<ScheduledDoc[]>(query, {now})

  if (docs.length === 0) {
    return {promoted: 0, ranAt: now}
  }

  const transaction = client.transaction()
  for (const doc of docs) {
    transaction.patch(doc._id, {set: {published: true, publishedAt: now}})
  }
  await transaction.commit()

  return {
    promoted: docs.length,
    ids: docs.map((d) => d._id),
    ranAt: now,
  }
})
