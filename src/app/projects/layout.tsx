import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site-config';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Jhon Keneth Ryan Namias',
    description: 'Explore all projects by Jhon Keneth Ryan Namias — live applications, case studies, and open-source contributions.',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
