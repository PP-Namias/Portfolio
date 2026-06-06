#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Seed the "GitGoing - Computer Science GitHub Webinar!" post into Sanity.
 *
 * Mirrors the structure of the reference sample the user shared
 * (intro -> why collaboration -> learning Git alone -> learning with
 * classmates -> speaking at the university -> impact -> credits),
 * personalized to Jhon Keneth Ryan B. Namias as a Special Guest
 * Speaker alongside Genrey O. Cristobal, Seiffer Salupado, and
 * Red Ivan Igot.
 *
 * Run with:
 *   node scripts/sanity/seed-gitgoing-post.mjs
 *
 * Reads the write token from .env.local.
 * Idempotent: re-running updates the same draft document.
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

const gitgoingBody = [
  {
    _type: 'block',
    _key: 'gitgoing-h1',
    style: 'h1',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-h1-span',
        text: 'GitGoing - Computer Science GitHub Webinar!',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-intro',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-intro-span',
        text: 'I really do believe that collaboration among developers is one of the keys to the success of any program. One of the ways we can collaborate is with the use of version control systems like Git.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-curiosity',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-curiosity-span',
        text: 'When I was first learning how to code, I was always curious about how I could collaborate with others. I really liked the emphasis on writing code that is readable to other developers.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-need',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-need-span',
        text: 'When version control became essential',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-need-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-need-body-span',
        text: 'It was not long after I started working with colleagues and classmates that the need to learn version control became essential. We were working on huge projects that required multiple developers working on the same files and folders simultaneously.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-fear',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-fear-span',
        text: 'Overcoming the fear of breaking things',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-fear-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-fear-body-span',
        text: 'I was personally stressed at first because I had heard that you can mistakenly push code that would ruin other people’s work. But I’m really glad that I overcame that fear and learned Git myself.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-self-learn',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-self-learn-span',
        text: 'Learning Git on my own',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-self-learn-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-self-learn-body-span',
        text: 'The way I learned Git was by first learning on my own. I set up a GitHub account and installed Git on my local machine, trying out the commands and seeing the results on the GitHub website. It was really fun seeing my first commit message and seeing the files in the past. For me, it really felt like magic.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-with-others',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-with-others-span',
        text: 'Learning with classmates',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-with-others-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-with-others-body-span',
        text: 'But I knew at the time that learning Git alone wasn’t going to cut it. I understood the importance of Git as a way to collaborate with other people, and I knew I wasn’t doing myself any favor by learning alone. I needed someone to practice with.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-with-others-body-2',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-with-others-body-2-span',
        text: 'I’m really lucky that I had classmates who already knew how to use Git. I got plenty of help from them until I became confident on my own.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-fluent',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-fluent-span',
        text: 'From student to instructor',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-fluent-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-fluent-body-span',
        text: 'From that point forward, managing codebases and projects on development teams became easier than ever. I was able to instruct other people on what to do, what commands to use, and the reasoning behind them.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-talk',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-talk-span',
        text: 'GitGoing - the talk',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-talk-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-talk-body-span',
        text: 'Eventually, I got the opportunity to be a Special Guest Speaker at our University of Caloocan City’s “GitGoing - Computer Science GitHub Webinar.” I was really honored to be invited to share the stage with Genrey O. Cristobal, Seiffer Salupado, and Red Ivan Igot to talk about the importance of Git and GitHub.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-talk-impact',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-talk-impact-span',
        text: 'The impact',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-talk-impact-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-talk-impact-body-span',
        text: 'The talk has become a requirement for lower years to attend. We had over 1,000+ students learning and understanding the importance of Git and GitHub in software development, and many students in other departments have been requesting similar talks.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-reflection',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-reflection-span',
        text: 'Looking back',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-reflection-body',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-reflection-body-span',
        text: 'It was really an AWESOME experience for me. Standing on that stage, I believe this talk has transcended my understanding of Git and GitHub in many levels than it was before. The pressure was undeniable, but looking back at it, I believe it was worth it.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-gratitude',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-gratitude-span',
        text: 'I’m forever grateful to God, my professors at the University of Caloocan City who believed in me, to the Computer Science Council for organizing, to Genrey for the invitation, and to my friends and family.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-credits-h2',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-credits-h2-span',
        text: 'Credits',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-credits',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-credits-span',
        text: 'Banner - Creative Committee led by Gwyneth Uy of Computer Science Council',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-speakers',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-speakers-span',
        text: 'Special Guests and Speakers - Genrey O. Cristobal, Jhon Keneth Ryan B. Namias, Seiffer Salupado, Red Ivan Igot.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'gitgoing-footer',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'gitgoing-footer-span',
        text: 'GitHub: github.com/PP-Namias | LinkedIn: linkedin.com/in/pp-namias | Portfolio: namias.tech',
        marks: [],
      },
    ],
  },
]

const gitgoingPost = {
  _id: 'post-gitgoing-computer-science-github-webinar',
  _type: 'post',
  title: 'GitGoing - Computer Science GitHub Webinar!',
  slug: {_type: 'slug', current: 'gitgoing-computer-science-github-webinar'},
  excerpt:
    'My experience as a Special Guest Speaker at the University of Caloocan City\'s GitGoing webinar, talking about Git, GitHub, and developer collaboration with Genrey O. Cristobal, Seiffer Salupado, and Red Ivan Igot.',
  metaTitle: "GitGoing - Computer Science GitHub Webinar! | Keneth's Portfolio Site",
  metaDescription:
    'My experience as a Special Guest Speaker at the University of Caloocan City\'s GitGoing webinar, talking about Git, GitHub, and developer collaboration.',
  featured: false,
  sourceId: 'gitgoing-webinar',
  publishedAt: today(),
  published: false,
  author: {_type: 'reference', _ref: 'author-jhon-keneth-ryan-namias'},
  categories: [
    {_type: 'reference', _key: 'cat-personal-gitgoing', _ref: 'category-personal'},
    {_type: 'reference', _key: 'cat-career-gitgoing', _ref: 'category-career'},
  ],
  tags: ['git', 'github', 'webinar', 'speaking', 'collaboration', 'version-control', 'ucc'],
  body: gitgoingBody,
}

async function run() {
  const transaction = client.transaction()
  transaction.createOrReplace(gitgoingPost)
  await transaction.commit()
  console.log('Seeded GitGoing post as DRAFT:', {
    post: gitgoingPost._id,
    slug: gitgoingPost.slug.current,
    published: gitgoingPost.published,
    at: today(),
  })
  console.log(
    'Open the studio and review: http://localhost:3333/structure/post;',
    gitgoingPost._id
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
