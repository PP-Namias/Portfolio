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
  avatarUrl?: string;
  resumeUrl?: string;
  availabilityLabel?: string;
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
  featuredStory?: string;
  country: string;
  modality: string;
  type: string;
  startedAt: string;
  endedAt: string | null;
  technologies: string[];
  highlights: string[];
  achievements: string[];
  relatedProjects: string[];
  images: string[];
}

export interface ProjectImpactMetric {
  label: string;
  value: string;
}

export interface ProjectGalleryItem {
  image: string;
  caption: string;
}

export type ProjectStatus = 'completed' | 'in-progress' | 'prototype';

export type ProjectTier = 'featured' | 'standard' | 'archived';

export interface Project {
  title: string;
  image: string;
  description: string;
  challenge?: string;
  solution?: string;
  result?: string;
  featured?: boolean;
  repositoryURL: string | null;
  liveURL: string | null;
  processURL: string | null;
  detailURL?: string | null;
  previewVideoURL?: string | null;
  tags: string[];
  year: number;
  category?: string;
  role?: string;
  impactMetrics?: ProjectImpactMetric[];
  featuredRank?: number | null;
  status?: ProjectStatus;
  gallery?: ProjectGalleryItem[];
  tier?: ProjectTier;
  showcaseDetail?: boolean;
  shortDescription?: string;
  highlights?: string[];
  githubRepo?: string;
  slug?: string;
}

export interface Certification {
  title: string;
  image: string;
  imageUrl?: string;
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
  featured?: boolean;
  relationship?: string;
  companyUrl?: string;
  avatarUrl?: string;
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

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  coverImage: string;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type HubState = 'closed' | 'menu' | 'chat';

export type ModalName = 'resume' | 'experience' | 'booking' | 'contact' | 'project' | null;
