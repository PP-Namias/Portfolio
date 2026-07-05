import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface TechStackData {
  title: string;
  technologies: Array<{
    name: string;
    icon: string;
    category: string;
    proficiency: number;
    url: string;
  }>;
}

export async function getTechStack() {
  return sanityFetch<TechStackData>(QUERIES.techStack, undefined, {
    tags: ["cms:techStack"],
  });
}
