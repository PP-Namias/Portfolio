import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-config'

export const WEBSITE_ENTITY_ID = `${SITE_URL}/#website`
export const PERSON_ENTITY_ID = `${SITE_URL}/#person`
export const PERSON_NAME = 'Jhon Keneth Ryan B. Namias'
export const PERSON_JOB_TITLES = [
  'Project Manager',
  'Full Stack Engineer',
  'AI Automation Specialist',
] as const
export const PERSON_ALUMNI = 'University of Caloocan City'
export const PERSON_KNOWS_ABOUT = [
  'Flutter',
  'NestJS',
  'Next.js',
  'React-TypeScript',
  'PostgreSQL',
  'n8n',
  'Autonomous AI Agents',
  'AI Chatbot Architecture',
  'Workflow Automation',
  'IoT',
  'Raspberry Pi',
  'Arduino',
] as const
export const PERSON_IMAGE_ALT =
  'Jhon Keneth Ryan B. Namias - Full Stack Engineer & AI Automation Specialist'
export const PERSON_LOCATION = 'Caloocan City, Philippines'
export const PERSON_LANGUAGES = ['en', 'tl'] as const
export const PERSON_DESCRIPTION =
  'Full Stack Engineer and AI Automation Specialist based in Caloocan City, Philippines. ' +
  'Builds production web and mobile applications (Flutter, NestJS, Next.js, React-TypeScript, PostgreSQL) ' +
  'and automates business workflows with AI agents and IoT integrations (n8n, Raspberry Pi, Arduino). ' +
  'BS Computer Science, Cum Laude.'

const PERSON_SAME_AS = [
  'https://github.com/PP-Namias',
  'https://www.linkedin.com/in/pp-namias/',
  'https://x.com/PP_Namias',
  'https://www.facebook.com/profile.php?id=100093808752066',
] as const

export function buildWebSiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ENTITY_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ENTITY_ID },
    about: { '@id': PERSON_ENTITY_ID },
  }
}

export function buildPersonJsonLd(imageUrl: string) {
  return {
    '@type': 'Person',
    '@id': PERSON_ENTITY_ID,
    name: PERSON_NAME,
    description: PERSON_DESCRIPTION,
    disambiguatingDescription: `${PERSON_NAME}, ${PERSON_JOB_TITLES.join(', ')}, based in ${PERSON_LOCATION}.`,
    jobTitle: PERSON_JOB_TITLES,
    alumniOf: PERSON_ALUMNI,
    knowsLanguage: PERSON_LANGUAGES,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Caloocan City',
      addressCountry: 'PH',
    },
    url: SITE_URL,
    mainEntityOfPage: SITE_URL,
    image: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#profile-image`,
      url: imageUrl,
      alt: PERSON_IMAGE_ALT,
    },
    sameAs: PERSON_SAME_AS,
    knowsAbout: PERSON_KNOWS_ABOUT,
  }
}

export function buildPortfolioJsonLd(imageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildWebSiteJsonLd(), buildPersonJsonLd(imageUrl)],
  }
}
