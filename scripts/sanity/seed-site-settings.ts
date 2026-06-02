/**
 * Seed (or update) the global Site Settings document with all the smart
 * defaults for the Namias portfolio: identity, social sharing, theme,
 * section headings, hero / contact / footer / blog copy, empty states,
 * analytics, and legal links. Uploads the branded OG image to the Sanity
 * asset library and points ogImage at it, so link previews show the
 * large brand card.
 *
 * Usage:
 *   cd studio
 *   npx sanity exec ../scripts/sanity/seed-site-settings.ts --with-user-token
 *
 * Requires a Sanity token with write access to the project. The script
 * is idempotent: re-running it overwrites the existing siteSettings doc
 * with the same smart defaults (no data loss for any other docs).
 */
import {createClient, type SanityClient} from '@sanity/client'
import {readFileSync, existsSync} from 'node:fs'
import {resolve} from 'node:path'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'nl0qw78w'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const writeToken = process.env.SANITY_API_WRITE_TOKEN

if (!writeToken) {
  // eslint-disable-next-line no-console
  console.error('SANITY_API_WRITE_TOKEN is required. Re-run with --with-user-token or set the env var.')
  process.exit(1)
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-10-21',
  useCdn: false,
  token: writeToken,
})

const __dirname = process.cwd()
const ogImagePath = (() => {
  const candidates = [
    resolve(__dirname, 'public', 'og-image.svg'),
    resolve(__dirname, '..', 'public', 'og-image.svg'),
    resolve(__dirname, '..', '..', 'public', 'og-image.svg'),
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  return candidates[candidates.length - 1]
})()

async function uploadOgImage(): Promise<{_type: 'image'; asset: {_type: 'reference'; _ref: string}}> {
  const fileBuffer = readFileSync(ogImagePath)
  const asset = await client.assets.upload('image', fileBuffer, {
    filename: 'og-image.svg',
    contentType: 'image/svg+xml',
    description: 'Branded portfolio Open Graph image (1200x630)',
  })
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  }
}

const siteSettingsDoc = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Jhon Keneth Namias — Portfolio',
  siteTagline:
    'Full Stack Engineer & AI Automation Specialist based in Caloocan City, Philippines.',
  ownerName: 'Jhon Keneth Ryan Namias',
  ownerShortName: 'Jhon Keneth Namias',
  contactEmail: 'pp.namias@gmail.com',

  themeColor: '#ff63a5',

  ogTitle: 'Jhon Keneth Namias — Portfolio',
  ogDescription:
    'Full Stack Engineer & AI Automation Specialist. I build production-grade web apps, AI automations, and content pipelines.',

  defaultMetaTitle: 'Jhon Keneth Namias — Portfolio',
  defaultMetaDescription:
    'Full Stack Engineer & AI Automation Specialist based in the Philippines. Next.js, TypeScript, Sanity, Cloudflare.',
  canonicalUrl: 'https://namias.tech',
  robotsNoindex: false,
  robotsNofollow: false,
  sitemapEnabled: true,

  primaryAccent: '#ff63a5',
  secondaryAccent: '#06b6d4',
  defaultColorMode: 'system',

  sectionHeadings: {
    aboutTitle: 'About',
    aboutSubtitle: 'A short story about how I got here.',
    experienceTitle: 'Experience',
    experienceSubtitle: 'Where I have spent the last few years.',
    projectsTitle: 'Projects',
    projectsSubtitle: 'A few things I have shipped recently.',
    certificationsTitle: 'Certifications',
    certificationsSubtitle: 'Credentials, courses, and continuous learning.',
    galleryTitle: 'Gallery',
    gallerySubtitle: 'Photos, screenshots, and moments from the journey.',
    contactTitle: 'Connect',
    contactSubtitle: 'Have a project or an opportunity? Let us talk.',
  },

  heroActions: {
    resumeLabel: 'Download Resume',
    scheduleLabel: 'Schedule a Call',
    emailLabel: 'Email Me',
  },

  contactActions: {
    scheduleLabel: 'Book a time',
    emailLabel: 'Send a message',
  },

  footer: {
    leadText: 'Built with Next.js, Sanity, and Cloudflare Workers.',
    linkLabel: 'Back to top',
    copyright: 'Jhon Keneth Ryan Namias. All rights reserved.',
    backToPortfolioLabel: 'Back to Portfolio',
    contactPrompt: 'Want to work together?',
  },

  blog: {
    title: 'Writing',
    description:
      'Field notes on AI, software engineering, prompt design, and shipping things in production.',
    backLabel: 'Back to Portfolio',
    postsPerPage: 12,
  },

  announcementBanner: {
    enabled: true,
    message: 'Open to new opportunities — let us build something great.',
    linkLabel: 'Get in touch',
    linkUrl: 'mailto:pp.namias@gmail.com',
    tone: 'positive',
  },

  emptyStates: {
    projects: 'Projects will appear here once they are published.',
    blog: 'No posts yet. Check back soon.',
    testimonials: 'Recommendations will appear here as they are added.',
    experience: 'Experience timeline will appear here.',
  },

  analytics: {
    vercelAnalyticsEnabled: true,
  },

  legal: {
    cookieConsentEnabled: false,
  },
}

async function run() {
  const ogImageAsset = await uploadOgImage()

  const docWithOg = {
    ...siteSettingsDoc,
    ogImage: {
      ...ogImageAsset,
      alt: 'Jhon Keneth Namias — Portfolio preview',
    },
  }

  await client.createOrReplace(docWithOg)

  // eslint-disable-next-line no-console
  console.log('Seeded siteSettings:', {
    id: 'siteSettings',
    ogImage: ogImageAsset.asset._ref,
    at: new Date().toISOString(),
  })
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
