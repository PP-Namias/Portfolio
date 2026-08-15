/**
 * Sanity Function: broken-refs
 *
 * Scheduled trigger (every 6 hours). Scans every document for references
 * to missing documents and patches a `brokenRefsCount` onto the parent
 * so the content health panel can surface it.
 *
 * Trigger: scheduled (cron `0 */6 * * *`)
 * Inputs: none
 * Outputs: {scanned, flagged, fixes: [{_id, brokenCount}]}
 */
import {createClient} from '@sanity/client'
import {scheduledEventHandler} from '@sanity/functions'

type DocRef = {_id: string; _type: string}

function collectRefs(node: unknown, refs: Set<string>): void {
  if (!node || typeof node !== 'object') {
    return
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      collectRefs(item, refs)
    }
    return
  }
  const obj = node as Record<string, unknown>
  if (typeof obj._ref === 'string') {
    refs.add(obj._ref)
  }
  for (const value of Object.values(obj)) {
    collectRefs(value, refs)
  }
}

export const handler = scheduledEventHandler(async ({context}) => {
  const client = createClient({
    ...context.clientOptions,
    useCdn: false,
    apiVersion: '2026-02-19',
  })

  const allDocs = await client.fetch<DocRef[]>(`*[_id != null]{_id, _type}`)
  const allIds = new Set(allDocs.map((d) => d._id))
  const fixes: {_id: string; brokenCount: number}[] = []

  for (const doc of allDocs) {
    const refs = new Set<string>()
    const raw = await client.fetch(doc._id)
    collectRefs(raw, refs)
    const broken = [...refs].filter((r) => !allIds.has(r.replace(/^drafts\./, '')))
    if (broken.length > 0) {
      fixes.push({_id: doc._id, brokenCount: broken.length})
    }
  }

  if (fixes.length === 0) {
    return {scanned: allDocs.length, flagged: 0}
  }

  const transaction = client.transaction()
  for (const fix of fixes) {
    transaction.patch(fix._id, {set: {brokenRefsCount: fix.brokenCount}})
  }
  await transaction.commit()

  return {scanned: allDocs.length, flagged: fixes.length, fixes}
})
