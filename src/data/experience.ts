import { Experience } from '@/types';
import experienceData from '../../portfolio-resources/data/experiences.json';
import { safeFetchSanity } from '@/lib/sanity';

export const experiences: Experience[] = experienceData;

export async function getExperiences(): Promise<Experience[]> {
  const query = '*[_type == "experience"] | order(order asc) {..., "images": images[].asset->url}';
  return safeFetchSanity<Experience[]>(query, experienceData);
}
