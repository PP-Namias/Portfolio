import { cache } from 'react';
import { draftMode } from 'next/headers';

import { getOrFetch } from './cache';
import { IS_BLOG_VISIBLE } from './features';

import type {
  BlogPost,
  Certification,
  Experience,
  GalleryItem,
  Membership,
  Profile,
  Project,
  Recommendation,
  SocialLink,
  Technology,
} from '@/types';

import { buildMediaGatewayUrl } from './media-gateway';
import * as cmsShared from './cms-content.shared';
import type { CmsContent } from './cms-content.shared';
import { getPublicClient, getPreviewClient } from '@/sanity/lib/client';

const sanityApiVersion = '2026-02-19';

function getProjectId(): string | null {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || process.env.SANITY_PROJECT_ID?.trim() || null;
}

function getDataset(): string {
  return process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || process.env.SANITY_DATASET?.trim() || 'production';
}

function getSanityHeaders(): HeadersInit | undefined {
  const token = process.env.SANITY_API_READ_TOKEN?.trim();
  return token ? {Authorization: `Bearer ${token}`} : undefined;
}

// Simple in-process query-level cache / deduper to avoid issuing the
// same Sanity network request multiple times during a single render
// or when server components call into the loader repeatedly.
const queryCache = new Map<string, Promise<unknown> | null>();

const queryCacheStats = {
  hits: 0,
  misses: 0,
};

export function getCmsQueryCacheStats() {
  return {
    hits: queryCacheStats.hits,
    misses: queryCacheStats.misses,
    entries: queryCache.size,
  };
}

export function resetCmsQueryCacheStats() {
  queryCacheStats.hits = 0;
  queryCacheStats.misses = 0;
}

/**
 * Pick the right client for the current request. When the Sanity Studio
 * Presentation tool has enabled draft mode we use the preview client
 * (perspective: previewDrafts, useCdn: false, read token) so the iframe
 * shows draft content. Otherwise we hit the public CDN client.
 */
async function pickClient() {
  const {isEnabled} = await draftMode();
  if (!isEnabled) return getPublicClient();
  return getPreviewClient().withConfig({
    token: process.env.SANITY_API_READ_TOKEN?.trim() || undefined,
    useCdn: false,
    perspective: 'previewDrafts',
    stega: {
      studioUrl: '/studio',
    },
  });
}

const CACHE_TTL_MS = Number(process.env.CACHE_TTL_DEFAULT) || 300_000;
const CACHE_STALE_MS = Number(process.env.CACHE_TTL_STALE) || 60_000;

const CONTENT_TAGS: Record<string, string[]> = {
  profile: ['cms:profile'],
  aboutSection: ['cms:about'],
  techStack: ['cms:technology'],
  experience: ['cms:experience'],
  project: ['cms:project', 'cms:project-list'],
  certification: ['cms:certification'],
  galleryImage: ['cms:gallery'],
  post: ['cms:blog'],
  membership: ['cms:membership'],
  recommendation: ['cms:recommendation'],
  siteSettings: ['cms:settings'],
};

async function querySanity<T>(query: string, options?: { tags?: string[] }): Promise<T | null> {
  const projectId = getProjectId();
  if (!projectId) return null;

  const {isEnabled} = await draftMode();
  const perspective = isEnabled ? 'previewDrafts' : 'published';

  if (perspective === 'previewDrafts') {
    return querySanityFresh<T>(query, projectId, perspective);
  }

  const cacheKey = `sanity:${perspective}:${query}`;
  const tags = options?.tags ?? [];
  const result = await getOrFetch<T | null>(cacheKey, () => querySanityFresh<T>(query, projectId, perspective), {
    ttlMs: CACHE_TTL_MS,
    staleMs: CACHE_STALE_MS,
    tags,
  });
  return result.data;
}

