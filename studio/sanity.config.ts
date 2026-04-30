import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schema } from '../sanity/schema';

export default defineConfig({
  basePath: '/',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your_project_id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: 'Portfolio Studio',
  plugins: [deskTool()],
  schema: {
    types: schema.types,
  },
});
