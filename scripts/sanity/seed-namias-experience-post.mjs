#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Re-seed "My Experience as a Developer in 2026" so it is authored by
 * Jhon Keneth Ryan B. Namias (Namias) instead of Genrey O. Cristobal.
 *
 * Uses the same _id and slug as the previous Genrey version, so this
 * overwrites the existing draft. Personal first-person references
 * ("I'm Genrey") and the footer credit are updated to Namias. The
 * `author-genrey-o-cristobal` document is left in place but is no
 * longer referenced by this post.
 *
 * Run with:
 *   node scripts/sanity/seed-namias-experience-post.mjs
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

const namiasBody = [
  {
    _type: 'block',
    _key: 'namias-h1',
    style: 'h1',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-h1-span',
        text: 'My Experience as a Developer in 2026',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-h2-intro',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-h2-intro-span',
        text: 'Introduction',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-intro-1',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-intro-1-span',
        text: "Hi! I'm Jhon Keneth Ryan B. Namias (Namias), currently pursuing Computer Science degree and if I know my self correctly is that I like building meaningful systems with meaningful UIs and meaningful actions that can improve a business or a person's daily life.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-intro-2',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-intro-2-span',
        text: "I just feel that there is something special on writing code & structuring data that can meaningfully affect an individual or a group of people.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-intro-3',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-intro-3-span',
        text: "I'm writing this blogpost to share my insights. I think I'm on a very weird situation. I have started coding way back 2020 when AI was just AI, not the AI Agent and the code completioning tool that we know & love today. It's really fascinating to be apart of this monumental moment. Back in 2020, I did not even know that I would be taking Computer Science as a course, It was just in a random summer in my senior highschool where I told myself to just do it and then I just did, and I'm sure glad that I did because I really love the idea of programming, of building things that can really affect individual's lives.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-h2-cs50',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-h2-cs50-span',
        text: 'Learning through CS50',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-cs50',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-cs50-span',
        text: "I have started learning programming through Harvard CS50 and if I had a chance to start over, I would surely follow the CS50 route because it have taught me a lot, the CS50 Classes taught by sir David J. Malan has really infected me his passion with Computers and Technologies so far. There were countless nights where I faced too much segmentation fault errors in C and I even had some nightmares having segmentation faults in for loops because I have messed up so much. I thought this was it, that I just need to learn these concepts and progress this career path and learn how to Google.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-h2-2023',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-h2-2023-span',
        text: '2023 - The year everything changed',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-2023-1',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-2023-1-span',
        text: "Then 2023 came and kind of changed the landscape for me. I'm guilty of the fact that I'm one of those people who actively refused to use AI in my coding because I have simply believed that it would not be sustainable in the long run, and I have feared that my love for writing stupid for loops and while loops would become obsolete hence the refusal to cave in to using AI. But then, I have noticed something I think this moment for me is my big wake-up moment. Because I have noticed my peers who outpace me to the point that I would produce less features than my peers. A lot of people always say that the tech industry is always shifting but my aha-moment is when Grok got released to the public, and that's the time when I have finally caved in to integrate AI to my coding and viewed it as a tool to be used in my arsenal.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-2023-2',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-2023-2-span',
        text: "Looking back the first few months of using AI, AI has really enabled me to produce features much more faster, there is no denying that. Since I was just a 2nd or 3rd year college student that time the features were small (in comparison) that AI has really become useful tool for students like me, and especially the fact that the GitHub Education pack also includes a premium GitHub Copilot which has only encouraged me to check out AI as a coding partner & not just as a tool.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-h2-overreliance',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-h2-overreliance-span',
        text: 'The over-reliance wake-up call',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-overreliance-1',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-overreliance-1-span',
        text: "Until, I have noticed that AI is taking over a lot of my ability to think. I think everyone says that let AI just be a tool while also performing the mistakes that I did. The mistake being is that the over-reliance with these AI tools. It is just addicting to prompt something into existence without even knowing what's behind the things that I'm building, and in those years I have continuely gaslit myself into thinking that I'm in control when I'm not.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-overreliance-2',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-overreliance-2-span',
        text: "If you are reading this far, I hope that this post becomes a signal for you to check who is in control. is it AI or is it YOU? Ask yourself, does it really matter if I know the things I'm building? But if you ask me this question, is that I would say YES. It's like one day I woke up, and snapped back to reality and realized that the code that is being generated by AI is impressive especially for people like me who is early into this environment & then this industry.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-h2-balance',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-h2-balance-span',
        text: 'The lesson - BALANCE',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-balance-1',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-balance-1-span',
        text: "But today, just TODAY. I felt so bad that I'm unable to think through problems that would have been so easy for me 6 years ago. I guess my Today's lesson and even how cliche this sound, is that there should always be a BALANCE. A lot of people talks about this 'balannce' but I believe that a lot of people just say this to copy what the other person has said. I implore you to discover it yourself, continously ask yourself questions, do sanity check to yourself, are you improving? are you doing what you really like? or you are being consumed by something else.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-balance-2',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-balance-2-span',
        text: "Don't get me wrong, I'm not anti-AI (unlike before) I'm actually pro-AI. But I have a feeling that people who are starting to code should not use AI at first & explore the muddy waters of programming first, see if you really like it on it's base flavor then start integrating these tools while also maintaining balance.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-h2-fire',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-h2-fire-span',
        text: 'The fire analogy',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-fire-1',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-fire-1-span',
        text: "Because if you work with something so powerful, you would not be able to see the pros and cons on why this technology exist in the first place. For me, I would never be able to think of a moment where there is no electricity, for me learning how to make a fire is just a 'hobby' I don't see the need to learn how to make fire because electricity or vice versa has enabled me to completely ignore this fact. But with this new perspective, I can see how helpless I am if these technologies are stripped away from me even for a brief moment. I would never be able to create fire, or create something because I've been so dependent on these technologies.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-fire-2',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-fire-2-span',
        text: "I'm not telling you to smash rocks together, or create your own CPU from scratch but I do think it would definitely help me and you if we know how the CPU works, what even is a CPU? What even is malloc and free? I'm writing this blog post because I feel enlightened and also disappointed to myself, enlightened due to the fact that I finally understand how I should balance my usage of AI and real technical skills and disappointed to myself that I have let myself be this helpless when AI is cut-off.",
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-h2-thanks',
    style: 'h2',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-h2-thanks-span',
        text: 'Thank you',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-thanks',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-thanks-span',
        text: 'Thank you for reading through! See you on the next post!',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'namias-footer',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'namias-footer-span',
        text: '© 2026 Jhon Keneth Ryan B. Namias. All rights reserved. | GitHub | LinkedIn | Twitter',
        marks: [],
      },
    ],
  },
]

