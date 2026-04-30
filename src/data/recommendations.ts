import { Recommendation } from '@/types';
import recData from '../../portfolio-resources/data/recommendations.json';
import { safeFetchSanity } from '@/lib/sanity';

export const recommendations: Recommendation[] = recData;

export async function getRecommendations(): Promise<Recommendation[]> {
  const query = '*[_type == "recommendation"]';
  return safeFetchSanity<Recommendation[]>(query, recData);
}
