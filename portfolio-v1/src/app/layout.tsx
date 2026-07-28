import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';
import { Providers } from './providers';
import { fallbackCmsContent } from '@/lib/cms-content.shared';
import { FloatingHubWithBoundary } from '@/components/ui/FloatingHub';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { Analytics } from '@/components/ui/Analytics';
import { MagicCursor } from '@/components/ui/MagicCursor';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { ServiceWorkerManager } from '@/components/ui/ServiceWorkerManager';
import { JsonLd } from '@/components/seo/JsonLd';
import { getCmsContent } from '@/lib/cms-content.server';
import { IS_MAGIC_CURSOR_VISIBLE, IS_PWA_ENABLED, IS_STREAMING_SSR_ENABLED } from '@/lib/features';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-config';
import { fetchSeoData } from '@/lib/sections/seo.server';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-inter',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

const fallbackSeo = fallbackCmsContent.seoSettings;

export const viewport: Viewport = {
  themeColor: '#000000',
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = IS_STREAMING_SSR_ENABLED
    ? await fetchSeoData()
    : (await getCmsContent()).seoSettings || fallbackSeo;

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
    manifest: '/site.webmanifest',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'JN Portfolio',
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/apple-touch-icon.png',
    },
  };
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
      knowsAbout: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'AI Automation', 'Prompt Engineering'],
    },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isTest = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';

  if (isTest) {
    const cmsContent = fallbackCmsContent;

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
          <style>{`body{font-family:system-ui,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;}a:focus-visible{outline:2px solid #db2777;outline-offset:2px;border-radius:8px;}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;}`}</style>
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
            <OfflineBanner />
          </Providers>
        </body>
      </html>
    );
  }

  const isDraftMode = await draftMode().then((d) => d.isEnabled);

  if (IS_STREAMING_SSR_ENABLED) {
    const [seoData] = await Promise.all([fetchSeoData()]);

    const streamingCmsContent = {
      ...fallbackCmsContent,
      seoSettings: {
        ...fallbackCmsContent.seoSettings,
        siteTitle: seoData.siteTitle,
        siteDescription: seoData.siteDescription,
        canonicalUrl: seoData.canonicalUrl,
        ogImageUrl: seoData.ogImageUrl,
        twitterImageUrl: seoData.twitterImageUrl,
        noindex: seoData.noindex,
        nofollow: seoData.nofollow,
      },
    };

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
          <style>{`body{font-family:system-ui,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;}.font-inter{font-family:var(--font-inter),system-ui,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;}a:focus-visible{outline:2px solid #db2777;outline-offset:2px;border-radius:8px;}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;}`}</style>
          <JsonLd data={jsonLd} id="layout-jsonld-streaming" />
          <Analytics />
        </head>
        <body className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark min-h-screen font-sans antialiased">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-pink focus:text-white focus:text-sm focus:font-medium focus:outline-none"
          >
            Skip to main content
          </a>
          <Providers cmsContent={streamingCmsContent} isDraftMode={isDraftMode}>
            {IS_MAGIC_CURSOR_VISIBLE ? <MagicCursor /> : null}
            {children}
            <FloatingHubWithBoundary />
            <ScrollToTop />
            <OfflineBanner />
            {IS_PWA_ENABLED ? <ServiceWorkerManager /> : null}
            {isDraftMode ? <VisualEditing /> : null}
          </Providers>
        </body>
      </html>
    );
  }

  const cmsContent = await getCmsContent();

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
          <style>{`body{font-family:system-ui,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;}a:focus-visible{outline:2px solid #db2777;outline-offset:2px;border-radius:8px;}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;}`}</style>
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
        <Providers cmsContent={cmsContent} isDraftMode={isDraftMode}>
          {IS_MAGIC_CURSOR_VISIBLE ? <MagicCursor /> : null}
          {children}
          <FloatingHubWithBoundary />
          <ScrollToTop />
          <OfflineBanner />
          {IS_PWA_ENABLED ? <ServiceWorkerManager /> : null}
          {isDraftMode ? <VisualEditing /> : null}
        </Providers>
      </body>
    </html>
  );
}
