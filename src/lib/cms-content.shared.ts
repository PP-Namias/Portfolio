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
  seoSettings: {
    siteTitle: string;
    siteDescription: string;
    canonicalUrl: string;
    ogImageUrl: string;
    twitterImageUrl: string;
    noindex: boolean;
    nofollow: boolean;
  };
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

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'hello-world',
    title: 'Hello World',
    excerpt: 'Intro',
    content: '# Hello World\n\nThis is the first post in the portfolio blog.',
    date: '2026-01-10',
    readTime: '5 min',
    tags: ['AI', 'Web'],
    coverImage: '/images/blog/hello-world.jpg',
    featured: true,
    metaTitle: 'Hello World',
    metaDescription: 'Intro post for the portfolio blog.',
  },
  {
    id: '2',
    slug: 'deep-dive',
    title: 'Deep Dive',
    excerpt: 'Deep dive',
    content: '## Deep Dive\n\nA deeper look at the work behind the portfolio.',
    date: '2026-02-20',
    readTime: '7 min',
    tags: ['Cloud', 'Next.js'],
    coverImage: '/images/blog/deep-dive.jpg',
    featured: false,
    metaTitle: 'Deep Dive',
    metaDescription: 'A deeper look at the work behind the portfolio.',
  },
];

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
  seoSettings: {
    siteTitle: 'Jhon Keneth Namias | Portfolio king of stuff',
    siteDescription: 'Personal portfolio of Jhon Keneth Namias.',
    canonicalUrl: 'https://namias.tech',
    ogImageUrl: '/og-image.svg',
    twitterImageUrl: '/og-image.svg',
    noindex: false,
    nofollow: false,
  },
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

fallbackCmsContent.blogPosts = fallbackBlogPosts;
