import { Profile } from '@/types';
import profileData from '../../portfolio-resources/data/profile.json';
import { safeFetchSanity } from '@/lib/sanity';

export const profile: Profile = profileData;

export async function getProfile(): Promise<Profile> {
  const query = '*[_type == "profile"][0]';
  return safeFetchSanity<Profile>(query, profileData);
}
