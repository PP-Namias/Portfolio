import { Project, ProjectStatus } from '@/types';
import projectData from '../../portfolio-resources/data/projects.json';
import { safeFetchSanity } from '@/lib/sanity';

const isProjectStatus = (value: unknown): value is ProjectStatus => {
  return value === 'completed' || value === 'in-progress' || value === 'prototype';
};

const defaultProjects: Project[] = projectData.map((project) => ({
  ...project,
  status: isProjectStatus(project.status) ? project.status : undefined,
}));

export const getProjects = async (): Promise<Project[]> => {
  const query = '*[_type == "project"] | order(year desc) {..., "image": image.asset->url, "gallery": gallery[]{..., "image": image.asset->url}}';
  return safeFetchSanity<Project[]>(query, defaultProjects);
};
