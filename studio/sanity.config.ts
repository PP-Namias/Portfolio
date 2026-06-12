import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
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
import {ContentHealth} from './components/inspector/ContentHealth'
import {SeoPreview} from './components/inspector/SeoPreview'
import {JsonInspector} from './components/inspector/JsonInspector'
import {studioTheme} from './theme/studioTheme'
import './theme/grid.css'
import {savedQueriesToolPlugin} from './vision/SavedQueriesView'
import {deskStructure} from './structure/deskStructure'
import {PresentationNavigator} from './presentation/PresentationNavigator'
import {getDraftModeEnablePath, getStudioPreviewOrigin, loadStudioEnvironment, requireStudioEnv} from './env'

loadStudioEnvironment()

const presentationPreviewUrl = getStudioPreviewOrigin()
const presentationEnablePath = getDraftModeEnablePath()
const projectId = requireStudioEnv('SANITY_STUDIO_PROJECT_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID')
const dataset = requireStudioEnv('SANITY_STUDIO_DATASET', 'NEXT_PUBLIC_SANITY_DATASET')

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
          ...previewLocations,
        },
      },
      components: {
        unstable_navigator: {
          component: PresentationNavigator,
        },
      },
    }),
    visionTool(),
    assist(),
    savedQueriesToolPlugin(),
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
    inspectionPanels: [
      {
        name: 'content-health',
        component: ContentHealth,
        options: {
          layout: 'panel',
        },
      },
      {
        name: 'seo-preview',
        component: SeoPreview,
        options: {
          layout: 'panel',
        },
      },
      {
        name: 'json-inspector',
        component: JsonInspector,
        options: {
          layout: 'panel',
        },
      },
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
    ] as any,
  },

  components: {
    welcome: Welcome,
  },
})
