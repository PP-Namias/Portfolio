import type {
  BlogPost,
  Certification,
  Experience,
  GalleryItem,
  Membership,
  Profile,
  Project,
  Recommendation,
  SocialLink,
  Technology,
} from '@/types';

export interface CmsContent {
  profile: Profile;
  siteSettings: {
    footer: {
      leadText: string;
      linkLabel: string;
      copyright: string;
      backToPortfolioLabel: string;
      contactPrompt: string;
    };
    blog: {
      title: string;
      description: string;
      backLabel: string;
    };
  };
  hero: {
    roles: string[];
    availabilityLabel: string;
    profileImageUrl: string;
  };
  about: {
    paragraphs: string[];
  };
  experiences: Experience[];
  projects: Project[];
  certifications: Certification[];
  galleryImages: GalleryItem[];
  memberships: Membership[];
  recommendations: Recommendation[];
  socialLinks: SocialLink[];
  technologies: Technology[];
  techCategories: Record<string, Technology[]>;
  blogPosts: BlogPost[];
}

export function buildTechCategories(technologies: Technology[]): Record<string, Technology[]> {
  return technologies.reduce<Record<string, Technology[]>>((acc, technology) => {
    if (!acc[technology.category]) {
      acc[technology.category] = [];
    }

    acc[technology.category].push(technology);
    return acc;
  }, {});
}

const emptyProfile: Profile = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  github: '',
  linkedin: '',
  summary: '',
  highlights: {
    yearsExperience: 0,
    projectsCompleted: 0,
    primaryTechnologies: [],
  },
  education: [],
};

export const fallbackCmsContent: CmsContent = {
  profile: emptyProfile,
  siteSettings: {
    footer: {
      leadText: '',
      linkLabel: '',
      copyright: '',
      backToPortfolioLabel: 'Back to Portfolio',
      contactPrompt: 'Send a message',
    },
    blog: {
      title: 'Blog',
      description: 'Thoughts on AI, software engineering, cloud development, and more.',
      backLabel: 'Back to Portfolio',
    },
  },
  hero: {
    roles: [],
    availabilityLabel: '',
    profileImageUrl: '',
  },
  about: {
    paragraphs: [],
  },
  experiences: [],
  projects: [],
  certifications: [],
  galleryImages: [],
  memberships: [],
  recommendations: [],
  socialLinks: [],
  technologies: [],
  techCategories: {},
  blogPosts: [],
};
