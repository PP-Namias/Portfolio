import { getProfile, type ProfileData } from "./get-profile";
import { getProjects, type ProjectData } from "./get-projects";
import { getExperiences, type ExperienceData } from "./get-experiences";
import { getCertifications, type CertificationData } from "./get-certifications";
import { getEducation, type EducationData } from "./get-education";
import { getSocialLinks, type SocialLinkData } from "./get-social-links";
import { getTestimonials, type TestimonialData } from "./get-testimonials";
import { getAwards, type AwardData } from "./get-awards";
import { getBookmarks, type BookmarkData } from "./get-bookmarks";
import { getTechStack, type TechStackData } from "./get-tech-stack";
import { getSiteSettings, type SiteSettingsData } from "./get-site-settings";

export interface CmsContent {
  profile: ProfileData | null;
  projects: ProjectData[] | null;
  experiences: ExperienceData[] | null;
  certifications: CertificationData[] | null;
  education: EducationData[] | null;
  socialLinks: SocialLinkData[] | null;
  testimonials: TestimonialData[] | null;
  awards: AwardData[] | null;
  bookmarks: BookmarkData[] | null;
  techStack: TechStackData | null;
  siteSettings: SiteSettingsData | null;
}

export async function getCmsContent(): Promise<CmsContent> {
  const [
    profile,
    projects,
    experiences,
    certifications,
    education,
    socialLinks,
    testimonials,
    awards,
    bookmarks,
    techStack,
    siteSettings,
  ] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperiences(),
    getCertifications(),
    getEducation(),
    getSocialLinks(),
    getTestimonials(),
    getAwards(),
    getBookmarks(),
    getTechStack(),
    getSiteSettings(),
  ]);

  return {
    profile,
    projects,
    experiences,
    certifications,
    education,
    socialLinks,
    testimonials,
    awards,
    bookmarks,
    techStack,
    siteSettings,
  };
}
