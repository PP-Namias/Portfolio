import { type SchemaTypeDefinition } from 'sanity';

const profileHighlights: SchemaTypeDefinition = {
  name: 'profileHighlights',
  title: 'Profile Highlights',
  type: 'object',
  fields: [
    { name: 'yearsExperience', title: 'Years of Experience', type: 'number' },
    { name: 'projectsCompleted', title: 'Projects Completed', type: 'number' },
    {
      name: 'primaryTechnologies',
      title: 'Primary Technologies',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
};

const education: SchemaTypeDefinition = {
  name: 'education',
  title: 'Education',
  type: 'object',
  fields: [
    { name: 'degree', title: 'Degree', type: 'string' },
    { name: 'institution', title: 'Institution', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'startedAt', title: 'Started At', type: 'string' },
    { name: 'endedAt', title: 'Ended At', type: 'string' },
    { name: 'gpa', title: 'GPA', type: 'string' },
    { name: 'honors', title: 'Honors', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'relevantCourses',
      title: 'Relevant Courses',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
};

const profile: SchemaTypeDefinition = {
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'github', title: 'GitHub', type: 'url' },
    { name: 'linkedin', title: 'LinkedIn', type: 'url' },
    { name: 'summary', title: 'Summary', type: 'text' },
    { name: 'highlights', title: 'Highlights', type: 'profileHighlights' },
    { name: 'education', title: 'Education', type: 'array', of: [{ type: 'education' }] },
  ],
};

const experience: SchemaTypeDefinition = {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'position', title: 'Position', type: 'string' },
    { name: 'summary', title: 'Summary', type: 'text' },
    { name: 'country', title: 'Country', type: 'string' },
    { name: 'modality', title: 'Modality', type: 'string' },
    { name: 'type', title: 'Type', type: 'string' },
    { name: 'startedAt', title: 'Started At', type: 'string' },
    { name: 'endedAt', title: 'Ended At', type: 'string' },
    { name: 'technologies', title: 'Technologies', type: 'array', of: [{ type: 'string' }] },
    { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
    { name: 'achievements', title: 'Achievements', type: 'array', of: [{ type: 'string' }] },
    { name: 'relatedProjects', title: 'Related Projects', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],
};

const projectImpactMetric: SchemaTypeDefinition = {
  name: 'projectImpactMetric',
  title: 'Project Impact Metric',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'value', title: 'Value', type: 'string' },
  ],
};

const projectGalleryItem: SchemaTypeDefinition = {
  name: 'projectGalleryItem',
  title: 'Project Gallery Item',
  type: 'object',
  fields: [
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'caption', title: 'Caption', type: 'string' },
  ],
};

const project: SchemaTypeDefinition = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'repositoryURL', title: 'Repository URL', type: 'url' },
    { name: 'liveURL', title: 'Live URL', type: 'url' },
    { name: 'processURL', title: 'Process URL', type: 'url' },
    { name: 'detailURL', title: 'Detail URL', type: 'url' },
    { name: 'previewVideoURL', title: 'Preview Video URL', type: 'url' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'year', title: 'Year', type: 'number' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    {
      name: 'impactMetrics',
      title: 'Impact Metrics',
      type: 'array',
      of: [{ type: 'projectImpactMetric' }],
    },
    { name: 'featuredRank', title: 'Featured Rank', type: 'number' },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Prototype', value: 'prototype' },
        ],
      },
    },
    { name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'projectGalleryItem' }] },
  ],
};

const certification: SchemaTypeDefinition = {
  name: 'certification',
  title: 'Certification',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'issuer', title: 'Issuer', type: 'string' },
    { name: 'issuedAt', title: 'Issued At', type: 'string' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
  ],
};

const technology: SchemaTypeDefinition = {
  name: 'technology',
  title: 'Technology',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'string' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'proficiency', title: 'Proficiency', type: 'number' },
  ],
};

const recommendation: SchemaTypeDefinition = {
  name: 'recommendation',
  title: 'Recommendation',
  type: 'document',
  fields: [
    { name: 'quote', title: 'Quote', type: 'text' },
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'company', title: 'Company', type: 'string' },
  ],
};

const membership: SchemaTypeDefinition = {
  name: 'membership',
  title: 'Membership',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'url', title: 'URL', type: 'url' },
    { name: 'joinedAt', title: 'Joined At', type: 'string' },
  ],
};

const galleryItem: SchemaTypeDefinition = {
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'mediaType', title: 'Media Type', type: 'string' },
    { name: 'media', title: 'Media', type: 'image', options: { hotspot: true } },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'createdAt', title: 'Created At', type: 'string' },
  ],
};

const socialLink: SchemaTypeDefinition = {
  name: 'socialLink',
  title: 'Social Link',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'icon', title: 'Icon', type: 'string' },
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'link', title: 'Link', type: 'url' },
    { name: 'featured', title: 'Featured', type: 'boolean' },
  ],
};

const blogPost: SchemaTypeDefinition = {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'id', title: 'ID', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'excerpt', title: 'Excerpt', type: 'text' },
    { name: 'content', title: 'Content', type: 'text' },
    { name: 'date', title: 'Date', type: 'date' },
    { name: 'readTime', title: 'Read Time', type: 'string' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
  ],
};

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    profileHighlights,
    education,
    projectImpactMetric,
    projectGalleryItem,
    profile,
    experience,
    project,
    certification,
    technology,
    recommendation,
    membership,
    galleryItem,
    socialLink,
    blogPost,
  ],
};
