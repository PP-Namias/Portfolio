#!/usr/bin/env node

/**
 * Update aboutSection singleton in Sanity
 *
 * Usage:
 *   node scripts/update-about-section.mjs
 *   node scripts/update-about-section.mjs --dry-run
 */

import { parseArgs } from 'node:util';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env') });

const { values } = parseArgs({
  options: {
    'dry-run': { type: 'boolean', default: false },
  },
  strict: false,
});

const SANITY_API_VERSION = 'v2024-01-01';
const PROJECT_ID = process.env.SANITY_STUDIO_API_PROJECT_ID || 'nl0qw78w';
const DATASET = process.env.SANITY_STUDIO_API_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!TOKEN) {
  console.error('Error: No Sanity token found. Set SANITY_API_WRITE_TOKEN in .env');
  process.exit(1);
}

// Portable Text blocks for aboutContent
const aboutBlocks = [
  {
    _type: 'block',
    _key: 'about-p1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'about-p1-span',
        text: "I'm a full-stack software engineer specializing in React, TypeScript, Node.js, and Python. I build production systems across enterprise, AI automation, healthcare, and IoT \u2014 from designing backend architecture to shipping polished user interfaces.",
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'about-p2',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'about-p2-span',
        text: "I've delivered 5+ live applications serving over 1,000 concurrent users, including an enterprise HRIS for 500+ employees and 8 deployed AI chatbot systems. My work spans the full lifecycle \u2014 system design, database architecture, API development, and frontend engineering \u2014 always with a focus on reliability and measurable outcomes.",
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'about-p3',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'about-p3-span',
        text: "I graduated Cum Laude with a BS in Computer Science from the University of Caloocan City (Batch 2026), recognized as a Dean's Lister throughout my studies. I'm currently targeting fullstack, AI/automation, or backend engineering roles where technical ownership and cross-functional execution drive real product impact.",
      },
    ],
    markDefs: [],
  },
];

// Education object
const education = {
  degree: 'Bachelor of Science in Computer Science',
  school: 'University of Caloocan City',
  location: 'Caloocan City, Metro Manila',
  period: '2022 \u2013 2026',
  highlights: ['Cum Laude', "Dean's Lister"],
};

async function fetchExistingAbout() {
  const url = `https://${PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent('*[_type == "aboutSection"][0]{_id,_type}')}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

async function upsertAboutSection() {
  const existing = await fetchExistingAbout();
  const docId = existing?._id || 'aboutSectionSingleton';

  const doc = {
    _id: docId,
    _type: 'aboutSection',
    aboutContent: aboutBlocks,
    education,
  };

  if (values['dry-run']) {
    console.log('[dry-run] Would upsert:');
    console.log(JSON.stringify(doc, null, 2));
    return;
  }

  const url = `https://${PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: doc }],
    }),
  });

  const data = await res.json();

  if (data.error) {
    console.error('Sanity error:', data.error);
    process.exit(1);
  }

  console.log('✓ aboutSection updated successfully');
  console.log('  Document ID:', docId);
  console.log('  Paragraphs:', aboutBlocks.length);
  console.log('  Education:', education.degree);
  console.log('  Highlights:', education.highlights.join(', '));
}

upsertAboutSection().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
