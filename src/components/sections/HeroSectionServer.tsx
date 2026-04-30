import { HeroSection } from './HeroSection';
import { getProfile, getSocialLinks } from '@/data';

export async function HeroSectionServer() {
  const profileData = await getProfile();
  const socialLinksData = await getSocialLinks();

  return <HeroSection />;
}
