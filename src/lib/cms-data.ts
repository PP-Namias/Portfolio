import { BlogPost, Certification, Experience, GalleryItem, Membership, Profile, Project, ProjectStatus, Recommendation, SocialLink, Technology } from '@/types';

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

const isProjectStatus = (value: unknown): value is ProjectStatus => {
  return value === 'completed' || value === 'in-progress' || value === 'prototype';
};

export const isSanityCutoverEnabled = process.env.NEXT_PUBLIC_SANITY_CUTOVER_ENABLED === 'true';

export const profile: Profile = profileData;

export const experiences: Experience[] = experienceData.map((experience) => ({
  ...experience,
  position: experience.position,
}));

export const projects: Project[] = projectData.map((project) => ({
  ...project,
  status: isProjectStatus(project.status) ? project.status : undefined,
}));

export const certifications: Certification[] = certData;

export const galleryImages: GalleryItem[] = galleryData;

export const memberships: Membership[] = membershipData;

export const recommendations: Recommendation[] = recommendationData;

export const socialLinks: SocialLink[] = socialData;

export const technologies: Technology[] = techData;

export const techCategories = technologies.reduce<Record<string, Technology[]>>((acc, technology) => {
  if (!acc[technology.category]) {
    acc[technology.category] = [];
  }

  acc[technology.category].push(technology);
  return acc;
}, {});

export const blogPosts: BlogPost[] = blogData;