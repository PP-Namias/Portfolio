import {defineConfig} from 'sanity'
import {defineLocations, presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {createPublishAndRefreshAction} from './actions/publishAndRefreshAction'
import {perspectiveSwitcherAction} from './actions/perspectiveSwitcher'
import {previewLocations} from './preview/previewLocations'
import {templateRegistry} from './templates'
import {getDraftModeEnablePath, getStudioPreviewOrigin, loadStudioEnvironment, requireStudioEnv} from './env'

loadStudioEnvironment()

const presentationPreviewUrl = getStudioPreviewOrigin()
const presentationEnablePath = getDraftModeEnablePath()
const projectId = requireStudioEnv('SANITY_STUDIO_PROJECT_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID')
const dataset = requireStudioEnv('SANITY_STUDIO_DATASET', 'NEXT_PUBLIC_SANITY_DATASET')

const homePageLocation = (title: string) => ({
  message: 'This document previews on the portfolio homepage (`/`).',
  tone: 'positive' as const,
  locations: [
    {
      title,
      href: '/',
    },
  ],
})

const blogPostLocation = {
  message: 'This document previews in the portfolio blog route (`/blog`).',
  tone: 'positive' as const,
  locations: [
    {
      title: 'Blog',
      href: '/blog',
    },
  ],
}

const demoGroupTitle = 'Interview Demo'

export default defineConfig({
  name: 'default',
  title: 'Namias CMS | Interview Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Homepage').child(
              S.list()
                .title('Homepage Story')
                .items([
                  S.listItem().title('Hero & shell').child(
                    S.list()
                      .title('Hero & shell')
                      .items([
                        S.listItem()
                          .title('Hero Section')
                          .child(S.document().schemaType('heroSection').documentId('heroSection')),
                        S.listItem()
                          .title('Resume')
                          .child(S.documentTypeList('resume').title('Resume')),
                        S.listItem()
                          .title('Site Settings')
                          .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                      ])
                  ),
                  S.listItem().title('Main column').child(
                    S.list()
                      .title('Main column')
                      .items([
                        S.listItem()
                          .title('About Section')
                          .child(S.document().schemaType('aboutSection').documentId('aboutSection')),
                        S.listItem()
                          .title('Tech Stack')
                          .child(S.document().schemaType('techStack').documentId('techStack')),
                        S.listItem().title('Projects').child(S.documentTypeList('project').title('Projects')),
                      ])
                  ),
                  S.listItem().title('Sidebar column').child(
                    S.list()
                      .title('Sidebar column')
                      .items([
                        S.listItem().title('Experience').child(S.documentTypeList('experience').title('Experience')),
                        S.listItem().title('Certifications').child(S.documentTypeList('certification').title('Certifications')),
                        S.listItem().title('Gallery').child(S.documentTypeList('galleryImage').title('Gallery')),
                      ])
                  ),
                ])
            ),
            S.listItem().title('Support Data').child(
              S.list()
                .title('Support Data & Proof')
                .items([
                  S.listItem().title('Profile').child(S.document().schemaType('profile').documentId('profile')),
                  S.listItem().title('Memberships').child(S.documentTypeList('membership').title('Memberships')),
                  S.listItem().title('Recommendations').child(S.documentTypeList('recommendation').title('Recommendations')),
                ])
            ),
            S.listItem().title('Blog').child(
              S.list()
                .title('Blog Publishing')
                .items([
                  S.listItem().title('Posts').child(S.documentTypeList('post').title('Posts')),
                  S.listItem().title('Authors').child(S.documentTypeList('author').title('Authors')),
                  S.listItem().title('Categories').child(S.documentTypeList('category').title('Categories')),
                ])
            ),
            S.listItem().title('Reference Data').child(
              S.list()
                .title('Reference Data & Taxonomy')
                .items([
                  S.listItem()
                    .title('Certification Categories')
                    .child(S.documentTypeList('certificationCategory').title('Certification Categories')),
                  S.listItem()
                    .title('Certification Issuers')
                    .child(S.documentTypeList('certificationIssuer').title('Certification Issuers')),
                  S.listItem()
                    .title('Gallery Categories')
                    .child(S.documentTypeList('galleryCategory').title('Gallery Categories')),
                ])
            ),
            S.listItem().title(demoGroupTitle).child(
              S.list()
                .title('Interview Demo')
                .items([
                  S.listItem().title('1. Preview Foundation').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                  S.listItem().title('2. Homepage Live Preview').child(S.document().schemaType('heroSection').documentId('heroSection')),
                  S.listItem().title('3. Blog Live Preview').child(S.documentTypeList('post').title('Posts')),
                ])
            ),
          ])
    }),
    presentationTool({
      title: 'Presentation',
      previewUrl: {
        origin: presentationPreviewUrl,
        previewMode: {
          enable: presentationEnablePath,
        },
      },
      resolve: {
        locations: {
          heroSection: defineLocations(homePageLocation('Hero Section')),
          aboutSection: defineLocations(homePageLocation('About Section')),
          profile: defineLocations(homePageLocation('About Section')),
          techStack: defineLocations(homePageLocation('Tech Stack')),
          experience: defineLocations(homePageLocation('Experience')),
          project: defineLocations(homePageLocation('Projects')),
          certification: defineLocations(homePageLocation('Certifications')),
          galleryImage: defineLocations(homePageLocation('Gallery')),
          membership: defineLocations(homePageLocation('Memberships')),
          recommendation: defineLocations(homePageLocation('Recommendations')),
          resume: defineLocations(homePageLocation('Resume')),
          siteSettings: defineLocations(homePageLocation('Site Settings')),
          post: defineLocations(blogPostLocation),
          ...Object.fromEntries(
            Object.entries(previewLocations).map(([type, locations]) => [type, locations]),
          ),
        },
      },
    }),
    visionTool(),
  ],

  document: {
    actions: (prev) => [
      perspectiveSwitcherAction,
      ...prev.map((originalAction) =>
        originalAction.action === 'publish'
          ? createPublishAndRefreshAction(originalAction)
          : originalAction,
      ),
    ],
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev
      }
      return prev
    },
  },

  schema: {
    types: schemaTypes,
    templates: [
      ...Object.values(templateRegistry).flat(),
    ],
  },
})