async function querySanityFresh<T>(query: string, projectId: string, perspective: string): Promise<T | null> {
  const cacheKey = `${perspective}::${query}`;
  const cached = queryCache.get(cacheKey) as Promise<T | null> | undefined;
  if (cached) {
    queryCacheStats.hits += 1;
    return cached;
  }

  queryCacheStats.misses += 1;

  const promise = (async (): Promise<T | null> => {
    try {
      const client = await pickClient();
      const result = await client.fetch<T | null>(query);
      return (result as T | null) ?? null;
    } catch (err) {
      try {
        const url = `https://${projectId}.api.sanity.io/v${sanityApiVersion}/data/query/${getDataset()}?query=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
          headers: getSanityHeaders(),
          cache: 'no-store',
        });
        if (!response.ok) return null;
        const payload = (await response.json()) as {result?: T};
        return payload.result ?? null;
      } catch {
        if (process.env.NODE_ENV !== 'test') console.warn('[cms] query failed', err);
        return null;
      }
    }
  })();

  queryCache.set(cacheKey, promise);
  promise.catch(() => queryCache.delete(cacheKey));

  return promise;
}

export function clearCmsQueryCache() {
  queryCache.clear();
  resetCmsQueryCacheStats();
}

function normalizeSocialName(value: string): string {
  return value.toLowerCase();
}

function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function mapSocialLink(link: {
  platform?: string;
  icon?: string;
  url?: string;
  placements?: string[];
}): SocialLink | null {
  const normalizedName = normalizeSocialName(String(link.platform || link.icon || ''));
  const url = String(link.url || '').trim();

  if (!normalizedName || !url) {
    return null;
  }

  return {
    name: normalizedName,
    icon: normalizeSocialName(String(link.icon || link.platform || 'message')),
    label: titleCase(link.platform || link.icon || normalizedName),
    link: url,
    featured: Array.isArray(link.placements) ? link.placements.includes('hero') : false,
  };
}

function portableTextToMarkdown(blocks: unknown): string {
  if (!Array.isArray(blocks)) {
    return '';
  }

  const lines: string[] = [];

  for (const block of blocks) {
    if (!block || typeof block !== 'object') {
      continue;
    }

    const candidate = block as {
      style?: string;
      children?: Array<{ text?: string }>;
    };
    const text = candidate.children?.map((child) => child.text ?? '').join(' ').trim() ?? '';

    if (!text) {
      continue;
    }

    if (candidate.style === 'h1') {
      lines.push(`# ${text}`);
    } else if (candidate.style === 'h2') {
      lines.push(`## ${text}`);
    } else if (candidate.style === 'h3') {
      lines.push(`### ${text}`);
    } else {
      lines.push(text);
    }

    lines.push('');
  }

  return lines.join('\n').trim();
}

function portableTextToParagraphs(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks
    .map((block) => {
      if (!block || typeof block !== 'object') {
        return '';
      }

      const candidate = block as {
        children?: Array<{ text?: string }>;
      };

      return candidate.children?.map((child) => child.text ?? '').join(' ').trim() ?? '';
    })
    .filter(Boolean);
}

function resolveMediaPath(fileName?: string | null, url?: string | null): string {
  const normalizedUrl = String(url || '').trim();
  if (normalizedUrl) {
    return buildMediaGatewayUrl(normalizedUrl, { sign: true });
  }

  // Do not return local filenames here — return empty to indicate
  // that no Sanity-hosted asset URL is present.
  return '';
}

const getCmsContentImpl = async (): Promise<CmsContent> => {
  const [profileDoc, aboutDoc, techDoc, experienceDocs, projectDocs, certificationDocs, galleryDocs, blogDocs, membershipDocs, recommendationDocs, siteSettingsDoc] = await Promise.all([
    querySanity<{
      fullName?: string;
      title?: string;
      email?: string;
      phone?: string;
      location?: string;
      github?: string;
      linkedin?: string;
      summary?: string;
      avatarUrl?: string;
      profileImageUrl?: string;
      resumeUrl?: string;
      availabilityLabel?: string;
      heroRoles?: string[];
      socialLinks?: Array<{ platform?: string; icon?: string; url?: string; placements?: string[] }>;
      highlights?: Profile['highlights'];
      education?: Profile['education'];
    }>(
      '*[_type == "profile"][0]{fullName,title,email,phone,location,github,linkedin,summary,"avatarUrl":avatar.asset->url,"profileImageUrl":profileImage.asset->url,resumeUrl,availabilityLabel,heroRoles,socialLinks[]{platform,icon,url,placements},highlights,education}',
      { tags: CONTENT_TAGS.profile }
    ),
    querySanity<{
      aboutContent?: unknown;
      aboutParagraphs?: string[];
    }>(
      '*[_type == "aboutSection"][0]{aboutContent,aboutParagraphs}',
      { tags: CONTENT_TAGS.aboutSection }
    ),
    querySanity<{
      technologies?: Technology[];
    }>(
      '*[_type == "techStack"][0]{technologies[]{name,logo,category,proficiency}}',
      { tags: CONTENT_TAGS.techStack }
    ),
    querySanity<Array<{
      role?: string;
      company?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      employmentType?: string;
      workModel?: string;
      summary?: string;
      featuredStory?: string;
      highlights?: string[];
      tags?: string[];
      achievements?: string[];
      images?: string[];
    }>>(
      '*[_type == "experience"] | order(order asc, startDate desc){role,company,location,startDate,endDate,employmentType,workModel,summary,featuredStory,highlights,tags,achievements,images}',
      { tags: CONTENT_TAGS.experience }
    ),
    querySanity<Array<{
      title?: string;
      slug?: string;
      summary?: string;
      challenge?: string;
      solution?: string;
      result?: string;
      year?: number;
      category?: string;
      featured?: boolean;
      role?: string;
      technologies?: string[];
      achievements?: string[];
      featuredRank?: number;
      status?: string;
      liveUrl?: string;
      repositoryUrl?: string;
      detailUrl?: string;
      processUrl?: string;
      previewVideoUrl?: string;
      imageFile?: string;
      imageUrl?: string;
      imageAlt?: string;
      imageCaption?: string;
      imageCredit?: string;
      imageSource?: string;
      imageLicense?: string;
      galleryItems?: Array<{
        file?: string;
        url?: string;
        alt?: string;
        caption?: string;
        credit?: string;
        source?: string;
        license?: string;
      }>;
      tier?: string;
      showcaseDetail?: boolean;
      shortDescription?: string;
      highlights?: string[];
      githubRepo?: string;
    }>>(
      '*[_type == "project"] | order(order asc, featuredRank asc, title asc){title,"slug":slug.current,summary,challenge,solution,result,year,category,featured,role,technologies,achievements,featuredRank,status,liveUrl,repositoryUrl,detailUrl,processUrl,previewVideoUrl,"imageFile":image.asset->originalFilename,"imageUrl":image.asset->url,"imageAlt":image.alt,"imageCaption":image.caption,"imageCredit":image.credit,"imageSource":image.source,"imageLicense":image.license,"galleryItems":gallery[]{"file":asset->originalFilename,"url":asset->url,alt,caption,credit,source,license},tier,showcaseDetail,shortDescription,highlights,githubRepo}',
      { tags: CONTENT_TAGS.project }
    ),
    querySanity<Array<{
      title?: string;
      issuedAt?: string;
      tags?: string[];
      issuer?: string;
      imageFile?: string;
      imageUrl?: string;
      alt?: string;
      caption?: string;
      credit?: string;
      source?: string;
      license?: string;
    }>>(
      '*[_type == "certification"] | order(order asc, issuedAt desc){title,issuedAt,tags,"issuer":issuer->title,"imageFile":image.asset->originalFilename,"imageUrl":image.asset->url,alt,caption,credit,source,license}',
      { tags: CONTENT_TAGS.certification }
    ),
    querySanity<Array<{
      title?: string;
      mediaType?: string;
      tags?: string[];
      capturedAt?: string;
      category?: { title?: string };
      image?: { asset?: { originalFilename?: string } };
      mediaPath?: string;
      mediaFile?: string;
      mediaUrl?: string;
      alt?: string;
      caption?: string;
      credit?: string;
      source?: string;
      license?: string;
    }>>(
      '*[_type == "galleryImage"] | order(order asc, capturedAt desc){title,mediaType,tags,capturedAt,"category":category->title,"mediaFile":image.asset->originalFilename,"mediaUrl":image.asset->url,mediaPath,alt,caption,credit,source,license}',
      { tags: CONTENT_TAGS.galleryImage }
    ),
    querySanity<Array<{
      title?: string;
      slug?: string;
      excerpt?: string;
      readTime?: string;
      body?: unknown;
      tags?: string[];
      publishedAt?: string;
      coverImagePath?: string;
      mainImage?: { asset?: { originalFilename?: string; url?: string } };
      author?: { name?: string };
      categories?: Array<{ title?: string }>;
      sourceId?: string;
      published?: boolean;
      featured?: boolean;
      metaTitle?: string;
      metaDescription?: string;
      mainImageFile?: string;
      mainImageUrl?: string;
    }>>(
      '*[_type == "post" && published == true && defined(slug.current)] | order(publishedAt desc){title,"slug":slug.current,excerpt,readTime,body,tags,publishedAt,coverImagePath,featured,metaTitle,metaDescription,"mainImageFile":mainImage.asset->originalFilename,"mainImageUrl":mainImage.asset->url,"author":author->name,"categories":categories[]->title,sourceId,published}',
      { tags: CONTENT_TAGS.post }
    ),
    querySanity<Array<{
      name?: string;
      url?: string;
      joinedAt?: string;
    }>>(
      '*[_type == "membership"] | order(joinedAt desc){name,url,joinedAt}',
      { tags: CONTENT_TAGS.membership }
    ),
    querySanity<Array<{
      quote?: string;
      name?: string;
      title?: string;
      company?: string;
      featured?: boolean;
      relationship?: string;
      companyUrl?: string;
      avatarUrl?: string;
    }>>(
      '*[_type == "recommendation"] | order(_createdAt asc){quote,name,title,company,featured,relationship,companyUrl,"avatarUrl":avatar.asset->url}',
      { tags: CONTENT_TAGS.recommendation }
    ),
    querySanity<{
      footer?: {
        leadText?: string;
        linkLabel?: string;
        copyright?: string;
        backToPortfolioLabel?: string;
        contactPrompt?: string;
      };
      blog?: {
        title?: string;
        description?: string;
        backLabel?: string;
      };
      siteName?: string;
      siteTagline?: string;
      ownerName?: string;
      ownerShortName?: string;
      contactEmail?: string;
      themeColor?: string;
      primaryAccent?: string;
      secondaryAccent?: string;
      defaultMetaTitle?: string;
      defaultMetaDescription?: string;
      canonicalUrl?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImageUrl?: string;
      ogImageSquareUrl?: string;
      twitterImageUrl?: string;
      robotsNoindex?: boolean;
      robotsNofollow?: boolean;
    }>(
      '*[_type == "siteSettings"][0]{footer{leadText,linkLabel,copyright,backToPortfolioLabel,contactPrompt},blog{title,description,backLabel},siteName,siteTagline,ownerName,ownerShortName,contactEmail,themeColor,primaryAccent,secondaryAccent,defaultMetaTitle,defaultMetaDescription,canonicalUrl,ogTitle,ogDescription,"ogImageUrl":ogImage.asset->url,"ogImageSquareUrl":ogImageSquare.asset->url,"twitterImageUrl":twitterImage.asset->url,robotsNoindex,robotsNofollow}',
      { tags: CONTENT_TAGS.siteSettings }
    ),
  ]);

  // Helper to lazily load the fallback content only when needed. Use a
  // dynamic import to avoid bundling large JSON fixtures into the
  // production server bundle and to sidestep static type ambiguities
  // that can arise during build-time resolution.
  let _fallback: CmsContent | null = null;
  const getFallback = async (): Promise<CmsContent> => {
    if (_fallback) return _fallback;

    const shared = await import('./cms-content.shared');
    const candidate: CmsContent = shared.fallbackCmsContent ?? (await (shared as any).getFallbackCmsContent());
    _fallback = candidate;
    return _fallback;
  };

  if (!profileDoc || !techDoc) {
    return await getFallback();
  }

  const technologies = techDoc.technologies ?? [];
  const socialLinks = (profileDoc?.socialLinks ?? []).map(mapSocialLink).filter(Boolean) as SocialLink[];
  const aboutParagraphsFromPortable = portableTextToParagraphs(aboutDoc?.aboutContent);
  const aboutParagraphsFromLegacy = (aboutDoc?.aboutParagraphs ?? []).map((paragraph) => String(paragraph).trim()).filter(Boolean);

  const profile: Profile = {
    name: profileDoc.fullName || (await getFallback()).profile.name,
    title: profileDoc.title || (await getFallback()).profile.title,
    email: profileDoc.email || (await getFallback()).profile.email,
    phone: profileDoc.phone || (await getFallback()).profile.phone,
    location: profileDoc.location || (await getFallback()).profile.location,
    github: profileDoc.github || (await getFallback()).profile.github,
    linkedin: profileDoc.linkedin || (await getFallback()).profile.linkedin,
    summary: profileDoc.summary || (await getFallback()).profile.summary,
    avatarUrl: profileDoc.avatarUrl || undefined,
    resumeUrl: profileDoc.resumeUrl || undefined,
    availabilityLabel: profileDoc.availabilityLabel || undefined,
    highlights: profileDoc.highlights || (await getFallback()).profile.highlights,
    education: profileDoc.education || (await getFallback()).profile.education,
  };

  const hero = {
    roles: (profileDoc?.heroRoles ?? []).filter(Boolean),
    availabilityLabel: profileDoc?.availabilityLabel || '',
    // Use a sized variant for the hero/profile image to reduce decode cost
    // for the homepage where the image is small. Components can further
    // request different sizes if needed once a shared canonical URL is
    // available in the content shape.
    profileImageUrl:
      buildMediaGatewayUrl(profileDoc?.profileImageUrl || profileDoc.avatarUrl || '', { width: 320, quality: 85, sign: true }) || '',
  };

  // Determine about paragraphs with a small server-side helper to avoid
  // nested ternaries and repeated fallback calls.
  let aboutParagraphs: string[];
  if (aboutParagraphsFromPortable.length > 0) {
    aboutParagraphs = aboutParagraphsFromPortable;
  } else if (aboutParagraphsFromLegacy.length > 0) {
    aboutParagraphs = aboutParagraphsFromLegacy;
  } else {
    const fb = await getFallback();
    aboutParagraphs = fb.profile.summary ? [fb.profile.summary] : [];
  }

  const about = { paragraphs: aboutParagraphs };

  const experiences: Experience[] = (experienceDocs ?? []).map((experience) => ({
    company: experience.company || '',
    position: experience.role || '',
    summary: experience.summary || '',
    featuredStory: experience.featuredStory || undefined,
    country: experience.location || '',
    modality: experience.workModel || '',
    type: experience.employmentType || '',
    startedAt: experience.startDate || '',
    endedAt: experience.endDate || null,
    technologies: experience.tags || [],
    highlights: experience.highlights || [],
    achievements: experience.achievements || [],
    relatedProjects: [],
    images: experience.images || [],
  }));

  const rawProjects: Project[] = (projectDocs ?? []).map((project) => ({
    title: project.title || '',
    image:
      buildMediaGatewayUrl(project.imageUrl || (project.galleryItems?.[0]?.url ?? ''), { width: 560, quality: 85, sign: true }) ||
      resolveMediaPath(project.imageFile, project.imageUrl) ||
      '',
    imageAlt: project.imageAlt || project.title,
    imageCaption: project.imageCaption || '',
    imageCredit: project.imageCredit || '',
    imageSource: project.imageSource || '',
    imageLicense: project.imageLicense || '',
    description: project.summary || '',
    challenge: project.challenge || undefined,
    solution: project.solution || undefined,
    result: project.result || undefined,
    featured: project.featured || false,
    repositoryURL: project.repositoryUrl || null,
    liveURL: project.liveUrl || null,
    processURL: project.processUrl || null,
    detailURL: project.detailUrl || project.liveUrl || project.repositoryUrl || null,
    previewVideoURL: project.previewVideoUrl || null,
    tags: project.technologies || [],
    year: project.year || new Date().getFullYear(),
    category: project.category,
    role: project.role,
    impactMetrics: (project.achievements || []).map((achievement, index) => ({
      label: `Highlight ${index + 1}`,
      value: achievement,
    })),
    featuredRank: project.featuredRank || null,
    status: (project.status as Project['status']) || undefined,
    gallery: (project.galleryItems ?? []).map((galleryItem) => ({
      image: galleryItem.url || galleryItem.file || '',
      caption: galleryItem.caption || project.title || '',
      alt: galleryItem.alt || galleryItem.caption || project.title || '',
      credit: galleryItem.credit || '',
      source: galleryItem.source || '',
      license: galleryItem.license || '',
    })),
    tier: (project.tier as Project['tier']) || 'standard',
    showcaseDetail: project.showcaseDetail || false,
    shortDescription: project.shortDescription || '',
    highlights: project.highlights || [],
    githubRepo: project.githubRepo || '',
    slug: project.slug || '',
  }));

  const seenProjectKeys = new Set<string>();
  const projects = rawProjects.filter((project) => {
    const key = (project.githubRepo || project.slug || project.title || '').trim().toLowerCase();
    if (!key) return true;
    if (seenProjectKeys.has(key)) return false;
    seenProjectKeys.add(key);
    return true;
  });

  const certifications: Certification[] = (certificationDocs ?? []).map((certification, index) => ({
    title: certification.title || '',
    // Prefer the Sanity asset URL for certification images
    image: buildMediaGatewayUrl(certification.imageUrl || '', { width: 320, quality: 85, sign: true }) || '',
    imageUrl: certification.imageUrl || '',
    alt: certification.alt || certification.title || '',
    caption: certification.caption || '',
    credit: certification.credit || '',
    source: certification.source || '',
    license: certification.license || '',
    issuer: certification.issuer || '',
    issuedAt: certification.issuedAt || '',
    tags: certification.tags || [],
  }));

  const galleryImages: GalleryItem[] = (galleryDocs ?? []).map((image) => ({
    title: image.title || '',
    mediaType: image.mediaType || 'Image',
    // Use the Sanity-hosted media URL when available; otherwise empty.
    // Request a lightweight preview size for gallery thumbnails.
    media: buildMediaGatewayUrl(image.mediaUrl || image.mediaPath || '', { width: 480, quality: 85, sign: true }) || '',
    alt: image.alt || image.title || '',
    caption: image.caption || '',
    credit: image.credit || '',
    source: image.source || '',
    license: image.license || '',
    tags: image.tags || [],
    createdAt: image.capturedAt || '',
  }));

  const memberships: Membership[] = (membershipDocs ?? []).map((membership) => ({
    name: membership.name || '',
    url: membership.url || '',
    joinedAt: membership.joinedAt || '',
  }));

  const recommendations: Recommendation[] = (recommendationDocs ?? []).map((recommendation) => ({
    quote: recommendation.quote || '',
    name: recommendation.name || '',
    title: recommendation.title || '',
    company: recommendation.company || '',
    featured: recommendation.featured || false,
    relationship: recommendation.relationship || '',
    companyUrl: recommendation.companyUrl || '',
    avatarUrl: recommendation.avatarUrl || '',
  }));

  const blogPosts: BlogPost[] = (blogDocs ?? []).map((post, index) => ({
    id: post.sourceId || post.slug || `post-${index + 1}`,
    slug: post.slug || `post-${index + 1}`,
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: portableTextToMarkdown(post.body) || post.excerpt || '',
    date: post.publishedAt || new Date().toISOString(),
    readTime: post.readTime || '5 min read',
    tags: post.tags || [],
    coverImage: (() => {
      const resolved = buildMediaGatewayUrl(post.mainImageUrl || '', { width: 960, quality: 85, sign: true });
      return resolved || '';
    })(),
    featured: post.featured || false,
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
  }));

  const fb = await getFallback();

  return {
    seoSettings: {
      // Prefer the new siteSettings.ogImage (the big branded card); fall
      // back to the static /og-image.svg served from /public, and finally
      // to the empty fallback.
      siteTitle:
        siteSettingsDoc?.ogTitle || siteSettingsDoc?.defaultMetaTitle ||
        fb.seoSettings.siteTitle,
      siteDescription:
        siteSettingsDoc?.ogDescription || siteSettingsDoc?.defaultMetaDescription ||
        fb.seoSettings.siteDescription,
      canonicalUrl: siteSettingsDoc?.canonicalUrl || fb.seoSettings.canonicalUrl,
      ogImageUrl: siteSettingsDoc?.ogImageUrl || fb.seoSettings.ogImageUrl,
      twitterImageUrl: siteSettingsDoc?.twitterImageUrl || siteSettingsDoc?.ogImageUrl || fb.seoSettings.twitterImageUrl,
      noindex: siteSettingsDoc?.robotsNoindex ?? fb.seoSettings.noindex,
      nofollow: siteSettingsDoc?.robotsNofollow ?? fb.seoSettings.nofollow,
    },
    profile,
    siteSettings: {
      footer: {
        leadText: siteSettingsDoc?.footer?.leadText || '',
        linkLabel: siteSettingsDoc?.footer?.linkLabel || '',
        copyright: siteSettingsDoc?.footer?.copyright || '',
        backToPortfolioLabel: siteSettingsDoc?.footer?.backToPortfolioLabel || 'Back to Portfolio',
        contactPrompt: siteSettingsDoc?.footer?.contactPrompt || 'Send a message',
      },
      blog: {
        title: siteSettingsDoc?.blog?.title || 'Blog',
        description: siteSettingsDoc?.blog?.description || 'Thoughts on AI, software engineering, cloud development, and more.',
        backLabel: siteSettingsDoc?.blog?.backLabel || 'Back to Portfolio',
      },
    },
    hero,
    about,
    experiences,
    projects,
    certifications,
    galleryImages,
    memberships,
    recommendations,
    socialLinks,
    technologies,
    techCategories: cmsShared.buildTechCategories(technologies),
    blogPosts: (blogPosts && blogPosts.length > 0) ? blogPosts : fb.blogPosts,
  };
}

// React's `cache` helper is available in production runtimes but may not be
// present or callable in test environments. Use a safe wrapper so tests can
// import `getCmsContent` without requiring a working React cache implementation.
const maybeCache = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

export const getCmsContent = maybeCache(getCmsContentImpl);

/**
 * Build-time-safe enumeration of blog post slugs for `generateStaticParams`.
 *
 * `getCmsContent` calls `draftMode()` to pick a Sanity perspective, but
 * `generateStaticParams` runs at build time without an HTTP request, so
 * `draftMode()` throws. This function deliberately goes through the
 * published-only public client and never touches `draftMode()`. Slugs
 * returned here are the pre-rendered set; other slugs still resolve at
 * request time via `dynamicParams = true`.
 */
export async function getBlogPostSlugsForStaticParams(): Promise<{ slug: string }[]> {
  if (!IS_BLOG_VISIBLE) {
    return [];
  }

  const projectId = getProjectId();
  if (!projectId) {
    return cmsShared.fallbackBlogPosts.map((post) => ({ slug: post.slug }));
  }

  try {
    const client = getPublicClient();
    const docs = await client.fetch<Array<{ slug?: string }>>(
      '*[_type == "post" && published == true && defined(slug.current)]{"slug":slug.current}'
    );
    const slugs = (docs ?? [])
      .map((doc) => doc.slug)
      .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
    if (slugs.length === 0) {
      return cmsShared.fallbackBlogPosts.map((post) => ({ slug: post.slug }));
    }
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[cms] blog slug enumeration failed, falling back to local posts', err);
    }
    return cmsShared.fallbackBlogPosts.map((post) => ({ slug: post.slug }));
  }
}

/**
 * Build-time-safe enumeration of project slugs for `generateStaticParams`.
 * Only returns slugs for projects with showcaseDetail enabled.
 */
export async function getProjectSlugsForStaticParams(): Promise<{ slug: string }[]> {
  const projectId = getProjectId();
  if (!projectId) {
    return cmsShared.fallbackCmsContent.projects
      .filter((p) => p.showcaseDetail && p.slug)
      .map((p) => ({ slug: p.slug! }));
  }

  try {
    const client = getPublicClient();
    const docs = await client.fetch<Array<{ slug?: string }>>(
      '*[_type == "project" && showcaseDetail == true && defined(slug.current)]{"slug":slug.current}'
    );
    const slugs = (docs ?? [])
      .map((doc) => doc.slug)
      .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
    if (slugs.length === 0) {
      return cmsShared.fallbackCmsContent.projects
        .filter((p) => p.showcaseDetail && p.slug)
        .map((p) => ({ slug: p.slug! }));
    }
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[cms] project slug enumeration failed', err);
    }
    return cmsShared.fallbackCmsContent.projects
      .filter((p) => p.showcaseDetail && p.slug)
      .map((p) => ({ slug: p.slug! }));
  }
}

