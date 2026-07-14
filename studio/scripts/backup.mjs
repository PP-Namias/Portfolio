#!/usr/bin/env node

/**
 * Backup all Sanity content to JSON files.
 * 
 * Usage:
 *   node scripts/backup.mjs
 * 
 * Output:
 *   data/backup/YYYY-MM-DD/
 *     - documents.json
 *     - assets.json
 *     - schema.json
 */

import {createClient} from '@sanity/client'
import {mkdirSync, writeFileSync} from 'fs'
import {join} from 'path'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset) {
  console.error('Error: Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET')
  process.exit(1)
}

if (!token) {
  console.error('Error: Missing SANITY_API_READ_TOKEN')
  process.exit(1)
}

const client = createClient({projectId, dataset, token, apiVersion: '2024-01-01'})

async function backupDocuments() {
  console.log('Backing up documents...')
  const docs = await client.fetch('*[_type != "sanity.imageAsset" && _type != "sanity.fileAsset"]')
  console.log(`  Found ${docs.length} documents`)
  return docs
}

async function backupAssets() {
  console.log('Backing up assets...')
  const assets = await client.fetch('*[_type == "sanity.imageAsset" || _type == "sanity.fileAsset"]')
  console.log(`  Found ${assets.length} assets`)
  return assets
}

async function backupSchema() {
  console.log('Backing up schema...')
  const schema = await client.fetch('*[_type == "sanity.schemaPatch"]')
  console.log(`  Found ${schema.length} schema patches`)
  return schema
}

async function main() {
  const date = new Date().toISOString().split('T')[0]
  const backupDir = join(process.cwd(), 'data', 'backup', date)
  
  mkdirSync(backupDir, {recursive: true})
  
  const [documents, assets, schema] = await Promise.all([
    backupDocuments(),
    backupAssets(),
    backupSchema(),
  ])
  
  writeFileSync(join(backupDir, 'documents.json'), JSON.stringify(documents, null, 2))
  writeFileSync(join(backupDir, 'assets.json'), JSON.stringify(assets, null, 2))
  writeFileSync(join(backupDir, 'schema.json'), JSON.stringify(schema, null, 2))
  
  console.log(`\nBackup complete: ${backupDir}`)
  console.log(`  Documents: ${documents.length}`)
  console.log(`  Assets: ${assets.length}`)
  console.log(`  Schema patches: ${schema.length}`)
}

main().catch((err) => {
  console.error('Backup failed:', err)
  process.exit(1)
})
