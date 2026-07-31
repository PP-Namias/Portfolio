export interface SanityBase {
  _id: string;
  _updatedAt: string;
  _createdAt?: string;
}

export interface ProfileEducation {
  degree?: string;
  institution?: string;
  location?: string;
  startedAt?: string;
  endedAt?: string;
  gpa?: string;
  honors?: string[];
  relevantCourses?: string[];
}

export interface ProfileHighlights {
  yearsExperience?: number;
  projectsCompleted?: number;
  primaryTechnologies?: string[];
}

export interface ProfileDoc extends SanityBase {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  summary?: string;
  availabilityLabel?: string;
  heroRoles?: string[];
  resumeUrl?: string;
  highlights?: ProfileHighlights;
  education?: ProfileEducation[];
}

export interface AboutSectionDoc extends SanityBase {
  aboutContent?: unknown;
  aboutParagraphs?: string[];
}

export interface TechnologyItem {
  name?: string;
  category?: string;
  proficiency?: number;
}

export interface TechStackDoc extends SanityBase {
  technologies?: TechnologyItem[];
}

export interface ExperienceDoc extends SanityBase {
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
}

export interface ProjectDoc extends SanityBase {
  title?: string;
  slug?: string;
  summary?: string;
  challenge?: string;
  solution?: string;
  result?: string;
  year?: number;
  category?: string;
  featured?: boolean;
  role?: string;
  technologies?: string[];
  achievements?: string[];
  featuredRank?: number;
  status?: string;
  liveUrl?: string;
  repositoryUrl?: string;
  tier?: string;
  showcaseDetail?: boolean;
  shortDescription?: string;
  highlights?: string[];
  githubRepo?: string;
}

export interface CertificationDoc extends SanityBase {
  title?: string;
  issuedAt?: string;
  tags?: string[];
  issuer?: string;
}

export interface PostDoc extends SanityBase {
  title?: string;
  slug?: string;
  excerpt?: string;
  readTime?: string;
  body?: unknown;
  tags?: string[];
  publishedAt?: string;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  author?: string;
  categories?: string[];
  published?: boolean;
}

export interface MembershipDoc extends SanityBase {
  name?: string;
  url?: string;
  joinedAt?: string;
}

export interface RecommendationDoc extends SanityBase {
  quote?: string;
  name?: string;
  title?: string;
  company?: string;
  featured?: boolean;
  relationship?: string;
  companyUrl?: string;
}
