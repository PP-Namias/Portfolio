/**
 * Seed the demo dataset.
 *
 * Usage:
 *   cd studio
 *   npx sanity exec ../scripts/sanity/seed-demo.ts --with-user-token
 *
 * Requires a Sanity token with write access to the project.
 */
import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'nl0qw78w'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-10-21',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const today = () => new Date().toISOString()

const heroSeed = {
  _id: 'heroSection',
  _type: 'heroSection',
  fullName: 'Jhon Keneth Ryan Namias',
  title: 'Full Stack Engineer & AI Automation Specialist',
  heroRoles: ['Full Stack Engineer', 'AI Automation Specialist', 'Prompt Engineer'],
  location: 'Caloocan City, Philippines',
  availabilityLabel: 'Available',
  contactEmail: 'pp.namias@gmail.com',
  socialLinks: [
    {platform: 'github', url: 'https://github.com/PP-Namias', placements: ['hero', 'footer']},
    {platform: 'linkedin', url: 'https://www.linkedin.com/in/pp-namias/', placements: ['hero', 'footer']},
  ],
}

const projectSeed = [
  {
    _id: 'project-namias-portfolio',
    _type: 'project',
    title: 'Namias Portfolio (this site)',
    slug: {_type: 'slug', current: 'namias-portfolio'},
    summary: 'Next.js 16 + Sanity CMS + Cloudflare Workers. Real-time preview, visual editing, smart workflows.',
    year: new Date().getFullYear(),
    status: 'completed',
    featured: true,
    featuredRank: 1,
    role: 'Sole engineer',
    technologies: ['Next.js', 'TypeScript', 'Sanity', 'Cloudflare Workers'],
    achievements: ['Shipped to namias.tech in 4 weeks', 'All 10 PR checks green on first try'],
  },
  {
    _id: 'project-ai-chatbot',
    _type: 'project',
    title: 'AI Portfolio Assistant',
    slug: {_type: 'slug', current: 'ai-portfolio-assistant'},
    summary: 'Multi-provider AI chatbot with circuit-breaker failover, rate limiting, and intent classification.',
    year: new Date().getFullYear() - 1,
    status: 'completed',
    featured: true,
    featuredRank: 2,
    role: 'Sole engineer',
    technologies: ['Next.js', 'OpenAI', 'Gemini', 'Upstash Redis'],
  },
]

const certSeed = [
  {
    _id: 'cert-meta-front-end',
    _type: 'certification',
    title: 'Meta Front-End Developer',
    issuer: {_type: 'reference', _ref: 'certificationIssuer-meta'},
    issuedAt: '2024-06-15',
    neverExpires: true,
  },
  {
    _id: 'cert-aws-cloud-practitioner',
    _type: 'certification',
    title: 'AWS Cloud Practitioner',
    issuer: {_type: 'reference', _ref: 'certificationIssuer-aws'},
    issuedAt: '2025-01-10',
    expiresAt: '2028-01-10',
    neverExpires: false,
  },
]

async function run() {
  const transaction = client.transaction()
  transaction.createOrReplace(heroSeed)
  for (const p of projectSeed) {
    transaction.createOrReplace(p)
  }
  for (const c of certSeed) {
    transaction.createOrReplace(c)
  }
  await transaction.commit()
  // eslint-disable-next-line no-console
  console.log('Seeded:', {
    hero: 1,
    projects: projectSeed.length,
    certifications: certSeed.length,
    at: today(),
  })
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