/**
 * Fetch a single project by slug for the detail page.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projectId = getProjectId();
  if (!projectId) {
    return cmsShared.fallbackCmsContent.projects.find((p) => p.slug === slug) ?? null;
  }

  try {
    const doc = await querySanity<{
      title?: string;
      slug?: string;
      summary?: string;
      challenge?: string;
      solution?: string;
      result?: string;
      year?: number;
      category?: string;
      featured?: boolean;
      role?: string;
      technologies?: string[];
      achievements?: string[];
      featuredRank?: number;
      status?: string;
      liveUrl?: string;
      repositoryUrl?: string;
      imageUrl?: string;
      imageAlt?: string;
      galleryItems?: Array<{
        url?: string;
        alt?: string;
        caption?: string;
        credit?: string;
        source?: string;
        license?: string;
      }>;
      tier?: string;
      showcaseDetail?: boolean;
      shortDescription?: string;
      highlights?: string[];
      githubRepo?: string;
    }>(
      `*[_type == "project" && slug.current == "${slug}"][0]{title,"slug":slug.current,summary,challenge,solution,result,year,category,featured,role,technologies,achievements,featuredRank,status,liveUrl,repositoryUrl,"imageUrl":image.asset->url,"imageAlt":image.alt,"galleryItems":gallery[]{url:asset->url,alt,caption,credit,source,license},tier,showcaseDetail,shortDescription,highlights,githubRepo}`,
      { tags: CONTENT_TAGS.project }
    );

    if (!doc) return null;

    return {
      title: doc.title || '',
      image: buildMediaGatewayUrl(doc.imageUrl || '', { width: 960, quality: 85, sign: true }) || '',
      imageAlt: doc.imageAlt || doc.title || '',
      description: doc.summary || '',
      challenge: doc.challenge || undefined,
      solution: doc.solution || undefined,
      result: doc.result || undefined,
      featured: doc.featured || false,
      repositoryURL: doc.repositoryUrl || null,
      liveURL: doc.liveUrl || null,
      processURL: null,
      detailURL: doc.liveUrl || doc.repositoryUrl || null,
      tags: doc.technologies || [],
      year: doc.year || new Date().getFullYear(),
      category: doc.category,
      role: doc.role,
      impactMetrics: (doc.achievements || []).map((a: string, i: number) => ({ label: `Highlight ${i + 1}`, value: a })),
      featuredRank: doc.featuredRank || null,
      status: (doc.status as Project['status']) || undefined,
      gallery: (doc.galleryItems ?? []).map((g: { url?: string; alt?: string; caption?: string; credit?: string; source?: string; license?: string }) => ({
        image: g.url || '',
        caption: g.caption || '',
        alt: g.alt || g.caption || '',
        credit: g.credit || '',
        source: g.source || '',
        license: g.license || '',
      })),
      tier: (doc.tier as Project['tier']) || 'standard',
      showcaseDetail: doc.showcaseDetail || false,
      shortDescription: doc.shortDescription || '',
      highlights: doc.highlights || [],
      githubRepo: doc.githubRepo || '',
      slug: doc.slug || slug,
    };
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[cms] project fetch failed for slug', slug, err);
    }
    return cmsShared.fallbackCmsContent.projects.find((p) => p.slug === slug) ?? null;
  }
}
