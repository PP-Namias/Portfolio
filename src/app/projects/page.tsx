import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Card } from '@/components/ui/Card';
import { getCmsContent } from '@/lib/cms-content.server';
import { ProjectGridClient } from './ProjectGridClient';

export const revalidate = 3600;

export default async function ProjectsPage() {
  const { projects } = await getCmsContent();

  return (
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>
        <ThemeToggle />
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Projects
        </h1>
        <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
          Explore all projects — live applications, case studies, and open-source contributions.
        </p>
      </div>

      <Card>
        <ProjectGridClient projects={projects} />
      </Card>
    </main>
  );
}
