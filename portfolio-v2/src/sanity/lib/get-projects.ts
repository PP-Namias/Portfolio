import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface ProjectData {
  title: string;
  slug: { current: string };
  summary: string;
  description: unknown[];
  category: string;
  technologies: string[];
  image: { asset: { url: string } } | null;
  gallery: Array<{ asset: { url: string } }>;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
  status: string;
}

export async function getProjects() {
  return sanityFetch<ProjectData[]>(QUERIES.projects, undefined, {
    tags: ["cms:projects"],
  });
}
