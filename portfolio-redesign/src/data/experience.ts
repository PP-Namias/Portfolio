import experienceDataJSON from './json/experience-clean.json';

export interface ExperienceData {
  _id: string;
  _type: string;
  order: number;
  company: string;
  position: string;
  department: string;
  location: string;
  locationType: string;
  employmentType: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  duration: {
    years: number;
    months: number;
    displayDuration: string;
  };
  description: string;
  achievements: string[];
  technologies: string[];
  companyWebsite?: string;
  metrics: {
    teamSize?: number;
    budgetManaged?: string;
    projectsLed?: number;
    performanceImprovement?: string;
    impact?: string;
    growth?: string;
    efficiency?: string;
    revenue?: string;
    userGrowth?: string;
    revenueGrowth?: string;
    userBase?: string;
    projectsCompleted?: number;
    clientSatisfaction?: string;
    uptime?: string;
    codeReduction?: string;
    deliverySpeed?: string;
  };
}

export interface ExperienceCollection {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _version: number;
  experiences: ExperienceData[];
  totalExperience: {
    years: number;
    months: number;
    displayTotal: string;
  };
  experienceTypes: string[];
  locations: string[];
  skills: {
    technical: string[];
    management: string[];
    domain: string[];
  };
}

// Export the data with proper typing
export const experienceCollection: ExperienceCollection = experienceDataJSON;
export const experienceData: ExperienceData[] = experienceDataJSON.experiences;

// Export individual experiences for easy access
export const currentExperience = experienceData.find(exp => exp.current);
export const pastExperiences = experienceData.filter(exp => !exp.current);

export default experienceCollection;
