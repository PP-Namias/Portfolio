// Import clean JSON data
import personalData from './json/personal-clean.json';

// Personal Information Interface
export interface PersonalInfo {
  profile: {
    name: string;
    title: string;
    tagline: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    avatar: string;
    resumeUrl?: string;
    availability: {
      status: 'available' | 'busy' | 'unavailable';
      message: string;
      lastUpdated: string;
    };
  };
  about: {
    summary: string[];
    specializations: string[];
    currentFocus: string;
    yearsOfExperience: number;
    metrics: {
      projectsCompleted: number;
      teamsLed: number;
      certifications: number;
      openSourceContributions: number;
    };
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    color: string;
    icon: string;
    date: string;
    verified: boolean;
    link?: string;
    category: string;
  }>;
  socialLinks: Array<{
    id: string;
    name: string;
    url: string;
    icon: string;
    username: string;
    primary: boolean;
  }>;
  settings: {
    showAvailability: boolean;
    showMetrics: boolean;
    showAchievements: boolean;
    contactFormEnabled: boolean;
    resumeDownloadEnabled: boolean;
  };
}

// Export typed data
export const personalInfo: PersonalInfo = personalData as PersonalInfo;
