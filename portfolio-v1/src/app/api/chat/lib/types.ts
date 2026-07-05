export interface ProfileData {
  name?: string;
  title?: string;
  email?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  summary?: string;
  highlights?: {
    yearsExperience?: number;
    projectsCompleted?: number;
    primaryTechnologies?: string[];
  };
  education?: Array<{
    degree?: string;
    institution?: string;
    location?: string;
    startedAt?: string;
    endedAt?: string | null;
    gpa?: string;
    honors?: string[];
    relevantCourses?: string[];
  }>;
}

export interface ExperienceData {
  company?: string;
  position?: string;
  summary?: string;
  country?: string;
  modality?: string;
  type?: string;
  startedAt?: string;
  endedAt?: string | null;
  technologies?: string[];
  achievements?: string[];
}

export interface ProjectData {
  title?: string;
  description?: string;
  year?: number;
  repositoryURL?: string | null;
  liveURL?: string | null;
  tags?: string[];
}

export interface TechnologyData {
  name?: string;
  category?: string;
  proficiency?: number;
}

export interface CertificationData {
  title?: string;
  issuer?: string;
  issuedAt?: string;
  tags?: string[];
}

export interface SocialData {
  name?: string;
  label?: string;
  link?: string;
}

export interface MembershipData {
  name?: string;
  url?: string;
  joinedAt?: string;
}

export interface ChatDataContext {
  profile: ProfileData;
  experiences: ExperienceData[];
  projects: ProjectData[];
  technologies: TechnologyData[];
  certifications: CertificationData[];
  memberships: MembershipData[];
  socials: SocialData[];
}

export interface ConversationHistoryMessage {
  role: string;
  content: string;
}
