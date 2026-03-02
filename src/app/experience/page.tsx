import type { Metadata } from 'next';
import { ExperiencePageClient } from './ExperiencePageClient';

export const metadata: Metadata = {
  title: 'Work Experience — Jhon Keneth Ryan Namias',
  description:
    'Detailed timeline of my professional journey — from hardware repair to full-stack development, AI automation, and project management.',
  openGraph: {
    title: 'Work Experience — Jhon Keneth Ryan Namias',
    description:
      'Detailed timeline of my professional journey — from hardware repair to full-stack development, AI consulting, and enterprise software engineering.',
    url: 'https://namias.tech/experience',
    images: ['/og-image.svg'],
  },
};

export default function ExperiencePage() {
  return <ExperiencePageClient />;
}
