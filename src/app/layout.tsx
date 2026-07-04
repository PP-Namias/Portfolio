import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import { Providers } from './providers'
import { fallbackCmsContent } from '@/lib/cms-content.shared'
import { FloatingHubWithBoundary } from '@/components/ui/FloatingHub'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { Analytics } from '@/components/ui/Analytics'
import { MagicCursor } from '@/components/ui/MagicCursor'
import { JsonLd } from '@/components/seo/JsonLd'
import { getCmsContent } from '@/lib/cms-content.server'
import { IS_MAGIC_CURSOR_VISIBLE } from '@/lib/features'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-config'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const fallbackSeo = fallbackCmsContent.seoSettings

export async function generateMetadata(): Promise<Metadata> {
  const cmsContent = await getCmsContent()
  const seo = cmsContent.seoSettings || fallbackSeo

  return {
    title: seo.siteTitle,
    description: seo.siteDescription,
    metadataBase: new URL(seo.canonicalUrl || fallbackSeo.canonicalUrl),
    alternates: {
      canonical: seo.canonicalUrl || fallbackSeo.canonicalUrl,
    },
    robots: {
      index: !seo.noindex,
      follow: !seo.nofollow,
    },
    openGraph: {
      title: seo.siteTitle,
      description: seo.siteDescription,
      siteName: 'Jhon Keneth Namias Portfolio',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@PP_Namias',
      title: seo.siteTitle,
      description: seo.siteDescription,
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/apple-touch-icon.svg',
    },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Jhon Keneth Ryan Namias',
      jobTitle: 'Full Stack Engineer & AI Automation Specialist',
      url: SITE_URL,
      email: 'pp.namias@gmail.com',
      image: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Jhon Keneth Ryan Namias - Full Stack Developer',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Caloocan City',
        addressCountry: 'PH',
      },
      sameAs: [
        'https://github.com/PP-Namias',
        'https://www.linkedin.com/in/pp-namias/',
        'https://x.com/PP_Namias',
        'https://www.facebook.com/profile.php?id=100093808752066',
      ],
      knowsAbout: [
        'React',
        'TypeScript',
        'Node.js',
        'Next.js',
        'Python',
        'AI Automation',
        'Prompt Engineering',
      ],
    },
  ],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // In test environments (Vitest) return a synchronous layout using the
  // fallback CMS content so unit tests can import and render the layout
  // without awaiting async data fetches.
  const isTest = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test'

  if (isTest) {
    const cmsContent = fallbackCmsContent

    return (
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <head>
          <link rel="dns-prefetch" href="https://cdn.sanity.io" />
          <link rel="preconnect" href="https://cdn.sanity.io" />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://cloud.umami.is" />
          <link rel="preconnect" href="https://cloud.umami.is" />
          <JsonLd data={jsonLd} id="layout-jsonld-test" />
          <Analytics />
        </head>
        <body className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark min-h-screen font-sans antialiased">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-pink focus:text-white focus:text-sm focus:font-medium focus:outline-none"
          >
            Skip to main content
          </a>
          <Providers cmsContent={cmsContent}>
            {children}
            <MagicCursor />
            <FloatingHubWithBoundary />
            <ScrollToTop />
          </Providers>
        </body>
      </html>
    )
  }

  // Non-test runtime: fetch CMS content and check draft-mode status so the
  // Presentation tool iframe can handshake with the marketing site and
  // trigger refetches on save.
  const [cmsContent, isDraftMode] = await Promise.all([
    getCmsContent(),
    draftMode().then((d) => d.isEnabled),
  ])

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cloud.umami.is" />
        <link rel="preconnect" href="https://cloud.umami.is" />
        <JsonLd data={jsonLd} id="layout-jsonld-runtime" />
        <Analytics />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-pink focus:text-white focus:text-sm focus:font-medium focus:outline-none"
        >
          Skip to main content
        </a>
        <Providers cmsContent={cmsContent}>
          {IS_MAGIC_CURSOR_VISIBLE ? <MagicCursor /> : null}
          {children}
          <FloatingHubWithBoundary />
          <ScrollToTop />
          {isDraftMode ? <VisualEditing /> : null}
        </Providers>
      </body>
    </html>
  )
}
