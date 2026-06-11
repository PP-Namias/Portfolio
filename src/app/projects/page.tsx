import { Card } from '@/components/ui/Card';
import { getCmsContent } from '@/lib/cms-content.server';
import { ProjectGridClient } from './ProjectGridClient';

export const revalidate = 3600;

export default async function ProjectsPage() {
  const { projects } = await getCmsContent();

  return (
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      <Card>
        <ProjectGridClient projects={projects} />
      </Card>
    </main>
  );
}
