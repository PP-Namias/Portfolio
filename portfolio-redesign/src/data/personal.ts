import personalData from './json/personal.json';

// Type definitions for the personal data structure (Sanity CMS compatible)
export interface PersonalInfo {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  profile: {
    name: string;
    title: string;
    tagline: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    image: {
      _type: string;
      asset: {
        _ref: string;
        _type: string;
      };
      alt: string;
      url: string;
    };
    availability: {
      status: "available" | "busy" | "partially-available";
      message: string;
      updated: string;
    };
  };
  achievements: Array<{
    _key: string;
    title: string;
    description: string;
    color: string;
    icon: string;
    date: string;
    verified: boolean;
    link?: string;
  }>;
  about: {
    summary: string[];
    specializations: string[];
    currentFocus: string;
    yearsOfExperience: number;
    developersBuiltCommunity?: number;
    personalPhilosophy?: string;
    interests?: string[];
    workingStyle?: string[];
    languages?: Array<{
      name: string;
      proficiency: string;
    }>;
  };
  socialLinks: Array<{
    _key: string;
    platform: string;
    url: string;
    username: string;
    icon: string;
    primary: boolean;
  }>;
}

// Export the imported JSON data with proper typing
export const personalInfo = personalData as PersonalInfo;

// Legacy compatibility - convert Sanity structure to simple types for existing components
export const personal = {
  name: personalInfo.profile.name,
  title: personalInfo.profile.title,
  location: personalInfo.profile.location,
  email: personalInfo.profile.email,
  phone: personalInfo.profile.phone,
  website: personalInfo.profile.website,
  avatar: personalInfo.profile.image.url,
  bio: personalInfo.about.summary.join(' '),
  shortBio: personalInfo.profile.tagline,
  experience: `${personalInfo.about.yearsOfExperience}+ years`,
  availability: personalInfo.profile.availability.message,
  achievements: personalInfo.achievements.map(achievement => ({
    icon: achievement.icon,
    text: achievement.title
  })),
  about: {
    intro: personalInfo.about.summary[0] || '',
    approach: personalInfo.about.summary[1] || '',
    passion: personalInfo.about.summary[2] || '',
    collaboration: personalInfo.about.workingStyle?.join(' ') || ''
  },
  social: personalInfo.socialLinks.reduce((acc, link) => {
    acc[link.platform.toLowerCase()] = link.url;
    return acc;
  }, {} as Record<string, string>)
};
