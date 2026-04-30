/**
 * Server Component Wrappers for Sanity CMS Integration
 * 
 * Demonstrates async data fetching patterns for migrating from JSON-only
 * to Sanity CMS with fallback. These patterns show how to:
 * 
 * 1. Fetch data asynchronously on the server
 * 2. Use safeFetchSanity for resilient Sanity/JSON failover
 * 3. Pass data as props to client components
 * 4. Enable ISR with cache tagging
 */

import { getProfile } from '@/data/profile';
import { getSocialLinks } from '@/data/socials';
import { getExperiences } from '@/data/experience';
import { getCertifications } from '@/data/certifications';
import { getRecommendations } from '@/data/recommendations';
import { getMemberships } from '@/data/memberships';
import { getGalleryImages } from '@/data/gallery';
import { getTechCategories } from '@/data/techStack';
import { getProjects } from '@/data/projects';
import { getBlogPosts } from '@/data/blogPosts';

/**
 * Example: Async data fetch for Portfolio Home
 * 
 * USAGE: In src/app/page.tsx or in async layout/page components
 * 
 * const data = await preloadPortfolioData();
 * // Pass to client components as needed or use in metadata
 */
export async function preloadPortfolioData() {
  const [
    profileData,
    socialLinksData,
    experiencesData,
    certificationsData,
    recommendationsData,
    membershipsData,
    galleryData,
    techCatsData,
    projectsData,
    blogPostsData,
  ] = await Promise.all([
    getProfile().catch(() => null),
    getSocialLinks().catch(() => []),
    getExperiences().catch(() => []),
    getCertifications().catch(() => []),
    getRecommendations().catch(() => []),
    getMemberships().catch(() => []),
    getGalleryImages().catch(() => []),
    getTechCategories().catch(() => ({})),
    getProjects().catch(() => []),
    getBlogPosts().catch(() => []),
  ]);

  return {
    profile: profileData,
    socialLinks: socialLinksData,
    experiences: experiencesData,
    certifications: certificationsData,
    recommendations: recommendationsData,
    memberships: membershipsData,
    gallery: galleryData,
    techCategories: techCatsData,
    projects: projectsData,
    blogPosts: blogPostsData,
  };
}

/**
 * Fetch strategy helper for ISR setup
 * Use in Next.js route segments with generateStaticParams or revalidateTag calls
 */
export const PORTFOLIO_REVALIDATE_CONFIG = {
  revalidate: 3600, // 1 hour ISR
  tags: ['sanity', 'portfolio-data'],
};

/**
 * MIGRATION GUIDE:
 * 
 * Pattern A: Keep client components as-is (current state)
 * - Client imports sync exports (profile, experiences, etc.)
 * - No breaking changes, works with JSON until Sanity is configured
 * - ✅ Backward compatible
 * 
 * Pattern B: Use async server component wrappers (gradual migration)
 * - Create async server component that calls getProfile(), getExperiences(), etc.
 * - Fetch from Sanity with automatic JSON fallback
 * - Pass data as props to client component
 * - Example:
 *   
 *   export async function HeroSectionServer() {
 *     const profileData = await getProfile();
 *     const socialData = await getSocialLinks();
 *     return <HeroSectionClient profile={profileData} socials={socialData} />;
 *   }
 * 
 * Pattern C: Update page.tsx for data prefetch (advanced)
 * - Call preloadPortfolioData() in the main page
 * - Use for metadata generation
 * - Benefit: Single data fetch per page load, deduplication across components
 * 
 * NEXT STEPS:
 * 1. When Sanity project is configured in .env, set NEXT_PUBLIC_SANITY_PROJECT_ID
 * 2. Run migration script: npm run migrate:sanity
 * 3. Gradually refactor sections to use async wrappers
 * 4. Monitor fallback logs to confirm Sanity connectivity
 */


