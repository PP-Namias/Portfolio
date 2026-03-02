import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { FloatingHub } from '@/components/ui/FloatingHub';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Jhon Keneth Ryan Namias — Full Stack Engineer & AI Automation Specialist',
  description:
    'Portfolio of Jhon Keneth Ryan Namias — Full Stack Engineer & AI Automation Specialist based in the Philippines. Specialized in React, TypeScript, Node.js, and AI-driven workflows.',
  metadataBase: new URL('https://namias.tech'),
  openGraph: {
    title: 'Jhon Keneth Ryan Namias — Full Stack Engineer & AI Automation Specialist',
    description:
      'Portfolio of Jhon Keneth Ryan Namias — Full Stack Engineer & AI Automation Specialist based in the Philippines.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Jhon Keneth Ryan Namias — Full Stack Engineer & AI Automation Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jhon Keneth Ryan Namias — Full Stack Engineer & AI Automation Specialist',
    description:
      'Portfolio of Jhon Keneth Ryan Namias — Full Stack Engineer & AI Automation Specialist based in the Philippines.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark min-h-screen font-sans antialiased">
        <Providers>
          {children}
          <FloatingHub />
        </Providers>
      </body>
    </html>
  );
}
