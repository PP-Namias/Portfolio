import { config } from 'dotenv';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const assetRoots = [
  path.join(process.cwd(), 'portfolio-resources', 'assets', 'images'),
  path.join(process.cwd(), 'public', 'images'),
];

const assetIdCache = new Map<string, string>();

const dryRun = process.argv.includes('--dry-run');
const hasWriteToken = Boolean(process.env.SANITY_API_WRITE_TOKEN);

type DocumentStats = {
  created: number;
  updated: number;
  unchanged: number;
  planned: number;
};

const documentStats: Record<
  | 'profile'
  | 'experience'
  | 'project'
  | 'certification'
  | 'technology'
  | 'recommendation'
  | 'membership'
  | 'galleryItem'
  | 'socialLink'
  | 'blogPost',
  DocumentStats
> = {
  profile: { created: 0, updated: 0, unchanged: 0, planned: 0 },
  experience: { created: 0, updated: 0, unchanged: 0, planned: 0 },
  project: { created: 0, updated: 0, unchanged: 0, planned: 0 },
  certification: { created: 0, updated: 0, unchanged: 0, planned: 0 },
  technology: { created: 0, updated: 0, unchanged: 0, planned: 0 },
  recommendation: { created: 0, updated: 0, unchanged: 0, planned: 0 },
  membership: { created: 0, updated: 0, unchanged: 0, planned: 0 },
  galleryItem: { created: 0, updated: 0, unchanged: 0, planned: 0 },
  socialLink: { created: 0, updated: 0, unchanged: 0, planned: 0 },
  blogPost: { created: 0, updated: 0, unchanged: 0, planned: 0 },
};

const assetStats = {
  uploaded: 0,
  reused: 0,
  missing: 0,
  planned: 0,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)+/g, '');
}

function getStringValue(value: unknown, fallback: string) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : fallback;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return fallback;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildDocumentId(prefix: string, ...parts: string[]) {
  const slugParts = parts.map((part) => slugify(part)).filter(Boolean);
  if (!slugParts.length) {
    return `${prefix}-untitled`;
  }

  return `${prefix}-${slugParts.join('-')}`;
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeAssetReference(reference: string, fallbackFolder?: string) {
  const decoded = safeDecode(reference);
  const trimmed = decoded.replace(/^\/+/, '');
  const withoutImagesPrefix = trimmed.startsWith('images/')
    ? trimmed.slice('images/'.length)
    : trimmed;
  const parts = withoutImagesPrefix.split('/');
  const folder = parts.length > 1 ? parts[0] : fallbackFolder || '';
  const filename = parts.length > 1 ? parts.slice(1).join('/') : withoutImagesPrefix;

  return {
    folder,
    filename,
  };
}

function buildAssetKey(folder: string, filename: string) {
  if (!folder) {
    return filename;
  }

  return `${folder}__${filename}`;
}

function resolveAssetPath(folder: string, filename: string) {
  const candidates: string[] = [];

  for (const root of assetRoots) {
    if (folder) {
      candidates.push(path.join(root, folder, filename));
    }
    candidates.push(path.join(root, filename));
  }

  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

async function findExistingImageAssetId(assetKey: string) {
  try {
    const result = await client.fetch(
      '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}',
      { filename: assetKey }
    );

    return result?._id || null;
  } catch (error) {
    console.warn('Asset lookup failed:', error);
    return null;
  }
}

async function getOrUploadImageAsset(reference?: string | null, fallbackFolder?: string) {
  if (!reference) {
    return null;
  }

  const { folder, filename } = normalizeAssetReference(reference, fallbackFolder);
  const assetKey = buildAssetKey(folder, filename);

  if (assetIdCache.has(assetKey)) {
    return assetIdCache.get(assetKey) || null;
  }

  const assetPath = resolveAssetPath(folder, filename);
  if (!assetPath) {
    assetStats.missing += 1;
    console.warn(`Asset not found for ${reference}`);
    return null;
  }

  if (dryRun || !hasWriteToken) {
    assetStats.planned += 1;
    return null;
  }

  const existingAssetId = await findExistingImageAssetId(assetKey);
  if (existingAssetId) {
    assetStats.reused += 1;
    assetIdCache.set(assetKey, existingAssetId);
    return existingAssetId;
  }

  const asset = await client.assets.upload('image', fs.createReadStream(assetPath), {
    filename: assetKey,
  });

  assetStats.uploaded += 1;
  assetIdCache.set(assetKey, asset._id);
  return asset._id;
}

async function getImageField(reference?: string | null, fallbackFolder?: string) {
  const assetId = await getOrUploadImageAsset(reference, fallbackFolder);
  if (!assetId) {
    return null;
  }

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  };
}

type SanityDocument = Record<string, unknown> & { _id: string; _type: string };

function stripSystemFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripSystemFields);
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([key]) => !['_createdAt', '_updatedAt', '_rev'].includes(key)
    );

    return Object.fromEntries(entries.map(([key, val]) => [key, stripSystemFields(val)]));
  }

  return value;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    return `{${entries
      .map(([key, val]) => `"${key}":${stableStringify(val)}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

