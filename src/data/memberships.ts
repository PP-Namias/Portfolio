import { Membership } from '@/types';
import membershipData from '../../portfolio-resources/data/memberships.json';
import { safeFetchSanity } from '@/lib/sanity';

export const memberships: Membership[] = membershipData;

export async function getMemberships(): Promise<Membership[]> {
  const query = '*[_type == "membership"]';
  return safeFetchSanity<Membership[]>(query, membershipData);
}
