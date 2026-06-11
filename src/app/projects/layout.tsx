import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Jhon Keneth Ryan Namias',
  description: 'Explore all projects by Jhon Keneth Ryan Namias — live applications, case studies, and open-source contributions.',
  openGraph: {
    title: 'Projects | Jhon Keneth Ryan Namias',
    description: 'Explore all projects by Jhon Keneth Ryan Namias — live applications, case studies, and open-source contributions.',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
