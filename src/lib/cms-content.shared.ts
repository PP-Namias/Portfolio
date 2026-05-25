import blogData from '../../portfolio-resources/data/blog.json';
import certData from '../../portfolio-resources/data/certifications.json';
import experienceData from '../../portfolio-resources/data/experiences.json';
import galleryData from '../../portfolio-resources/data/gallery.json';
import membershipData from '../../portfolio-resources/data/memberships.json';
import profileData from '../../portfolio-resources/data/profile.json';
import projectData from '../../portfolio-resources/data/projects.json';
import recommendationData from '../../portfolio-resources/data/recommendations.json';
import socialData from '../../portfolio-resources/data/socials.json';
import techData from '../../portfolio-resources/data/technologies.json';

import type {
  BlogPost,
  Certification,
  Experience,
  GalleryItem,
  Membership,
  Profile,
  Project,
  Recommendation,
  SocialLink,
  Technology,
} from '@/types';

export interface CmsContent {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  certifications: Certification[];
  galleryImages: GalleryItem[];
  memberships: Membership[];
  recommendations: Recommendation[];
  socialLinks: SocialLink[];
  technologies: Technology[];
  techCategories: Record<string, Technology[]>;
  blogPosts: BlogPost[];
}

export function buildTechCategories(technologies: Technology[]): Record<string, Technology[]> {
  return technologies.reduce<Record<string, Technology[]>>((acc, technology) => {
    if (!acc[technology.category]) {
      acc[technology.category] = [];
    }

    acc[technology.category].push(technology);
    return acc;
  }, {});
}

export const fallbackCmsContent: CmsContent = {
  profile: profileData,
  experiences: experienceData.map((experience) => ({
    ...experience,
    position: experience.position,
  })),
  projects: projectData.map((project) => ({
    ...project,
    status: project.status as Project['status'],
  })),
  certifications: certData,
  galleryImages: galleryData,
  memberships: membershipData,
  recommendations: recommendationData,
  socialLinks: socialData,
  technologies: techData,
  techCategories: buildTechCategories(techData),
  blogPosts: blogData,
};
