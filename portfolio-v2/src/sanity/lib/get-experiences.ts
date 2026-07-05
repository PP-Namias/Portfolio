import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface ExperienceData {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  employmentType: string;
  description: unknown[];
  skills: string[];
  highlights: string[];
  order: number;
}

export async function getExperiences() {
  return sanityFetch<ExperienceData[]>(QUERIES.experiences, undefined, {
    tags: ["cms:experiences"],
  });
}
