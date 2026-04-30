import { getProjects } from '@/data/projects';
import { ProjectsSectionClient } from './ProjectsSectionClient';

export async function ProjectsSection() {
  const projects = await getProjects();
  return <ProjectsSectionClient projects={projects} />;
}
