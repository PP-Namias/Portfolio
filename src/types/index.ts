export interface Education {
  degree: string;
  institution: string;
  location: string;
  startedAt: string;
  endedAt: string | null;
  gpa: string;
  honors: string[];
  relevantCourses: string[];
}

export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  summary: string;
  highlights: {
    yearsExperience: number;
    projectsCompleted: number;
    primaryTechnologies: string[];
  };
  education: Education[];
}

export interface Experience {
  company: string;
  position: string;
  summary: string;
  country: string;
  modality: string;
  type: string;
  startedAt: string;
  endedAt: string | null;
  technologies: string[];
  highlights: string[];
  achievements: string[];
  relatedProjects: string[];
}

export interface Project {
  title: string;
  image: string;
  description: string;
  repositoryURL: string | null;
  liveURL: string | null;
  processURL: string | null;
  tags: string[];
  year: number;
}

export interface Certification {
  title: string;
  image: string;
  issuer: string;
  issuedAt: string;
  tags: string[];
}

export interface Technology {
  name: string;
  logo: string;
  category: string;
  proficiency: number;
}

export interface Recommendation {
  quote: string;
  name: string;
  title: string;
  company: string;
}

export interface Membership {
  name: string;
  url: string;
  joinedAt: string;
}

export interface GalleryItem {
  title: string;
  mediaType: string;
  media: string;
  tags: string[];
  createdAt: string;
}

export interface SocialLink {
  name: string;
  icon: string;
  label: string;
  link: string;
  featured?: boolean;
}
