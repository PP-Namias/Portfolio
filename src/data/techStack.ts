import { Technology } from '@/types';
import techData from '../../portfolio-resources/data/technologies.json';
import { safeFetchSanity } from '@/lib/sanity';

export const technologies: Technology[] = techData;

// Group technologies by category
export const techCategories = technologies.reduce<Record<string, Technology[]>>((acc, tech) => {
  if (!acc[tech.category]) {
    acc[tech.category] = [];
  }
  acc[tech.category].push(tech);
  return acc;
}, {});

export async function getTechnologies(): Promise<Technology[]> {
  const query = '*[_type == "technology"] | order(category asc, name asc)';
  return safeFetchSanity<Technology[]>(query, techData);
}

export async function getTechCategories(): Promise<Record<string, Technology[]>> {
  const tech = await getTechnologies();
  return tech.reduce<Record<string, Technology[]>>((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = [];
    }
    acc[t.category].push(t);
    return acc;
  }, {});
}
