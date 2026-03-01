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
  title: 'Jane Doe — Software Engineer \\ Cloud Engineer',
  description:
    'Portfolio of Jane Doe — Software Engineer and Cloud Engineer based in San Francisco.',
  metadataBase: new URL('https://janedoe.dev'),
  openGraph: {
    title: 'Jane Doe — Software Engineer \\ Cloud Engineer',
    description:
      'Portfolio of Jane Doe — Software Engineer and Cloud Engineer based in San Francisco.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jane Doe — Software Engineer \\ Cloud Engineer',
    description:
      'Portfolio of Jane Doe — Software Engineer and Cloud Engineer based in San Francisco.',
  },
  icons: {
    icon: '/favicon.ico',
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
