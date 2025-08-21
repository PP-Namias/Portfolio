import experienceDataJSON from './json/experience-clean.json';

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  metrics?: {
    impact?: string;
    growth?: string;
    efficiency?: string;
  };
  companyUrl?: string;
  projectUrl?: string;
}

export interface ExperienceCollection {
  experiences: ExperienceData[];
  totalYears: number;
  currentRole: {
    company: string;
    position: string;
    startDate: string;
  };
}

// Export the data with proper typing
export const experienceCollection: ExperienceCollection = experienceDataJSON;
export const experienceData: ExperienceData[] = experienceDataJSON.experiences;

// Export individual experiences for easy access
export const currentExperience = experienceData.find(exp => exp.current);
export const pastExperiences = experienceData.filter(exp => !exp.current);

export default experienceCollection;
