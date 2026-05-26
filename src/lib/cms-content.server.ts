// path import removed — we avoid constructing local `/images/*` refs in this slice

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

import { buildTechCategories, fallbackCmsContent, type CmsContent } from './cms-content.shared';

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

async function querySanity<T>(query: string): Promise<T | null> {
  const projectId = getProjectId();

  if (!projectId) {
    return null;
  }

  const url = `https://${projectId}.api.sanity.io/v${sanityApiVersion}/data/query/${getDataset()}?query=${encodeURIComponent(query)}`;

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

/**
 * Prefer canonical Sanity asset URLs when available. For migrated content
 * we should return absolute asset URLs (CDN) and avoid synthesizing
 * local `/images/*` runtime references here. When no Sanity URL is
 * available, return an empty string so callers can fall back to a
 * placeholder image or a controlled local fallback elsewhere.
 */
function resolveMediaPath(fileName?: string | null, url?: string | null): string {
  const normalizedUrl = String(url || '').trim();
  if (normalizedUrl) {
    return normalizedUrl;
  }

  // Do not return local filenames here — return empty to indicate
  // that no Sanity-hosted asset URL is present.
  return '';
}

export async function getCmsContent(): Promise<CmsContent> {
  const [profileDoc, heroDoc, aboutDoc, techDoc, experienceDocs, projectDocs, certificationDocs, galleryDocs, blogDocs, membershipDocs, recommendationDocs] = await Promise.all([
    querySanity<{
      fullName?: string;
      title?: string;
      email?: string;
      phone?: string;
      location?: string;
      github?: string;
      linkedin?: string;
      summary?: string;
      highlights?: Profile['highlights'];
      education?: Profile['education'];
    }>(
      '*[_type == "profile"][0]{fullName,title,email,phone,location,github,linkedin,summary,highlights,education}'
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
      highlights?: string[];
      tags?: string[];
      achievements?: string[];
      images?: string[];
    }>>(
      '*[_type == "experience"] | order(order asc, startDate desc){role,company,location,startDate,endDate,employmentType,workModel,summary,highlights,tags,achievements,images}'
    ),
    querySanity<Array<{
      title?: string;
      slug?: string;
      summary?: string;
      year?: number;
      category?: string;
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
      galleryItems?: Array<{
        file?: string;
        url?: string;
      }>;
    }>>(
      '*[_type == "project"] | order(order asc, featuredRank asc, title asc){title,"slug":slug.current,summary,year,category,role,technologies,achievements,featuredRank,status,liveUrl,repositoryUrl,detailUrl,processUrl,previewVideoUrl,"imageFile":image.asset->originalFilename,"imageUrl":image.asset->url,"galleryItems":gallery[]{"file":asset->originalFilename,"url":asset->url}}'
    ),
    querySanity<Array<{
      title?: string;
      issuedAt?: string;
      tags?: string[];
      issuer?: string;
      imageFile?: string;
      imageUrl?: string;
    }>>(
      '*[_type == "certification"] | order(order asc, issuedAt desc){title,issuedAt,tags,"issuer":issuer->title,"imageFile":image.asset->originalFilename,"imageUrl":image.asset->url}'
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
    }>>(
      '*[_type == "galleryImage"] | order(order asc, capturedAt desc){title,mediaType,tags,capturedAt,"category":category->title,"mediaFile":image.asset->originalFilename,"mediaUrl":image.asset->url,mediaPath}'
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
      mainImageFile?: string;
      mainImageUrl?: string;
    }>>(
      '*[_type == "post" && published == true && defined(slug.current)] | order(publishedAt desc){title,"slug":slug.current,excerpt,readTime,body,tags,publishedAt,coverImagePath,"mainImageFile":mainImage.asset->originalFilename,"mainImageUrl":mainImage.asset->url,"author":author->name,"categories":categories[]->title,sourceId,published}'
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
    }>>(
      '*[_type == "recommendation"] | order(_createdAt asc){quote,name,title,company}'
    ),
  ]);

  if (!profileDoc || !techDoc) {
    return fallbackCmsContent;
  }

  const technologies = techDoc.technologies ?? [];
  const socialLinks = (heroDoc?.socialLinks ?? []).map(mapSocialLink).filter(Boolean) as SocialLink[];
  const aboutParagraphsFromPortable = portableTextToParagraphs(aboutDoc?.aboutContent);
  const aboutParagraphsFromLegacy = (aboutDoc?.aboutParagraphs ?? []).map((paragraph) => String(paragraph).trim()).filter(Boolean);

  const profile: Profile = {
    name: profileDoc.fullName || fallbackCmsContent.profile.name,
    title: profileDoc.title || fallbackCmsContent.profile.title,
    email: profileDoc.email || fallbackCmsContent.profile.email,
    phone: profileDoc.phone || fallbackCmsContent.profile.phone,
    location: profileDoc.location || fallbackCmsContent.profile.location,
    github: profileDoc.github || fallbackCmsContent.profile.github,
    linkedin: profileDoc.linkedin || fallbackCmsContent.profile.linkedin,
    summary: profileDoc.summary || fallbackCmsContent.profile.summary,
    highlights: profileDoc.highlights || fallbackCmsContent.profile.highlights,
    education: profileDoc.education || fallbackCmsContent.profile.education,
  };

  const hero = {
    roles: (heroDoc?.heroRoles ?? []).filter(Boolean),
    availabilityLabel: heroDoc?.availabilityLabel || '',
    profileImageUrl: heroDoc?.profileImageUrl || '',
  };

  const about = {
    paragraphs:
      aboutParagraphsFromPortable.length > 0
        ? aboutParagraphsFromPortable
        : aboutParagraphsFromLegacy.length > 0
          ? aboutParagraphsFromLegacy
          : (fallbackCmsContent.profile.summary ? [fallbackCmsContent.profile.summary] : []),
  };

  const experiences: Experience[] = (experienceDocs ?? []).map((experience) => ({
    company: experience.company || '',
    position: experience.role || '',
    summary: experience.summary || '',
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
    image: project.imageUrl || resolveMediaPath(project.imageFile, project.imageUrl) || '/images/blog/placeholder.png',
    description: project.summary || '',
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
      caption: project.title || '',
    })),
  }));

  const certifications: Certification[] = (certificationDocs ?? []).map((certification, index) => ({
    title: certification.title || '',
    // Prefer the Sanity asset URL for certification images
    image: certification.imageUrl || '',
    imageUrl: certification.imageUrl || '',
    issuer: certification.issuer || '',
    issuedAt: certification.issuedAt || '',
    tags: certification.tags || [],
  }));

  const galleryImages: GalleryItem[] = (galleryDocs ?? []).map((image) => ({
    title: image.title || '',
    mediaType: image.mediaType || 'Image',
    // Use the Sanity-hosted media URL when available; otherwise empty.
    media: image.mediaUrl || '',
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
      const resolved = post.mainImageUrl || resolveMediaPath(post.mainImageFile, post.mainImageUrl as string | undefined);
      if (typeof resolved === 'string' && /^https?:\/\//i.test(resolved)) {
        return resolved;
      }

      // No Sanity-hosted cover image available — fall back to a local
      // placeholder. We intentionally avoid synthesizing `/images/*`
      // runtime refs for migrated content.
      return '/images/blog/placeholder.png';
    })(),
  }));

  return {
    profile,
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
    techCategories: buildTechCategories(technologies),
    blogPosts,
  };
}
