import { SocialLink } from '@/types';
import socialData from '../../portfolio-resources/data/socials.json';
import { safeFetchSanity } from '@/lib/sanity';

export const socialLinks: SocialLink[] = socialData;

export async function getSocialLinks(): Promise<SocialLink[]> {
  const query = '*[_type == "social"] | order(order asc)';
  return safeFetchSanity<SocialLink[]>(query, socialData);
}
