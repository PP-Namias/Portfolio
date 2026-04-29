import { type SchemaTypeDefinition } from 'sanity';

// Phase 2: Core Schemas
const profile: SchemaTypeDefinition = {
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'alias', title: 'Alias', type: 'string' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'about', title: 'About', type: 'text' },
  ],
};

const project: SchemaTypeDefinition = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'id', title: 'ID', type: 'string' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'imagePath', title: 'Image', type: 'image' },
    { name: 'techStack', title: 'Tech Stack', type: 'array', of: [{ type: 'string' }] },
    { name: 'detailURL', title: 'Detail URL', type: 'url' },
    { name: 'liveURL', title: 'Live URL', type: 'url' },
    { name: 'repositoryURL', title: 'Repository URL', type: 'url' },
  ],
};

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [profile, project],
};
