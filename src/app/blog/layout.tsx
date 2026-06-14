import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site-config';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Jhon Keneth Ryan Namias',
    description: 'Thoughts on AI, software engineering, cloud development, and more.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
