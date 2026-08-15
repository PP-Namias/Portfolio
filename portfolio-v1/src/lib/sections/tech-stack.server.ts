import { cache } from 'react';
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server';
import { buildTechCategories } from '@/lib/cms-content.shared';
import type { Technology } from '@/types';

const maybeCache = <T extends (...args: unknown[]) => Promise<TechStackData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

export type TechStackData = {
  technologies: Technology[];
  techCategories: Record<string, Technology[]>;
};

async function fetchTechStackDataImpl(): Promise<TechStackData> {
  const techDoc = await querySanity<{
    technologies?: Technology[];
  }>(
    '*[_type == "techStack"][0]{technologies[]{name,logo,category,proficiency}}',
    { tags: CONTENT_TAGS.techStack }
  );

  const technologies = techDoc?.technologies ?? [];

  return {
    technologies,
    techCategories: buildTechCategories(technologies),
  };
}

export const fetchTechStackData = maybeCache(fetchTechStackDataImpl);