const namiasPost = {
  _id: 'post-my-experience-as-a-developer-in-2026',
  _type: 'post',
  title: 'My Experience as a Developer in 2026',
  slug: {_type: 'slug', current: 'my-experience-as-a-developer-in-2026'},
  excerpt:
    'A reflection on my journey as a developer starting in 2020, learning through Harvard CS50, the 2023 AI shift, Grok as my wake-up moment, the trap of over-reliance, and the lesson that there must always be BALANCE.',
  metaTitle: "My Experience as a Developer in 2026 | Namias's Portfolio Site",
  metaDescription:
    'Jhon Keneth Ryan B. Namias reflects on coding since 2020, CS50, the 2023 AI shift, the over-reliance trap, and why BALANCE matters more than ever for new developers.',
  featured: false,
  sourceId: 'namias-experience-2026',
  publishedAt: today(),
  published: true,
  author: {_type: 'reference', _ref: 'author-jhon-keneth-ryan-namias'},
  categories: [
    {_type: 'reference', _key: 'cat-personal-namias', _ref: 'category-personal'},
    {_type: 'reference', _key: 'cat-career-namias', _ref: 'category-career'},
  ],
  tags: ['experience', 'reflection', 'ai', 'cs50', 'balance', 'learning', 'developer-journey'],
  body: namiasBody,
}

async function run() {
  const transaction = client.transaction()
  transaction.createOrReplace(namiasPost)
  await transaction.commit()
  console.log('Re-seeded "My Experience as a Developer in 2026" as authored by Namias (still PUBLISHED):', {
    post: namiasPost._id,
    slug: namiasPost.slug.current,
    author: namiasPost.author._ref,
    published: namiasPost.published,
    at: today(),
  })
  console.log(
    'Open the studio and review: http://localhost:3333/structure/post;',
    namiasPost._id
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
