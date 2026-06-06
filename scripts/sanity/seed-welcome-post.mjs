#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Seed a "Hi - Welcome to my blog-portfolio!" intro post into Sanity.
 *
 * Mirrors the structure of the reference sample the user shared
 * (greeting -> photo placeholder -> intro -> early exposure ->
 * origin story -> current stack -> project-management reflection ->
 * closing thank-you -> contact), personalized to Jhon Keneth Ryan
 * B. Namias using the resume he provided.
 *
 * Run with:
 *   node scripts/sanity/seed-welcome-post.mjs
 *
 * Reads the write token from .env.local.
 * Idempotent: re-running updates the same draft documents.
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

const authorSeed = {
  _id: 'author-jhon-keneth-ryan-namias',
  _type: 'author',
  name: 'Jhon Keneth Ryan B. Namias',
  slug: {_type: 'slug', current: 'jhon-keneth-ryan-namias'},
  bio: [
    {
      _type: 'block',
      _key: 'author-bio-1',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'author-bio-1-span',
          text: 'Full-stack engineer and AI automation specialist based in Manila, Philippines. Architect of this very portfolio (namias.tech).',
          marks: [],
        },
      ],
    },
  ],
}

const categoryPersonal = {
  _id: 'category-personal',
  _type: 'category',
  title: 'Personal',
  slug: {_type: 'slug', current: 'personal'},
  description: 'Personal reflections, introductions, and life updates from Keneth.',
}

const categoryCareer = {
  _id: 'category-career',
  _type: 'category',
  title: 'Career',
  slug: {_type: 'slug', current: 'career'},
  description: 'Career milestones, internships, project deep dives, and lessons learned.',
}

const welcomeBody = [
  {
    _type: 'block',
    _key: 'welcome-h1',
    style: 'h1',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-h1-span',
        text: 'Hi - Welcome to my blog-portfolio!',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-intro',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-intro-span',
        text: "Hi! I'm Jhon Keneth Ryan B. Namias, a passionate full-stack engineer and AI automation specialist who loves turning complex problems into production-grade systems.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-early',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-early-span',
        text: 'At an early age, I was heavily exposed with computers. It started with tweaking game settings, then editing config files and .dlls to see what would happen, to actually building production web platforms, AI automation systems, and business solutions for real clients.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-journey',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-journey-span',
        text: 'How I got here',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-journey-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-journey-body-span',
        text: 'My journey in programming started in 2022 when I was deciding what course to take for college. I was torn between Computer Engineering and Computer Science. I tried Harvard’s CS50 Introduction to Computer Science and immediately fell in love with CS. I’m in great debt of Sir David J. Malan for that course, and for kick-starting my love of problem solving.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-stack',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-stack-span',
        text: 'What I work with today',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-stack-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-stack-body-span',
        text: 'My first programming language was C, then C++, then Java. Today I build across modern stacks — React, Next.js, TypeScript, Node.js, NestJS, Spring Boot, PostgreSQL, Flutter — and I’ve been leaning hard into AI automation (LLMs, prompt engineering, n8n, ElevenLabs, OpenAI / Gemini APIs).',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-pm',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-pm-span',
        text: 'Leading people, not just code',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-pm-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-pm-body-span',
        text: 'I’ve also gotten deeply interested in software project management. I love building workflows that coordinate multiple engineers and AI agents at the same time. One principle I carry from CS50 — the code we write is not for ourselves but for others to read and understand — is what I bring to my teams at the BS Computer Science Council, the Wilshire Financial Network engagement, and the M.A.S.H. thesis project.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-closing-h2',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-closing-h2-span',
        text: 'Looking back, looking forward',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-closing',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-closing-span',
        text: 'Currently, I know the road ahead is very far, rough, and full of challenges. But looking back, I can also see that I’ve gotten far — Cum Laude (BS Computer Science, Batch 2026), Head of the BS CS Technical Committee, AI Solutions Developer at Wilshire Financial Network, and the architect of this very portfolio.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-thanks',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-thanks-span',
        text: 'Thank you very much for reading this! I hope that someday I am able to work with you.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-contact',
    style: 'normal',
    markDefs: [
      {
        _key: 'welcome-contact-mailto',
        _type: 'emailLink',
        href: 'mailto:pp.namias@gmail.com',
      },
    ],
    children: [
      {
        _type: 'span',
        _key: 'welcome-contact-span',
        text: 'Email: pp.namias@gmail.com',
        marks: ['welcome-contact-mailto'],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'welcome-footer',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'welcome-footer-span',
        text: 'GitHub: github.com/PP-Namias | LinkedIn: linkedin.com/in/pp-namias | Portfolio: namias.tech',
        marks: [],
      },
    ],
  },
]

const welcomePost = {
  _id: 'post-hi-welcome-to-my-blog-portfolio',
  _type: 'post',
  title: "Hi - Welcome to my blog-portfolio!",
  slug: {_type: 'slug', current: 'hi-welcome-to-my-blog-portfolio'},
  excerpt:
    'A short introduction to who I am, how I got into programming, what I build today, and where the road ahead is taking me.',
  metaTitle: "Hi - Welcome to my blog-portfolio! | Keneth's Portfolio Site",
  metaDescription:
    'A short introduction to Jhon Keneth Ryan B. Namias — full-stack engineer, AI automation specialist, and the architect of this very portfolio.',
  featured: true,
  sourceId: 'welcome-intro',
  publishedAt: today(),
  published: false,
  author: {_type: 'reference', _ref: 'author-jhon-keneth-ryan-namias'},
  categories: [
    {_type: 'reference', _key: 'cat-personal', _ref: 'category-personal'},
    {_type: 'reference', _key: 'cat-career', _ref: 'category-career'},
  ],
  tags: ['intro', 'career', 'ai', 'fullstack', 'personal'],
  body: welcomeBody,
}

async function run() {
  const transaction = client.transaction()
  transaction.createOrReplace(authorSeed)
  transaction.createOrReplace(categoryPersonal)
  transaction.createOrReplace(categoryCareer)
  transaction.createOrReplace(welcomePost)
  await transaction.commit()
  console.log('Seeded welcome post as DRAFT:', {
    post: welcomePost._id,
    author: authorSeed._id,
    categories: [categoryPersonal._id, categoryCareer._id],
    slug: welcomePost.slug.current,
    published: welcomePost.published,
    at: today(),
  })
  console.log('Open the studio and review: http://localhost:3333/structure/post;', welcomePost._id)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
