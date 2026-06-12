import {defineLocations} from 'sanity/presentation'

import {PREVIEWABLE_TYPES} from '../schemaTypes'

export type RouteMap = {
  [type: string]: () => {locations: ReturnType<typeof defineLocations>}
}

function homeLocation(title: string) {
  return defineLocations({
    message: 'This document previews on the portfolio homepage (`/`).',
    tone: 'positive' as const,
    locations: [
      {
        title,
        href: '/',
      },
    ],
  })
}

const blogPostLocation = defineLocations({
  message: 'This document previews in the portfolio blog route (`/blog`).',
  tone: 'positive' as const,
  locations: [
    {
      title: 'Blog',
      href: '/blog',
    },
    {
      title: 'Post (by slug)',
      href: '/blog/[slug]',
    },
  ],
})

const projectLocation = defineLocations({
  message: 'This project previews in the portfolio `/projects` route.',
  tone: 'positive' as const,
  locations: [
    {title: 'Projects grid', href: '/projects'},
    {title: 'Project detail', href: '/projects/[slug]'},
  ],
})

const experienceLocation = defineLocations({
  message: 'This experience previews in the portfolio timeline.',
  tone: 'positive' as const,
  locations: [{title: 'Experience timeline', href: '/#experience'}],
})

const certificationLocation = defineLocations({
  message: 'This certification previews in the certifications grid.',
  tone: 'positive' as const,
  locations: [{title: 'Certifications', href: '/#certifications'}],
})

const galleryLocation = defineLocations({
  message: 'This image previews in the gallery.',
  tone: 'positive' as const,
  locations: [{title: 'Gallery', href: '/#gallery'}],
})

const membershipLocation = defineLocations({
  message: 'This membership previews in the support data section.',
  tone: 'positive' as const,
  locations: [{title: 'Memberships', href: '/#memberships'}],
})

const recommendationLocation = defineLocations({
  message: 'This recommendation previews in the recommendations section.',
  tone: 'positive' as const,
  locations: [{title: 'Recommendations', href: '/#recommendations'}],
})

const resumeLocation = defineLocations({
  message: 'The resume file is served from the resume page.',
  tone: 'positive' as const,
  locations: [{title: 'Resume page', href: '/resume'}],
})

export const previewLocations = {
  profile: homeLocation('Hero & Profile'),
  aboutSection: homeLocation('About Section'),
  siteSettings: homeLocation('Site Settings'),
  techStack: homeLocation('Tech Stack'),
  experience: experienceLocation,
  project: projectLocation,
  certification: certificationLocation,
  galleryImage: galleryLocation,
  membership: membershipLocation,
  recommendation: recommendationLocation,
  resume: resumeLocation,
  post: blogPostLocation,
}

export const PREVIEWED_TYPES = PREVIEWABLE_TYPES
