import { Technology } from '@/types';
import techData from '../../portfolio-resources/data/technologies.json';

export const technologies: Technology[] = techData;

// Group technologies by category
export const techCategories = technologies.reduce<Record<string, Technology[]>>((acc, tech) => {
  if (!acc[tech.category]) {
    acc[tech.category] = [];
  }
  acc[tech.category].push(tech);
  return acc;
}, {});