async function classifyDocument(doc: SanityDocument) {
  if (!hasWriteToken) {
    return 'created' as const;
  }

  const existing = await client.getDocument(doc._id);
  if (!existing) {
    return 'created' as const;
  }

  const existingComparable = stripSystemFields(existing);
  const incomingComparable = stripSystemFields(doc);

  if (stableStringify(existingComparable) === stableStringify(incomingComparable)) {
    return 'unchanged' as const;
  }

  return 'updated' as const;
}

async function upsertDocument(type: keyof typeof documentStats, doc: SanityDocument) {
  const classification = await classifyDocument(doc);

  if (dryRun) {
    documentStats[type].planned += 1;
    if (hasWriteToken) {
      documentStats[type][classification] += 1;
    }
    return;
  }

  if (classification === 'unchanged') {
    documentStats[type].unchanged += 1;
    return;
  }

  await client.createOrReplace(doc);
  documentStats[type][classification] += 1;
}

function readJsonFile<T>(dataDir: string, filename: string): T | null {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function logSummary() {
  console.log('--- Migration Summary ---');
  for (const [type, stats] of Object.entries(documentStats)) {
    console.log(
      `${type}: created ${stats.created}, updated ${stats.updated}, unchanged ${stats.unchanged}, planned ${stats.planned}`
    );
  }
  console.log(
    `assets: uploaded ${assetStats.uploaded}, reused ${assetStats.reused}, missing ${assetStats.missing}, planned ${assetStats.planned}`
  );

  if (dryRun) {
    console.log('Dry run complete. No data was written.');
  }
}

async function mapImageArray(values: unknown, fallbackFolder: string) {
  if (!Array.isArray(values)) {
    return [];
  }

  const stringValues = values.filter(isNonEmptyString);
  const refs = await Promise.all(stringValues.map((image) => getImageField(image, fallbackFolder)));
  return refs.filter(Boolean);
}

async function migrateProfile(dataDir: string) {
  const profile = readJsonFile<Record<string, unknown>>(dataDir, 'profile.json');
  if (!profile) {
    return;
  }

  await upsertDocument('profile', {
    _type: 'profile',
    _id: 'singleton-profile',
    ...profile,
  });
}

async function migrateExperiences(dataDir: string) {
  const experiences = readJsonFile<Array<Record<string, unknown>>>(dataDir, 'experiences.json') || [];
  for (const [index, experience] of experiences.entries()) {
    const company = getStringValue(experience.company, 'unknown');
    const position = getStringValue(experience.position, String(index));
    const experienceId = buildDocumentId('experience', company, position);
    const images = await mapImageArray(experience.images, 'experience');
    const experienceDocument: SanityDocument = {
      _type: 'experience',
      _id: experienceId,
      ...experience,
    };

    if (images.length) {
      experienceDocument.images = images;
    } else {
      delete experienceDocument.images;
    }

    await upsertDocument('experience', experienceDocument);
  }
}

async function migrateProjects(dataDir: string) {
  const projects = readJsonFile<Array<Record<string, unknown>>>(dataDir, 'projects.json') || [];
  for (const project of projects) {
    const title = getStringValue(project.title, 'untitled');
    const projectId = buildDocumentId('project', title);
    const imageRef = isNonEmptyString(project.image)
      ? await getImageField(project.image, 'projects')
      : null;
    const gallery = await Promise.all(
      ((project.gallery as Array<{ image?: string | null }>) || []).map(async (item) => {
        const galleryItem: Record<string, unknown> = { ...item };
        const galleryImage = isNonEmptyString(item.image)
          ? await getImageField(item.image, 'projects')
          : null;

        if (galleryImage) {
          galleryItem.image = galleryImage;
        } else {
          delete galleryItem.image;
        }

        return galleryItem;
      })
    );

    const projectDocument: SanityDocument = {
      _type: 'project',
      _id: projectId,
      ...project,
    };

    if (imageRef) {
      projectDocument.image = imageRef;
    } else {
      delete projectDocument.image;
    }

    if (gallery.length) {
      projectDocument.gallery = gallery;
    }

    await upsertDocument('project', projectDocument);
  }
}

async function migrateCertifications(dataDir: string) {
  const certifications =
    readJsonFile<Array<Record<string, unknown>>>(dataDir, 'certifications.json') || [];
  for (const certification of certifications) {
    const title = getStringValue(certification.title, 'untitled');
    const certificationId = buildDocumentId('certification', title);
    const imageRef = isNonEmptyString(certification.image)
      ? await getImageField(certification.image, 'certifications')
      : null;
    const certificationDocument: SanityDocument = {
      _type: 'certification',
      _id: certificationId,
      ...certification,
    };

    if (imageRef) {
      certificationDocument.image = imageRef;
    } else {
      delete certificationDocument.image;
    }

    await upsertDocument('certification', certificationDocument);
  }
}

async function migrateTechnologies(dataDir: string) {
  const technologies =
    readJsonFile<Array<Record<string, unknown>>>(dataDir, 'technologies.json') || [];
  for (const technology of technologies) {
    const name = getStringValue(technology.name, 'untitled');
    const technologyId = buildDocumentId('technology', name);
    await upsertDocument('technology', {
      _type: 'technology',
      _id: technologyId,
      ...technology,
    });
  }
}

async function migrateRecommendations(dataDir: string) {
  const recommendations =
    readJsonFile<Array<Record<string, unknown>>>(dataDir, 'recommendations.json') || [];
  for (const [index, recommendation] of recommendations.entries()) {
    const name = getStringValue(recommendation.name, 'anonymous');
    const company = getStringValue(recommendation.company, String(index));
    const recommendationId = buildDocumentId('recommendation', name, company);
    await upsertDocument('recommendation', {
      _type: 'recommendation',
      _id: recommendationId,
      ...recommendation,
    });
  }
}

async function migrateMemberships(dataDir: string) {
  const memberships =
    readJsonFile<Array<Record<string, unknown>>>(dataDir, 'memberships.json') || [];
  for (const membership of memberships) {
    const name = getStringValue(membership.name, 'untitled');
    const membershipId = buildDocumentId('membership', name);
    await upsertDocument('membership', {
      _type: 'membership',
      _id: membershipId,
      ...membership,
    });
  }
}

async function migrateGallery(dataDir: string) {
  const galleryItems =
    readJsonFile<Array<Record<string, unknown>>>(dataDir, 'gallery.json') || [];
  for (const [index, galleryItem] of galleryItems.entries()) {
    const title = getStringValue(galleryItem.title, String(index));
    const galleryId = buildDocumentId('gallery', title);
    const mediaRef = isNonEmptyString(galleryItem.media)
      ? await getImageField(galleryItem.media, 'gallery')
      : null;
    const galleryDocument: SanityDocument = {
      _type: 'galleryItem',
      _id: galleryId,
      ...galleryItem,
    };

    if (mediaRef) {
      galleryDocument.media = mediaRef;
    } else {
      delete galleryDocument.media;
    }

    await upsertDocument('galleryItem', galleryDocument);
  }
}

async function migrateSocials(dataDir: string) {
  const socials = readJsonFile<Array<Record<string, unknown>>>(dataDir, 'socials.json') || [];
  for (const social of socials) {
    const name = getStringValue(social.name, 'untitled');
    const socialId = buildDocumentId('social', name);
    await upsertDocument('socialLink', {
      _type: 'socialLink',
      _id: socialId,
      ...social,
    });
  }
}

async function migrateBlogPosts(dataDir: string) {
  const blogPosts = readJsonFile<Array<Record<string, unknown>>>(dataDir, 'blog.json') || [];
  for (const [index, blogPost] of blogPosts.entries()) {
    const slugValue = getStringValue(blogPost.slug, getStringValue(blogPost.id, String(index)));
    const blogId = buildDocumentId('blog', slugValue);
    const coverImage = isNonEmptyString(blogPost.coverImage)
      ? await getImageField(blogPost.coverImage, 'blog')
      : null;
    const blogDocument: SanityDocument = {
      _type: 'blogPost',
      _id: blogId,
      ...blogPost,
      slug: { _type: 'slug', current: slugValue },
    };

    if (coverImage) {
      blogDocument.coverImage = coverImage;
    } else {
      delete blogDocument.coverImage;
    }

    await upsertDocument('blogPost', blogDocument);
  }
}

async function migrateData() {
  if (!hasWriteToken && !dryRun) {
    console.error('Missing SANITY_API_WRITE_TOKEN');
    process.exit(1);
  }

  console.log(
    dryRun
      ? '--- Executing Phase 3: Automated Migration (Dry Run) ---'
      : '--- Executing Phase 3: Automated Migration ---'
  );
  const dataDir = path.join(process.cwd(), 'portfolio-resources', 'data');

  try {
    await migrateProfile(dataDir);
    await migrateExperiences(dataDir);
    await migrateProjects(dataDir);
    await migrateCertifications(dataDir);
    await migrateTechnologies(dataDir);
    await migrateRecommendations(dataDir);
    await migrateMemberships(dataDir);
    await migrateGallery(dataDir);
    await migrateSocials(dataDir);
    await migrateBlogPosts(dataDir);

    logSummary();
    console.log('--- Migration Script Complete ---');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
