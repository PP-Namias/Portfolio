import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site-config';

const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  title: 'Projects | Jhon Keneth Ryan Namias',
  description: 'Explore all projects by Jhon Keneth Ryan Namias — live applications, case studies, and open-source contributions.',
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    title: 'Projects | Jhon Keneth Ryan Namias',
    description: 'Explore all projects by Jhon Keneth Ryan Namias — live applications, case studies, and open-source contributions.',
    url: `${SITE_URL}/projects`,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Jhon Keneth Ryan Namias — Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Jhon Keneth Ryan Namias',
    description: 'Explore all projects by Jhon Keneth Ryan Namias — live applications, case studies, and open-source contributions.',
    images: [OG_IMAGE],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
