'use client';

import { ThemeProvider } from 'next-themes';
import { ReactLenis } from 'lenis/react';
import { AccentColorProvider } from '@/hooks/useAccentColor';
import { ModalProvider } from '@/hooks/useModal';
import { CmsContentProvider } from '@/hooks/useCmsContent';
import type { CmsContent } from '@/lib/cms-content.shared';
import { SwrConfigProvider } from '@/lib/swr-config';
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
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Non-critical — proceed without service worker
      });
    }
  }, []);
}

let nextThemesScriptWarningFilterInstalled = false;
let originalConsoleError: typeof console.error | null = null;

function installNextThemesScriptWarningFilter() {
  if (nextThemesScriptWarningFilterInstalled) return;
  if (typeof console === 'undefined') return;
  if (process.env.NODE_ENV === 'production') return;

  nextThemesScriptWarningFilterInstalled = true;
  originalConsoleError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === 'string' &&
      first.includes('Encountered a script tag while rendering React component')
    ) {
      return;
    }
    if (originalConsoleError) {
      originalConsoleError.apply(console, args as Parameters<typeof console.error>);
    }
  };
}

export function Providers({ children, cmsContent }: ProvidersProps) {
  installNextThemesScriptWarningFilter();
  useServiceWorker();
  const resolvedCmsContent = cmsContent ?? {
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
  } as CmsContent;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AccentColorProvider>
        <CmsContentProvider value={resolvedCmsContent}>
          <ModalProvider>
            <SwrConfigProvider>
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
            </SwrConfigProvider>
          </ModalProvider>
        </CmsContentProvider>
      </AccentColorProvider>
    </ThemeProvider>
  );
}
