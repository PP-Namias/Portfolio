import {defineConfig} from 'sanity'
import {defineLocations, presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const presentationPreviewUrl = 'https://ervhyne.vercel.app'

const homePageLocation = {
  message: 'This document is used on',
  tone: 'positive' as const,
  locations: [
    {
      title: 'Homepage',
      href: '/',
    },
  ],
}

export default defineConfig({
  name: 'default',
  title: 'Ervhyne Portfolio CMS',

  projectId: '3auhr54u',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Hero Section')
              .child(S.document().schemaType('heroSection').documentId('heroSection')),
            S.listItem()
              .title('About Section')
              .child(S.document().schemaType('aboutSection').documentId('aboutSection')),
            S.listItem()
              .title('Profile')
              .child(S.document().schemaType('profile').documentId('profile')),
            S.listItem()
              .title('Experience')
              .child(S.documentTypeList('experience').title('Experience')),
            S.listItem()
              .title('Projects')
              .child(S.documentTypeList('project').title('Projects')),
            S.listItem()
              .title('Certifications')
              .child(S.documentTypeList('certification').title('Certifications')),
            S.listItem()
              .title('Gallery')
              .child(S.documentTypeList('galleryImage').title('Gallery')),
            S.listItem()
              .title('Memberships')
              .child(S.documentTypeList('membership').title('Memberships')),
            S.listItem()
              .title('Recommendations')
              .child(S.documentTypeList('recommendation').title('Recommendations')),
            S.listItem()
              .title('Tech Stack')
              .child(S.document().schemaType('techStack').documentId('techStack')),
            S.listItem()
              .title('Resume')
              .child(S.documentTypeList('resume').title('Resume')),
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ])
    }),
    presentationTool({
      title: 'Presentation',
      previewUrl: {
        origin: presentationPreviewUrl,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        locations: {
          heroSection: defineLocations(homePageLocation),
          aboutSection: defineLocations(homePageLocation),
          profile: defineLocations(homePageLocation),
          siteSettings: defineLocations(homePageLocation),
          experience: defineLocations(homePageLocation),
          project: defineLocations(homePageLocation),
          certification: defineLocations(homePageLocation),
          galleryImage: defineLocations(homePageLocation),
          membership: defineLocations(homePageLocation),
          recommendation: defineLocations(homePageLocation),
          techStack: defineLocations(homePageLocation),
          resume: defineLocations(homePageLocation),
        },
      },
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
