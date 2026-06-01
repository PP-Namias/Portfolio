/**
 * Sanity Function: broken-refs
 *
 * Scans all documents for references to missing documents and surfaces a
 * 'brokenRefs' count on the parent document. Designed to be triggered on
 * a schedule (every 6h) or on document mutations.
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'nl0qw78w',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2025-10-21',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

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

export async function brokenRefs(_event: unknown) {
  const allDocs = await client.fetch<{_id: string; _type: string; refs: string[]}[]>(
    `*[]{ "_id": _id, "_type": _type, "refs": array::unique([].concat(*[_ref in [^.^]])) }`,
  )
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
}

export default brokenRefs
