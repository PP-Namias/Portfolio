import { cache } from 'react';
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server';
import type { Experience } from '@/types';

const maybeCache = <T extends (...args: unknown[]) => Promise<ExperienceData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

export type ExperienceData = {
  experiences: Experience[];
};

async function fetchExperienceDataImpl(): Promise<ExperienceData> {
  const experienceDocs = await querySanity<Array<{
    role?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    employmentType?: string;
    workModel?: string;
    summary?: string;
    featuredStory?: string;
    highlights?: string[];
    tags?: string[];
    achievements?: string[];
    images?: string[];
  }>>(
    '*[_type == "experience"] | order(order asc, startDate desc){role,company,location,startDate,endDate,employmentType,workModel,summary,featuredStory,highlights,tags,achievements,images}',
    { tags: CONTENT_TAGS.experience }
  );

  const experiences: Experience[] = (experienceDocs ?? []).map((experience) => ({
    company: experience.company || '',
    position: experience.role || '',
    summary: experience.summary || '',
    featuredStory: experience.featuredStory || undefined,
    country: experience.location || '',
    modality: experience.workModel || '',
    type: experience.employmentType || '',
    startedAt: experience.startDate || '',
    endedAt: experience.endDate || null,
    technologies: experience.tags || [],
    highlights: experience.highlights || [],
    achievements: experience.achievements || [],
    relatedProjects: [],
    images: experience.images || [],
  }));

  return { experiences };
}

export const fetchExperienceData = maybeCache(fetchExperienceDataImpl);
