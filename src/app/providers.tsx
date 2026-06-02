'use client';

import { ThemeProvider } from 'next-themes';
import { ReactLenis } from 'lenis/react';
import { AccentColorProvider } from '@/hooks/useAccentColor';
import { ModalProvider } from '@/hooks/useModal';
import { CmsContentProvider } from '@/hooks/useCmsContent';
import type { CmsContent } from '@/lib/cms-content.shared';
import React from 'react';

interface ProvidersProps {
  readonly children: React.ReactNode;
  readonly cmsContent?: CmsContent;
  readonly isDraftMode?: boolean;
}

export function Providers({ children, cmsContent }: ProvidersProps) {
  const resolvedCmsContent = cmsContent ?? {
    seoSettings: {
      siteTitle: '',
      siteDescription: '',
      canonicalUrl: 'https://namias.tech',
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
  } as CmsContent;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AccentColorProvider>
        <CmsContentProvider value={resolvedCmsContent}>
          <ModalProvider>
            <ReactLenis
              root
              options={{
                lerp: 0.12,
                duration: 1.2,
                smoothWheel: true,
                touchMultiplier: 1.5,
                wheelMultiplier: 1,
              }}
            >
              {children}
            </ReactLenis>
          </ModalProvider>
        </CmsContentProvider>
      </AccentColorProvider>
    </ThemeProvider>
  );
}
