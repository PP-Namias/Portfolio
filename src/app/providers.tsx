'use client'

import { ThemeProvider } from 'next-themes'
import { ReactLenis } from 'lenis/react'
import { AccentColorProvider } from '@/hooks/useAccentColor'
import { ModalProvider } from '@/hooks/useModal'
import { CmsContentProvider } from '@/hooks/useCmsContent'
import type { CmsContent } from '@/lib/cms-content.shared'
import { SwrConfigProvider } from '@/lib/swr-config'
import { SITE_URL } from '@/lib/site-config'
import { useEffect, useMemo } from 'react'
import { IS_REACT_SCAN_ENABLED } from '@/lib/features'

if (IS_REACT_SCAN_ENABLED && typeof window !== 'undefined') {
  import('react-scan').then((scan) => {
    scan.scan({
      enabled: process.env.NODE_ENV === 'development',
    })
  })
}

interface ProvidersProps {
  readonly children: React.ReactNode
  readonly cmsContent?: CmsContent
  readonly isDraftMode?: boolean
}

function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Non-critical — proceed without service worker
      })
    }
  }, [])
}

const EMPTY_CMS_CONTENT = {
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
} as CmsContent

export function Providers({ children, cmsContent }: ProvidersProps) {
  useServiceWorker()
  const resolvedCmsContent = cmsContent ?? EMPTY_CMS_CONTENT

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
  )
}
