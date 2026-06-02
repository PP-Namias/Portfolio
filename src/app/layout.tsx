import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';
import { Providers } from './providers';
import { fallbackCmsContent } from '@/lib/cms-content.shared';
import { FloatingHub } from '@/components/ui/FloatingHub';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { Analytics } from '@/components/ui/Analytics';
import { getCmsContent } from '@/lib/cms-content.server';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fallbackSeo = fallbackCmsContent.seoSettings;

export async function generateMetadata(): Promise<Metadata> {
  const cmsContent = await getCmsContent();
  const seo = cmsContent.seoSettings || fallbackSeo;

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
      images: [
        {
          url: seo.ogImageUrl || fallbackSeo.ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Jhon Keneth Namias portfolio preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.siteTitle,
      description: seo.siteDescription,
      images: [seo.twitterImageUrl || seo.ogImageUrl || fallbackSeo.twitterImageUrl],
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/apple-touch-icon.svg',
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://namias.tech/#website',
      url: 'https://namias.tech',
      name: 'Jhon Keneth Ryan Namias — Portfolio',
      description:
        'Portfolio of Jhon Keneth Ryan Namias — Full Stack Engineer & AI Automation Specialist based in the Philippines.',
    },
    {
      '@type': 'Person',
      '@id': 'https://namias.tech/#person',
      name: 'Jhon Keneth Ryan Namias',
      jobTitle: 'Full Stack Engineer & AI Automation Specialist',
      url: 'https://namias.tech',
      email: 'pp.namias@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Caloocan City',
        addressCountry: 'PH',
      },
      sameAs: [
        'https://github.com/PP-Namias',
        'https://www.linkedin.com/in/pp-namias/',
      ],
      knowsAbout: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'AI Automation', 'Prompt Engineering'],
    },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // In test environments (Vitest) return a synchronous layout using the
  // fallback CMS content so unit tests can import and render the layout
  // without awaiting async data fetches.
  const isTest = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';

  if (isTest) {
    const cmsContent = fallbackCmsContent;

    return (
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
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
            <FloatingHub />
            <ScrollToTop />
          </Providers>
        </body>
      </html>
    );
  }

  // Non-test runtime: fetch CMS content and check draft-mode status so the
  // Presentation tool iframe can handshake with the marketing site and
  // trigger refetches on save.
  const [cmsContent, isDraftMode] = await Promise.all([getCmsContent(), draftMode().then((d) => d.isEnabled)]);

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
          {children}
          <FloatingHub />
          <ScrollToTop />
          {isDraftMode ? <VisualEditing /> : null}
        </Providers>
      </body>
    </html>
  );
}
