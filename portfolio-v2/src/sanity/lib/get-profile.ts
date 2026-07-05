import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface ProfileData {
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  dailyDev: string;
  avatar: { asset: { url: string } } | null;
  about: unknown[];
  aboutText: string;
  socialLinks: Array<{
    platform: string;
    handle: string;
    url: string;
    isPrimary: boolean;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear: number;
    gpa: string;
    honors: string[];
    activities: string[];
  }>;
  availability: boolean;
  resumeUrl: string;
}

export async function getProfile() {
  return sanityFetch<ProfileData>(QUERIES.profile, undefined, {
    tags: ["cms:profile"],
  });
}
