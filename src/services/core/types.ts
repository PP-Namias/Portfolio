export type Project = {
  title: string;
  image: string;
  description: string;
  repositoryURL: string;
  liveURL: string | null;
  processURL: string | null;
  tags: string[];
  year: number;
  githubRepo?: string; // Format: "owner/repo" e.g., "PP-Namias/Portfolio"
};

export type Certification = {
  title: string;
  image: string;
  issuer: string;
  issuedAt: string;
  tags: string[];
};

export type FieldInterest = {
  name: string;
  bits: string[];
  former?: boolean;
};

export type Social = {
  name: string;
  label: string;
  link: string;
};

export type Technology = {
  name: string;
  logo: string;
  category: string;
  proficiency?: number;
};

export type Experience = {
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
  achievements?: string[];
  relatedProjects?: string[];
};

export type Education = {
  degree: string;
  institution: string;
  location: string;
  startedAt: string;
  endedAt: string | null;
  gpa?: string;
  honors?: string[];
  relevantCourses?: string[];
};

export type Profile = {
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
  education?: Education[];
};

export type ContactInfo = {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
};

export type Recommendation = {
  quote: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
};

export type MediaType = "image" | "video" | "gif";

export type GalleryItem = {
  title: string;
  mediaType: MediaType;
  media: string;
  image?: string;
  thumbnail?: string;
  description?: string;
  issuer?: string;
  tags: string[];
  createdAt?: string;
  issuedAt?: string;
};
