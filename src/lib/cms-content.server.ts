// path import removed — we avoid constructing local `/images/*` refs in this slice

import { cache } from 'react';

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

const sanityApiVersion = '2021-06-07';

function getProjectId(): string | null {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || process.env.SANITY_PROJECT_ID?.trim() || null;
}

function getDataset(): string {
  return process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || process.env.SANITY_DATASET?.trim() || 'production';
}

function getSanityHeaders(): HeadersInit | undefined {
  const token = process.env.SANITY_API_READ_TOKEN?.trim();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
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

async function querySanity<T>(query: string): Promise<T | null> {
  const projectId = getProjectId();

  if (!projectId) {
    return null;
  }

  const url = `https://${projectId}.api.sanity.io/v${sanityApiVersion}/data/query/${getDataset()}?query=${encodeURIComponent(query)}`;

  // If the same query is already in-flight or cached, return the same
  // promise/value to deduplicate network work.
  const cached = queryCache.get(url) as Promise<T | null> | undefined;
  if (cached) {
    queryCacheStats.hits += 1;
    return cached;
  }

  queryCacheStats.misses += 1;

  const promise = (async (): Promise<T | null> => {
    try {
      const response = await fetch(url, {
        headers: getSanityHeaders(),
        cache: 'no-store',
      });

      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as { result?: T };
      return payload.result ?? null;
    } catch {
      return null;
    }
  })();

  // Store the in-flight promise immediately to deduplicate concurrent
  // callers. Keep the promise in the map so subsequent callers reuse it.
  queryCache.set(url, promise);
  // Ensure we remove broken entries if the promise rejects to avoid
  // permanently caching failures.
  promise.catch(() => queryCache.delete(url));

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
  const [profileDoc, heroDoc, aboutDoc, techDoc, experienceDocs, projectDocs, certificationDocs, galleryDocs, blogDocs, membershipDocs, recommendationDocs, siteSettingsDoc] = await Promise.all([
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
      resumeUrl?: string;
      availabilityLabel?: string;
      highlights?: Profile['highlights'];
      education?: Profile['education'];
    }>(
      '*[_type == "profile"][0]{fullName,title,email,phone,location,github,linkedin,summary,"avatarUrl":avatar.asset->url,resumeUrl,availabilityLabel,highlights,education}'
    ),
    querySanity<{
      socialLinks?: Array<{ platform?: string; icon?: string; url?: string; placements?: string[] }>;
      heroRoles?: string[];
      availabilityLabel?: string;
      profileImageUrl?: string;
    }>(
      '*[_type == "heroSection"][0]{socialLinks[]{platform,icon,url,placements},heroRoles,availabilityLabel,"profileImageUrl":profileImage.asset->url}'
    ),
    querySanity<{
      aboutContent?: unknown;
      aboutParagraphs?: string[];
    }>(
      '*[_type == "aboutSection"][0]{aboutContent,aboutParagraphs}'
    ),
    querySanity<{
      technologies?: Technology[];
    }>(
      '*[_type == "techStack"][0]{technologies[]{name,logo,category,proficiency}}'
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
      '*[_type == "experience"] | order(order asc, startDate desc){role,company,location,startDate,endDate,employmentType,workModel,summary,featuredStory,highlights,tags,achievements,images}'
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
    }>>(
      '*[_type == "project"] | order(order asc, featuredRank asc, title asc){title,"slug":slug.current,summary,challenge,solution,result,year,category,featured,role,technologies,achievements,featuredRank,status,liveUrl,repositoryUrl,detailUrl,processUrl,previewVideoUrl,"imageFile":image.asset->originalFilename,"imageUrl":image.asset->url,"imageAlt":image.alt,"imageCaption":image.caption,"imageCredit":image.credit,"imageSource":image.source,"imageLicense":image.license,"galleryItems":gallery[]{"file":asset->originalFilename,"url":asset->url,alt,caption,credit,source,license}}'
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
      '*[_type == "certification"] | order(order asc, issuedAt desc){title,issuedAt,tags,"issuer":issuer->title,"imageFile":image.asset->originalFilename,"imageUrl":image.asset->url,alt,caption,credit,source,license}'
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
      '*[_type == "galleryImage"] | order(order asc, capturedAt desc){title,mediaType,tags,capturedAt,"category":category->title,"mediaFile":image.asset->originalFilename,"mediaUrl":image.asset->url,mediaPath,alt,caption,credit,source,license}'
    ),
    querySanity<Array<{
      title?: string;
      slug?: { current?: string };
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
      '*[_type == "post" && published == true && defined(slug.current)] | order(publishedAt desc){title,"slug":slug.current,excerpt,readTime,body,tags,publishedAt,coverImagePath,featured,metaTitle,metaDescription,"mainImageFile":mainImage.asset->originalFilename,"mainImageUrl":mainImage.asset->url,"author":author->name,"categories":categories[]->title,sourceId,published}'
    ),
    querySanity<Array<{
      name?: string;
      url?: string;
      joinedAt?: string;
    }>>(
      '*[_type == "membership"] | order(joinedAt desc){name,url,joinedAt}'
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
      '*[_type == "recommendation"] | order(_createdAt asc){quote,name,title,company,featured,relationship,companyUrl,"avatarUrl":avatar.asset->url}'
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
    }>(
      '*[_type == "siteSettings"][0]{footer{leadText,linkLabel,copyright,backToPortfolioLabel,contactPrompt},blog{title,description,backLabel}}'
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
  const socialLinks = (heroDoc?.socialLinks ?? []).map(mapSocialLink).filter(Boolean) as SocialLink[];
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
    roles: (heroDoc?.heroRoles ?? []).filter(Boolean),
    availabilityLabel: heroDoc?.availabilityLabel || '',
    // Use a sized variant for the hero/profile image to reduce decode cost
    // for the homepage where the image is small. Components can further
    // request different sizes if needed once a shared canonical URL is
    // available in the content shape.
    profileImageUrl:
      buildMediaGatewayUrl(heroDoc?.profileImageUrl || profileDoc.avatarUrl || '', { width: 320, quality: 75, sign: true }) || '',
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

  const projects: Project[] = (projectDocs ?? []).map((project) => ({
    title: project.title || '',
    // Use the Sanity-provided image URL when present. Avoid creating
    // local runtime `/images/*` references here — those will be
    // removed as part of the media cutover.
    // Use a medium-sized preview image for project cards to avoid
    // downloading full-resolution assets in the initial render.
    image:
      buildMediaGatewayUrl(project.imageUrl || (project.galleryItems?.[0]?.url ?? ''), { width: 560, quality: 70, sign: true }) ||
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
  }));

  const certifications: Certification[] = (certificationDocs ?? []).map((certification, index) => ({
    title: certification.title || '',
    // Prefer the Sanity asset URL for certification images
    image: buildMediaGatewayUrl(certification.imageUrl || '', { width: 320, quality: 70, sign: true }) || '',
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
    media: buildMediaGatewayUrl(image.mediaUrl || image.mediaPath || '', { width: 480, quality: 70, sign: true }) || '',
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
    id: post.sourceId || post.slug?.current || `post-${index + 1}`,
    slug: post.slug?.current || `post-${index + 1}`,
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: portableTextToMarkdown(post.body) || post.excerpt || '',
    date: post.publishedAt || new Date().toISOString(),
    readTime: post.readTime || '5 min read',
    tags: post.tags || [],
    coverImage: (() => {
      const resolved = buildMediaGatewayUrl(post.mainImageUrl || '', { width: 960, quality: 72, sign: true });
      return resolved || '';
    })(),
    featured: post.featured || false,
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
  }));

  const fb = await getFallback();

  return {
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
