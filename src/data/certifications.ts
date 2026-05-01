import { Certification } from '@/types';
import certData from '../../portfolio-resources/data/certifications.json';
import { safeFetchSanity } from '@/lib/sanity';

export const certifications: Certification[] = certData;

export async function getCertifications(): Promise<Certification[]> {
  const query = '*[_type == "certification"] | order(issuedDate desc) {..., "image": image.asset->url}';
  return safeFetchSanity<Certification[]>(query, certData);
}
