import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Jhon Keneth Namias — Full Stack Developer',
  description:
    'Portfolio of Jhon Keneth Namias — Full Stack Developer based in Caloocan City, Philippines. Specialized in React, TypeScript, and Node.js.',
  metadataBase: new URL('https://namias.tech'),
  openGraph: {
    title: 'Jhon Keneth Namias — Full Stack Developer',
    description:
      'Portfolio of Jhon Keneth Namias — Full Stack Developer based in Caloocan City, Philippines.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jhon Keneth Namias — Full Stack Developer',
    description:
      'Portfolio of Jhon Keneth Namias — Full Stack Developer based in Caloocan City, Philippines.',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
