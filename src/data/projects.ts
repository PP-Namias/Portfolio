import { Project, ProjectStatus } from '@/types';
import projectData from '../../portfolio-resources/data/projects.json';

const isProjectStatus = (value: unknown): value is ProjectStatus => {
	return value === 'completed' || value === 'in-progress' || value === 'prototype';
};

export const projects: Project[] = projectData.map((project) => ({
	...project,
	status: isProjectStatus(project.status) ? project.status : undefined,
}));
