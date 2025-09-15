// Import JSON data
import techStackDataJSON from './json/techstack.json';

// Technology Interface
export interface Technology {
  id: string;
  name: string;
  proficiency: 'expert' | 'advanced' | 'intermediate' | 'learning';
  yearsOfExperience: number;
  lastUsed: string;
  category: string;
  logo: string;
}

// Tech Category Interface
export interface TechCategory {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  expanded: boolean;
  technologies: Technology[];
}

// Tech Stack Data Interface
export interface TechStackData {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _version: number;
  categories: TechCategory[];
  proficiencyLevels: {
    [key: string]: {
      label: string;
      description: string;
      color: string;
      order: number;
      minYears: number;
    };
  };
  statistics: {
    totalTechnologies: number;
    expertLevel: number;
    advancedLevel: number;
    intermediateLevel: number;
    learningLevel: number;
    yearsOfExperience: number;
    categoriesCount: number;
  };
}

// Export typed data
export const techStackCollection: TechStackData = techStackDataJSON as unknown as TechStackData;
export const techCategories: TechCategory[] = techStackCollection.categories;

// Legacy export for backwards compatibility
export { techStackCollection as techStackData };
