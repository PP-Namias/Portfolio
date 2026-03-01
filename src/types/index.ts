export interface Profile {
  name: string;
  title: string;
  location: string;
  tagline: string;
  roles: string[];
  email: string;
  profilePhoto: string;
  ogImage: string;
  resumeUrl: string;
  scheduleCallUrl: string;
  blogUrl: string;
  achievementBadge: {
    text: string;
    icon: string;
  };
  bio: string[];
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  year: string;
  type: 'work' | 'education' | 'milestone';
  emoji?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  thumbnail?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
}

export interface TechCategory {
  category: string;
  technologies: string[];
}

export interface Recommendation {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
}

export interface Membership {
  id: string;
  name: string;
  url: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}