const blogPostLocation = {
  message: 'This document previews in the portfolio blog route (`/blog`).',
  tone: 'positive' as const,
  locations: [
    {
      title: 'Blog',
      href: '/blog',
    },
  ],
}

const demoGroupTitle = 'Interview Demo'

export default defineConfig({
  name: 'default',
  title: 'Namias CMS | Interview Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Homepage').child(
              S.list()
                .title('Homepage Story')
                .items([
                  S.listItem().title('Hero & shell').child(
                    S.list()
                      .title('Hero & shell')
                      .items([
                        S.listItem()
                          .title('Hero Section')
                          .child(S.document().schemaType('heroSection').documentId('heroSection')),
                        S.listItem()
                          .title('Resume')
                          .child(S.documentTypeList('resume').title('Resume')),
                        S.listItem()
                          .title('Site Settings')
                          .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                      ])
                  ),
                  S.listItem().title('Main column').child(
                    S.list()
                      .title('Main column')
                      .items([
                        S.listItem()
                          .title('About Section')
                          .child(S.document().schemaType('aboutSection').documentId('aboutSection')),
                        S.listItem()
                          .title('Tech Stack')
                          .child(S.document().schemaType('techStack').documentId('techStack')),
                        S.listItem().title('Projects').child(S.documentTypeList('project').title('Projects')),
                      ])
                  ),
                  S.listItem().title('Sidebar column').child(
                    S.list()
                      .title('Sidebar column')
                      .items([
                        S.listItem()
                          .title('Experience')
                          .child(S.documentTypeList('experience').title('Experience')),
                        S.listItem()
                          .title('Certifications')
                          .child(S.documentTypeList('certification').title('Certifications')),
                        S.listItem().title('Gallery').child(S.documentTypeList('galleryImage').title('Gallery')),
                      ])
                  ),
                ])
            ),
            S.listItem().title('Support Data').child(
              S.list()
                .title('Support Data & Proof')
                .items([
                  S.listItem().title('Profile').child(S.document().schemaType('profile').documentId('profile')),
                  S.listItem().title('Memberships').child(S.documentTypeList('membership').title('Memberships')),
                  S.listItem().title('Recommendations').child(S.documentTypeList('recommendation').title('Recommendations')),
                ])
            ),
            S.listItem().title('Blog').child(
              S.list()
                .title('Blog Publishing')
                .items([
                  S.listItem().title('Posts').child(S.documentTypeList('post').title('Posts')),
                  S.listItem().title('Authors').child(S.documentTypeList('author').title('Authors')),
                  S.listItem().title('Categories').child(S.documentTypeList('category').title('Categories')),
                ])
            ),
            S.listItem().title('Reference Data').child(
              S.list()
                .title('Reference Data & Taxonomy')
                .items([
                  S.listItem()
                    .title('Certification Categories')
                    .child(S.documentTypeList('certificationCategory').title('Certification Categories')),
                  S.listItem()
                    .title('Certification Issuers')
                    .child(S.documentTypeList('certificationIssuer').title('Certification Issuers')),
                  S.listItem()
                    .title('Gallery Categories')
                    .child(S.documentTypeList('galleryCategory').title('Gallery Categories')),
                ])
            ),
            S.listItem().title(demoGroupTitle).child(
              S.list()
                .title('Interview Demo')
                .items([
                  S.listItem().title('1. Preview Foundation').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                  S.listItem().title('2. Homepage Live Preview').child(S.document().schemaType('heroSection').documentId('heroSection')),
                  S.listItem().title('3. Blog Live Preview').child(S.documentTypeList('post').title('Posts')),
                ])
            ),
          ])
    }),
    presentationTool({
      title: 'Presentation',
      previewUrl: {
        origin: presentationPreviewUrl,
        previewMode: {
          enable: presentationEnablePath,
        },
      },
      resolve: {
        locations: {
          heroSection: defineLocations(homePageLocation('Hero Section')),
          aboutSection: defineLocations(homePageLocation('About Section')),
          profile: defineLocations(homePageLocation('About Section')),
          techStack: defineLocations(homePageLocation('Tech Stack')),
          experience: defineLocations(homePageLocation('Experience')),
          project: defineLocations(homePageLocation('Projects')),
          certification: defineLocations(homePageLocation('Certifications')),
          galleryImage: defineLocations(homePageLocation('Gallery')),
          membership: defineLocations(homePageLocation('Memberships')),
          recommendation: defineLocations(homePageLocation('Recommendations')),
          resume: defineLocations(homePageLocation('Resume')),
          siteSettings: defineLocations(homePageLocation('Site Settings')),
          post: defineLocations(blogPostLocation),
        },
      },
    }),
    visionTool(),
  ],

  document: {
    actions: (prev) =>
      prev.map((originalAction) =>
        originalAction.action === 'publish'
          ? createPublishAndRefreshAction(originalAction)
          : originalAction,
      ),
  },

  schema: {
    types: schemaTypes,
  },
})
