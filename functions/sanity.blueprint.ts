/**
 * Sanity Blueprint manifest for the Namias CMS showcase functions.
 *
 * Deploy with:
 *   cd functions
 *   npx sanity@latest blueprints deploy
 *
 * Or, after upgrading the studio CLI:
 *   npm install -g sanity@latest
 *   sanity blueprints deploy
 *
 * The manifest references the function code in each subfolder. The Sanity
 * platform reads the `trigger` to wire the function into the right
 * event source (cron, document mutation, or image asset creation).
 */
import {defineBlueprint, defineFunction} from 'sanity'

const scheduledPublish = defineFunction({
  type: 'sanity.function',
  name: 'scheduled-publish',
  path: './scheduled-publish',
  trigger: {type: 'scheduled', schedule: '*/5 * * * *'},
  memory: 256,
  timeout: 60,
  env: {
    SANITY_STUDIO_PROJECT_ID: 'nl0qw78w',
    SANITY_STUDIO_DATASET: 'production',
  },
  secret: 'SANITY_API_WRITE_TOKEN',
})

const brokenRefs = defineFunction({
  type: 'sanity.function',
  name: 'broken-refs',
  path: './broken-refs',
  trigger: {type: 'scheduled', schedule: '0 */6 * * *'},
  memory: 512,
  timeout: 120,
  env: {
    SANITY_STUDIO_PROJECT_ID: 'nl0qw78w',
    SANITY_STUDIO_DATASET: 'production',
  },
  secret: 'SANITY_API_WRITE_TOKEN',
})

const autoTagImages = defineFunction({
  type: 'sanity.function',
  name: 'auto-tag-images',
  path: './auto-tag-images',
  trigger: {type: 'image-asset', event: 'create'},
  memory: 512,
  timeout: 60,
  env: {
    SANITY_STUDIO_PROJECT_ID: 'nl0qw78w',
    SANITY_STUDIO_DATASET: 'production',
  },
  secret: 'SANITY_API_WRITE_TOKEN',
})

export default defineBlueprint({
  name: 'namias-cms-showcase-functions',
  title: 'Namias CMS Showcase Functions',
  description:
    'Server-side functions that power the showcase: scheduled publish promoter, broken-reference scanner, and image auto-tagger.',
  resources: [scheduledPublish, brokenRefs, autoTagImages],
})
