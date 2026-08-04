import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-config';

export const WEBSITE_ENTITY_ID = `${SITE_URL}/#website`;
export const PERSON_ENTITY_ID = `${SITE_URL}/#person`;
export const PERSON_NAME = 'Jhon Keneth Ryan B. Namias';
export const PERSON_JOB_TITLES = [
  'Project Manager',
  'Full Stack Engineer',
  'AI Automation Specialist',
] as const;
export const PERSON_ALUMNI = 'University of Caloocan City';
export const PERSON_KNOWS_ABOUT = [
  'n8n',
  'Flutter',
  'NestJS',
  'Next.js',
  'React-TypeScript',
  'PostgreSQL',
  'AI Chatbot Architecture',
] as const;
export const PERSON_IMAGE_ALT = 'Jhon Keneth Ryan B. Namias - Full Stack Engineer & AI Automation Specialist';

const PERSON_SAME_AS = [
  'https://github.com/PP-Namias',
  'https://www.linkedin.com/in/pp-namias/',
  'https://x.com/PP_Namias',
  'https://www.facebook.com/profile.php?id=100093808752066',
] as const;

export function buildWebSiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ENTITY_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
  };
}

export function buildPersonJsonLd(imageUrl: string) {
  return {
    '@type': 'Person',
    '@id': PERSON_ENTITY_ID,
    name: PERSON_NAME,
    jobTitle: PERSON_JOB_TITLES,
    alumniOf: PERSON_ALUMNI,
    url: SITE_URL,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      alt: PERSON_IMAGE_ALT,
    },
    sameAs: PERSON_SAME_AS,
    knowsAbout: PERSON_KNOWS_ABOUT,
  };
}

export function buildPortfolioJsonLd(imageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildWebSiteJsonLd(), buildPersonJsonLd(imageUrl)],
  };
}
