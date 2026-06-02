import {defineConfig} from 'sanity'
import {defineLocations, presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {assist} from '@sanity/assist'
import {schemaTypes} from './schemaTypes'
import {createPublishAndRefreshAction} from './actions/publishAndRefreshAction'
import {perspectiveSwitcherAction} from './actions/perspectiveSwitcher'
import {viewOnSiteAction} from './actions/viewOnSiteAction'
import {openInPresentationAction} from './actions/openInPresentationAction'
import {previewLocations} from './preview/previewLocations'
import {templateRegistry} from './templates'
import {studioBadges} from './components/badges/statusBadges'
import {Welcome} from './components/Welcome'
import {OnboardingTour} from './components/Onboarding'
import {studioTheme} from './theme/studioTheme'
import {skillsToolPlugin} from './plugins/skillsTool'
import {deskStructure} from './structure/deskStructure'
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

export default defineConfig({
  name: 'default',
  title: 'Namias CMS | Interview Studio',

  projectId,
  dataset,

  theme: studioTheme,

  plugins: [
    structureTool({
      structure: (S) => deskStructure(S),
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
    assist(),
    skillsToolPlugin(),
  ],

  document: {
    actions: (prev) => [
      perspectiveSwitcherAction,
      viewOnSiteAction,
      openInPresentationAction,
      ...prev.map((originalAction) =>
        originalAction.action === 'publish'
          ? createPublishAndRefreshAction(originalAction)
          : originalAction,
      ),
    ],
    badges: (prev, context) => {
      const schemaType = (context as {schemaType?: string}).schemaType
      if (!schemaType) return prev
      return [...prev, ...studioBadges]
    },
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
    ] as any,
  },

  components: {
    welcome: Welcome,
  },
})
