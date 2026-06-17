import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site-config';

const OG_IMAGE = `${SITE_URL}/og-image.svg`;

export const metadata: Metadata = {
  title: 'Blog | Jhon Keneth Ryan Namias',
  description: 'Thoughts on AI, software engineering, cloud development, and more by Jhon Keneth Ryan Namias.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Blog | Jhon Keneth Ryan Namias',
    description: 'Thoughts on AI, software engineering, cloud development, and more.',
    url: `${SITE_URL}/blog`,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Jhon Keneth Ryan Namias — Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Jhon Keneth Ryan Namias',
    description: 'Thoughts on AI, software engineering, cloud development, and more.',
    images: [OG_IMAGE],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
