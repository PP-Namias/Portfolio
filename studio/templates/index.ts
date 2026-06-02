import type {InitialValueTemplateItem} from 'sanity'

const today = () => new Date().toISOString().slice(0, 10)

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96)
}

export const projectTemplates: InitialValueTemplateItem[] = [
  {
    id: 'project-draft',
    title: 'New project (draft)',
    description: 'Project with status=draft and current year pre-filled.',
    schemaType: 'project',
    value: ({title}: {title?: string}) => ({
      title: title || 'New project',
      slug: {current: slugify(title || 'new-project'), _type: 'slug'},
      status: 'draft',
      year: new Date().getFullYear(),
      featured: false,
      achievements: [],
      gallery: [],
      technologies: [],
    }),
  } as any,
  {
    id: 'project-featured',
    title: 'New project (featured)',
    description: 'Project with status=completed and featured=true.',
    schemaType: 'project',
    value: ({title}: {title?: string}) => ({
      title: title || 'New featured project',
      slug: {current: slugify(title || 'new-featured-project'), _type: 'slug'},
      status: 'completed',
      featured: true,
      year: new Date().getFullYear(),
      achievements: [],
      gallery: [],
      technologies: [],
    }),
  } as any,
]

export const experienceTemplates: InitialValueTemplateItem[] = [
  {
    id: 'experience-current',
    title: 'New experience (current)',
    description: 'Experience with endDate="Present" and startDate=today.',
    schemaType: 'experience',
    value: () => ({
      startDate: today(),
      endDate: 'Present',
      status: 'published',
      employmentType: 'Full-time',
      workModel: 'Remote',
      highlights: [],
      achievements: [],
      tags: [],
      images: [],
    }),
  } as any,
]

export const certificationTemplates: InitialValueTemplateItem[] = [
  {
    id: 'certification-new',
    title: 'New certification',
    description: 'Certification with issueDate=today and neverExpires=false.',
    schemaType: 'certification',
    value: () => ({
      issuedAt: today(),
      neverExpires: false,
    }),
  } as any,
]

export const postTemplates: InitialValueTemplateItem[] = [
  {
    id: 'post-draft',
    title: 'New blog post (draft)',
    description: 'Post with published=false and publishedAt=today.',
    schemaType: 'post',
    value: ({title}: {title?: string}) => ({
      title: title || 'New post',
      slug: {current: slugify(title || 'new-post'), _type: 'slug'},
      published: false,
      featured: false,
      publishedAt: new Date().toISOString(),
      tags: [],
      categories: [],
    }),
  } as any,
]

export const membershipTemplates: InitialValueTemplateItem[] = [
  {
    id: 'membership-new',
    title: 'New membership',
    description: 'Membership with joinedAt=today.',
    schemaType: 'membership',
    value: ({title}: {title?: string}) => ({
      name: title || 'New membership',
      joinedAt: today(),
    }),
  } as any,
]

export const recommendationTemplates: InitialValueTemplateItem[] = [
  {
    id: 'recommendation-featured',
    title: 'New recommendation (featured)',
    description: 'Recommendation with featured=true.',
    schemaType: 'recommendation',
    value: ({title}: {title?: string}) => ({
      name: title || 'New recommender',
      featured: true,
    }),
  } as any,
  {
    id: 'recommendation-draft',
    title: 'New recommendation (draft)',
    description: 'Recommendation with featured=false.',
    schemaType: 'recommendation',
    value: ({title}: {title?: string}) => ({
      name: title || 'New recommender',
      featured: false,
    }),
  } as any,
]

export const galleryImageTemplates: InitialValueTemplateItem[] = [
  {
    id: 'gallery-image-new',
    title: 'New gallery image',
    description: 'Image with order=0 and tags=[] pre-filled.',
    schemaType: 'galleryImage',
    value: ({title}: {title?: string}) => ({
      title: title || 'New gallery image',
      order: 0,
      tags: [],
    }),
  } as any,
]

export const templateRegistry: Record<string, InitialValueTemplateItem[]> = {
  project: projectTemplates,
  experience: experienceTemplates,
  certification: certificationTemplates,
  post: postTemplates,
  membership: membershipTemplates,
  recommendation: recommendationTemplates,
  galleryImage: galleryImageTemplates,
}
