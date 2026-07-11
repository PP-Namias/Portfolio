export const isSanityCutoverEnabled = process.env.NEXT_PUBLIC_SANITY_CUTOVER_ENABLED === 'true';

export type ContentSourceMode = 'sanity-ready';

export const contentSourceMode: ContentSourceMode = 'sanity-ready';

export const contentSourceCatalog = [
  { sourceFile: 'profile (archived migration fixture)', targetModel: 'profile singleton document' },
  { sourceFile: 'experiences (archived migration fixture)', targetModel: 'experience documents' },
  { sourceFile: 'projects (archived migration fixture)', targetModel: 'project documents' },
  { sourceFile: 'certifications (archived migration fixture)', targetModel: 'certification documents' },
  { sourceFile: 'gallery (archived migration fixture)', targetModel: 'galleryImage documents' },
  { sourceFile: 'technologies (archived migration fixture)', targetModel: 'techStack singleton document' },
  { sourceFile: 'blog (archived migration fixture)', targetModel: 'post documents' },
  { sourceFile: 'socials (archived migration fixture)', targetModel: 'profile.socialLinks nested array' },
  { sourceFile: 'memberships (archived migration fixture)', targetModel: 'membership documents' },
  { sourceFile: 'recommendations (archived migration fixture)', targetModel: 'recommendation documents' },
] as const;

export const contentSourceSummary = contentSourceCatalog
  .map((entry) => `${entry.sourceFile} -> ${entry.targetModel}`)
  .join('\n');
