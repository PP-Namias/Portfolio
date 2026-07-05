import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface EducationData {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  gpa: string;
  honors: string[];
  activities: string[];
}

export async function getEducation() {
  return sanityFetch<EducationData[]>(QUERIES.education, undefined, {
    tags: ["cms:education"],
  });
}
