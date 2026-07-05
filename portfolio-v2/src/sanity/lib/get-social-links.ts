import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface SocialLinkData {
  platform: string;
  handle: string;
  url: string;
  isPrimary: boolean;
}

export async function getSocialLinks() {
  return sanityFetch<SocialLinkData[]>(QUERIES.socialLinks, undefined, {
    tags: ["cms:profile"],
  });
}
