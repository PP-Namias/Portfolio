// Import JSON data
import projectsDataJSON from './json/projects.json';

// Project Interface
export interface Project {
  _id: string;
  _type: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  category: string;
  type: string;
  status: string;
  featured: boolean;
  priority: number;
  startDate: string;
  endDate: string | null;
  duration: string;
  company: string;
  role: string;
  teamSize: number;
  technologies: string[];
  highlights: string[];
  metrics: {
    [key: string]: string | undefined;
  };
  images: Array<{
    url: string;
    alt: string;
    caption: string;
  }>;
  links: {
    live?: string | null;
    github?: string | null;
    case_study?: string;
    app_store?: string;
    play_store?: string;
  };
  tags: string[];
  techStack: {
    [key: string]: string[] | undefined;
  };
}

// Projects Collection Interface
export interface ProjectsCollection {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _version: number;
  featured: Project[];
  categories: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    count: number;
  }>;
  technologies: string[];
  projectTypes: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  statistics: {
    totalProjects: number;
    featuredProjects: number;
    liveProjects: number;
    technologiesUsed: number;
    clientSatisfaction: string;
    averageProjectDuration: string;
  };
}

// Export typed data
export const projectsCollection: ProjectsCollection = projectsDataJSON as unknown as ProjectsCollection;
export const featuredProjects: Project[] = projectsCollection.featured;
