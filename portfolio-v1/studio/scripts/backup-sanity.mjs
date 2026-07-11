// scripts/backup-sanity.mjs
// Exports all documents from Sanity using GROQ queries

import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: 'nl0qw78w',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

const OUTPUT_DIR = './data/exports'

async function backup() {
  console.log('Starting Sanity backup...')
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, {recursive: true})
  }
  
  // Export all documents
  console.log('Exporting documents...')
  const docs = await client.fetch('*[_type != "sanity.imageAsset" && _type != "sanity.fileAsset"]')
  console.log(`Found ${docs.length} documents`)
  
  // Save documents
  const docsFile = path.join(OUTPUT_DIR, 'documents.json')
  fs.writeFileSync(docsFile, JSON.stringify(docs, null, 2))
  console.log(`Saved documents to ${docsFile}`)
  
  // Export singletons
  console.log('Exporting singletons...')
  const singletons = await client.fetch(`{
    "profile": *[_type == "profile"][0],
    "aboutSection": *[_type == "aboutSection"][0],
    "techStack": *[_type == "techStack"][0],
    "siteSettings": *[_type == "siteSettings"][0],
    "seoSettings": *[_type == "seoSettings"][0],
    "mediaSettings": *[_type == "mediaSettings"][0]
  }`)
  
  const singletonsFile = path.join(OUTPUT_DIR, 'singletons.json')
  fs.writeFileSync(singletonsFile, JSON.stringify(singletons, null, 2))
  console.log(`Saved singletons to ${singletonsFile}`)
  
  // Export collections
  console.log('Exporting collections...')
  const collections = await client.fetch(`{
    "projects": *[_type == "project"] | order(order asc),
    "experience": *[_type == "experience"] | order(startDate desc),
    "certifications": *[_type == "certification"] | order(issueDate desc),
    "posts": *[_type == "post"] | order(publishedAt desc),
    "authors": *[_type == "author"],
    "categories": *[_type == "category"],
    "memberships": *[_type == "membership"],
    "recommendations": *[_type == "recommendation"],
    "galleryImages": *[_type == "galleryImage"],
    "resumes": *[_type == "resume"],
    "certificationCategories": *[_type == "certificationCategory"],
    "certificationIssuers": *[_type == "certificationIssuer"],
    "galleryCategories": *[_type == "galleryCategory"]
  }`)
  
  const collectionsFile = path.join(OUTPUT_DIR, 'collections.json')
  fs.writeFileSync(collectionsFile, JSON.stringify(collections, null, 2))
  console.log(`Saved collections to ${collectionsFile}`)
  
  // Create metadata
  const metadata = {
    projectId: 'nl0qw78w',
    dataset: 'production',
    exportedAt: new Date().toISOString(),
    documentCount: docs.length,
    collections: Object.keys(collections).reduce((acc, key) => {
      acc[key] = Array.isArray(collections[key]) ? collections[key].length : 0
      return acc
    }, {}),
  }
  
  const metadataFile = path.join(OUTPUT_DIR, 'metadata.json')
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2))
  console.log(`Saved metadata to ${metadataFile}`)
  
  console.log('\nBackup complete!')
  console.log(`Documents: ${docsFile}`)
  console.log(`Singletons: ${singletonsFile}`)
  console.log(`Collections: ${collectionsFile}`)
  console.log(`Metadata: ${metadataFile}`)
}

backup().catch(console.error)
