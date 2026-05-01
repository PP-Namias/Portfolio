import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { FloatingHub } from '@/components/ui/FloatingHub';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { Analytics } from '@/components/ui/Analytics';
import { getProfile } from '@/data/profile';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  
  return {
    title: `${profile.name} | ${profile.title}`,
    description: profile.summary.substring(0, 160) + '...',
    metadataBase: new URL('https://namias.tech'),
    openGraph: {
      title: `${profile.name} | ${profile.title}`,
      description: profile.summary.substring(0, 160) + '...',
      siteName: `${profile.name} Portfolio`,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${profile.name} portfolio preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.name} | ${profile.title}`,
      description: profile.summary.substring(0, 160) + '...',
      images: ['/twitter-image'],
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/apple-touch-icon.svg',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://namias.tech/#website',
        url: 'https://namias.tech',
        name: `${profile.name} — Portfolio`,
        description: profile.summary,
      },
      {
        '@type': 'Person',
        '@id': 'https://namias.tech/#person',
        name: profile.name,
        jobTitle: profile.title,
        url: 'https://namias.tech',
        email: profile.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: profile.location.split(',')[0].trim(),
          addressCountry: profile.location.split(',')[1]?.trim() || '',
        },
        sameAs: [
          profile.github,
          profile.linkedin,
        ].filter(Boolean),
        knowsAbout: profile.highlights.primaryTechnologies,
      },
    ],
  };

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
        <Providers>
          {children}
          <FloatingHub />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
