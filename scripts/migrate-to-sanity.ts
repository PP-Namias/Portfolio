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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)+/g, '');
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

  const existingAssetId = await findExistingImageAssetId(assetKey);
  if (existingAssetId) {
    assetIdCache.set(assetKey, existingAssetId);
    return existingAssetId;
  }

  const assetPath = resolveAssetPath(folder, filename);
  if (!assetPath) {
    console.warn(`Asset not found for ${reference}`);
    return null;
  }

  const asset = await client.assets.upload('image', fs.createReadStream(assetPath), {
    filename: assetKey,
  });

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

async function migrateData() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('Missing SANITY_API_WRITE_TOKEN');
    process.exit(1);
  }

  console.log('--- Executing Phase 3: Automated Migration ---');
  const dataDir = path.join(process.cwd(), 'portfolio-resources', 'data');
  
  try {
    // Migrate Profile
    const profilePath = path.join(dataDir, 'profile.json');
    if (fs.existsSync(profilePath)) {
      const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      await client.createOrReplace({
        _type: 'profile',
        _id: 'singleton-profile',
        ...profile
      });
      console.log('✅ Migrated Profile');
    }

    // Migrate Projects
    const projectsPath = path.join(dataDir, 'projects.json');
    if (fs.existsSync(projectsPath)) {
      const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
      for (const project of projects) {
        const projectId = `project-${slugify(project.title || 'untitled')}`;
        const imageField = await getImageField(project.image, 'projects');
        const gallery = await Promise.all(
          (project.gallery || []).map(async (item: { image?: string | null }) => {
            const galleryItem: Record<string, unknown> = { ...item };
            const galleryImage = await getImageField(item.image, 'projects');

            if (galleryImage) {
              galleryItem.image = galleryImage;
            } else {
              delete galleryItem.image;
            }

            return galleryItem;
          })
        );

        const projectDocument: Record<string, unknown> & { _id: string; _type: string } = {
          _type: 'project',
          _id: projectId,
          ...project,
        };

        if (imageField) {
          projectDocument.image = imageField;
        } else {
          delete projectDocument.image;
        }

        if (gallery.length) {
          projectDocument.gallery = gallery;
        }

        await client.createOrReplace(projectDocument);
      }
      console.log(`✅ Migrated ${projects.length} Projects`);
    }

    console.log('--- Migration Script Complete ---');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
