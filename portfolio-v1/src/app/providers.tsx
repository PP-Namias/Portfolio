'use client';

import { ThemeProvider } from 'next-themes';
import { AccentColorProvider } from '@/hooks/useAccentColor';
import { ModalProvider } from '@/hooks/useModal';
import { CmsContentProvider } from '@/hooks/useCmsContent';
import type { CmsContent } from '@/lib/cms-content.shared';
import { SwrConfigProvider } from '@/lib/swr-config';
import { LenisProvider } from '@/components/ui/LenisProvider';
import { SITE_URL } from '@/lib/site-config';
import { useEffect } from 'react';

interface ProvidersProps {
  readonly children: React.ReactNode;
  readonly cmsContent?: CmsContent;
  readonly isDraftMode?: boolean;
}

function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
      if ('requestIdleCallback' in window) {
        requestIdleCallback(register, { timeout: 3000 });
      } else {
        setTimeout(register, 2000);
      }
    }
  }, []);
}

export function Providers({ children, cmsContent }: ProvidersProps) {
  useServiceWorker();
  const resolvedCmsContent = cmsContent ?? {
    seoSettings: {
      siteTitle: '',
      siteDescription: '',
      canonicalUrl: SITE_URL,
      ogImageUrl: '/og-image.png',
      twitterImageUrl: '/og-image.png',
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
            <SwrConfigProvider>
              <LenisProvider>
                {children}
              </LenisProvider>
            </SwrConfigProvider>
          </ModalProvider>
        </CmsContentProvider>
      </AccentColorProvider>
    </ThemeProvider>
  );
}
