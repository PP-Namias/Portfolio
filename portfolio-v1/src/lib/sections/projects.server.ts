import { cache } from 'react';
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server';
import { buildMediaGatewayUrl } from '@/lib/media-gateway';
import type { Project } from '@/types';

const maybeCache = <T extends (...args: unknown[]) => Promise<ProjectsData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

function resolveMediaPath(fileName?: string | null, url?: string | null): string {
  const normalizedUrl = String(url || '').trim();
  if (normalizedUrl) {
    return buildMediaGatewayUrl(normalizedUrl, { sign: true });
  }
  return '';
}

export type ProjectsData = {
  projects: Project[];
};

async function fetchProjectsDataImpl(): Promise<ProjectsData> {
  const projectDocs = await querySanity<Array<{
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
    '*[_type == "project"] | order(order asc, featuredRank asc, title asc){title,"slug":slug.current,summary,challenge,solution,result,year,category,featured,role,technologies,achievements,featuredRank,status,liveUrl,repositoryUrl,"imageFile":image.asset->originalFilename,"imageUrl":image.asset->url,"imageAlt":image.alt,"imageCaption":image.caption,"imageCredit":image.credit,"imageSource":image.source,"imageLicense":image.license,tier,showcaseDetail,shortDescription,highlights,githubRepo,"galleryItems":gallery[]{"file":asset->originalFilename,"url":asset->url,alt,caption,credit,source,license}}',
    { tags: CONTENT_TAGS.project }
  );

  const rawProjects: Project[] = (projectDocs ?? []).map((project) => ({
    title: project.title || '',
    image:
      buildMediaGatewayUrl(project.imageUrl || (project.galleryItems?.[0]?.url ?? ''), {
        width: 560,
        quality: 85,
        sign: true,
      }) ||
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
    processURL: null,
    detailURL: project.liveUrl || project.repositoryUrl || null,
    previewVideoURL: null,
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

  return { projects };
}

export const fetchProjectsData = maybeCache(fetchProjectsDataImpl);
