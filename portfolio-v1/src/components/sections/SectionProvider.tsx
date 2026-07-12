'use client';

import { CmsContentProvider } from '@/hooks/useCmsContent';
import type { CmsContent } from '@/lib/cms-content.shared';
import { SITE_URL } from '@/lib/site-config';

const emptyCmsContent: CmsContent = {
  seoSettings: {
    siteTitle: '',
    siteDescription: '',
    canonicalUrl: SITE_URL,
    ogImageUrl: '/og-image.svg',
    twitterImageUrl: '/og-image.svg',
    noindex: false,
    nofollow: false,
  },
  profile: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    summary: '',
    highlights: { yearsExperience: 0, projectsCompleted: 0, primaryTechnologies: [] },
    education: [],
  },
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
      description: '',
      backLabel: 'Back to Portfolio',
    },
  },
  hero: { roles: [], availabilityLabel: '', profileImageUrl: '' },
  about: { paragraphs: [] },
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

interface SectionProviderProps {
  readonly children: React.ReactNode;
  readonly data: Partial<CmsContent>;
}

export function SectionProvider({ children, data }: SectionProviderProps) {
  const merged: CmsContent = {
    ...emptyCmsContent,
    ...data,
    seoSettings: { ...emptyCmsContent.seoSettings, ...(data.seoSettings ?? {}) },
    profile: { ...emptyCmsContent.profile, ...(data.profile ?? {}) },
    siteSettings: {
      footer: { ...emptyCmsContent.siteSettings.footer, ...(data.siteSettings?.footer ?? {}) },
      blog: { ...emptyCmsContent.siteSettings.blog, ...(data.siteSettings?.blog ?? {}) },
    },
    hero: { ...emptyCmsContent.hero, ...(data.hero ?? {}) },
    about: { ...emptyCmsContent.about, ...(data.about ?? {}) },
  };

  return (
    <CmsContentProvider value={merged}>
      {children}
    </CmsContentProvider>
  );
}
