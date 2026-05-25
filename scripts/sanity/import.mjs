#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const apiVersion = '2021-06-07';

const sourceFiles = {
  profile: 'portfolio-resources/data/profile.json',
  experiences: 'portfolio-resources/data/experiences.json',
  projects: 'portfolio-resources/data/projects.json',
  certifications: 'portfolio-resources/data/certifications.json',
  gallery: 'portfolio-resources/data/gallery.json',
  technologies: 'portfolio-resources/data/technologies.json',
  blog: 'portfolio-resources/data/blog.json',
  socials: 'portfolio-resources/data/socials.json',
  memberships: 'portfolio-resources/data/memberships.json',
  recommendations: 'portfolio-resources/data/recommendations.json',
};

const phaseOneManifest = [
  {
    sourceFile: sourceFiles.profile,
    targetModel: 'profile singleton document',
    kind: 'singleton',
    notes: ['Uses a dedicated singleton document for identity and education.'],
  },
  {
    sourceFile: sourceFiles.experiences,
    targetModel: 'experience documents',
    kind: 'collection',
    notes: ['Normalize position/role naming during import.'],
  },
  {
    sourceFile: sourceFiles.projects,
    targetModel: 'project documents',
    kind: 'collection',
    notes: ['Preserve detailURL > liveURL > repositoryURL link precedence.'],
  },
  {
    sourceFile: sourceFiles.certifications,
    targetModel: 'certification documents with issuer/category references',
    kind: 'taxonomy',
    notes: ['Seed issuer and category reference documents before certification import.'],
  },
  {
    sourceFile: sourceFiles.gallery,
    targetModel: 'galleryImage documents with galleryCategory references',
    kind: 'taxonomy',
    notes: ['URL-encode media filenames with spaces.'],
  },
  {
    sourceFile: sourceFiles.technologies,
    targetModel: 'techStack singleton document',
    kind: 'singleton',
    notes: ['Bucket technologies by category before import.'],
  },
  {
    sourceFile: sourceFiles.blog,
    targetModel: 'post documents with author/category references',
    kind: 'taxonomy',
    notes: ['Enforce slug uniqueness and publication status normalization.'],
  },
  {
    sourceFile: sourceFiles.socials,
    targetModel: 'heroSection.socialLinks nested array',
    kind: 'embedded',
    notes: ['Keep social links nested under heroSection for Phase 1.'],
  },
  {
    sourceFile: sourceFiles.memberships,
    targetModel: 'membership documents',
    kind: 'collection',
    notes: ['Model memberships as editable documents for future expansion.'],
  },
  {
    sourceFile: sourceFiles.recommendations,
    targetModel: 'recommendation documents',
    kind: 'collection',
    notes: ['Allow placeholder import first, editorial replacement later.'],
  },
];

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function parseEnvContent(content) {
  const parsed = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && !(key in parsed)) {
      parsed[key] = value;
    }
  }

  return parsed;
}

async function loadEnvFile(fileName) {
  const filePath = path.join(repoRoot, fileName);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const parsed = parseEnvContent(content);

    for (const [key, value] of Object.entries(parsed)) {
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // Optional file; ignore if missing.
  }
}

async function loadEnvironment() {
  await loadEnvFile('.env.local');
  await loadEnvFile('.env');
}

async function readJson(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  const content = await fs.readFile(absolutePath, 'utf8');
  return JSON.parse(content);
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    case '.bmp':
      return 'image/bmp';
    default:
      return 'application/octet-stream';
  }
}

async function findAssetPath(folder, fileName) {
  const candidates = [
    path.join(repoRoot, 'public', 'images', folder, fileName),
    path.join(repoRoot, 'portfolio-resources', 'assets', 'images', folder, fileName),
    path.join(repoRoot, 'public', 'images', folder, decodeURIComponent(fileName)),
    path.join(repoRoot, 'portfolio-resources', 'assets', 'images', folder, decodeURIComponent(fileName)),
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Keep looking.
    }
  }

  return null;
}

function buildImageValue(assetId, alt) {
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
    ...(alt ? {alt} : {}),
  };
}

async function uploadImageAsset({projectId, dataset, token, folder, fileName}) {
  const assetPath = await findAssetPath(folder, fileName);

  if (!assetPath) {
    throw new Error(`Missing image asset for ${folder}/${fileName}`);
  }

  const buffer = await fs.readFile(assetPath);
  const uploadUrl = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/assets/images/${dataset}`
  );
  uploadUrl.searchParams.set('filename', fileName);

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': getContentType(fileName),
    },
    body: buffer,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Asset upload failed for ${fileName}: ${response.status} ${body}`);
  }

  const payload = await response.json();
  const asset = payload.document ?? payload.asset ?? payload;
  const assetId = asset?._id ?? asset?.id;

  if (!assetId) {
    throw new Error(`Unable to read asset id from upload response for ${fileName}`);
  }

  return assetId;
}

function markdownToBlocks(markdown) {
  const blocks = [];
  const lines = String(markdown)
    .replace(/\r\n/g, '\n')
    .split('\n');

  let paragraphLines = [];

  const flushParagraph = () => {
    const text = paragraphLines.join(' ').trim();
    if (!text) {
      paragraphLines = [];
      return;
    }

    blocks.push({
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          text,
          marks: [],
        },
      ],
    });

    paragraphLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      blocks.push({
        _type: 'block',
        style: 'h3',
        markDefs: [],
        children: [
          {
            _type: 'span',
            text: line.slice(4).trim(),
            marks: [],
          },
        ],
      });
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      blocks.push({
        _type: 'block',
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            text: line.slice(3).trim(),
            marks: [],
          },
        ],
      });
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      blocks.push({
        _type: 'block',
        style: 'h1',
        markDefs: [],
        children: [
          {
            _type: 'span',
            text: line.slice(2).trim(),
            marks: [],
          },
        ],
      });
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();

  if (blocks.length === 0) {
    return [
      {
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            text: String(markdown).trim(),
            marks: [],
          },
        ],
      },
    ];
  }

  return blocks;
}

function mapSocialPlatform(source) {
  const key = String(source?.icon || source?.name || '').toLowerCase();

  switch (key) {
    case 'github':
      return 'github';
    case 'linkedin':
      return 'linkedin';
    case 'facebook':
      return 'facebook';
    case 'instagram':
      return 'instagram';
    case 'twitter':
    case 'x':
      return 'twitter';
    case 'mail':
    case 'email':
      return 'email';
    case 'cal':
      return 'website';
    default:
      return 'message';
  }
}

function buildProfileDocument(profile) {
  return {
    _id: 'profile',
    _type: 'profile',
    fullName: profile.name,
    title: profile.title,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    github: profile.github,
    linkedin: profile.linkedin,
    summary: profile.summary,
    highlights: profile.highlights,
    education: profile.education,
  };
}

function buildAuthorDocument(profile) {
  return {
    _id: `author-${slugify(profile.name)}`,
    _type: 'author',
    name: profile.name,
    slug: {current: slugify(profile.name)},
    bio: markdownToBlocks(profile.summary),
  };
}

function buildBlogCategoryDocuments(blogPosts) {
  return uniq(blogPosts.flatMap((post) => post.tags ?? [])).map((title) => ({
    _id: `category-${slugify(title)}`,
    _type: 'category',
    title,
    slug: {current: slugify(title)},
  }));
}

function buildCertificationCategoryDocuments(certifications) {
  return uniq(certifications.flatMap((item) => item.tags?.slice(0, 1) ?? [])).map((title) => ({
    _id: `certificationCategory-${slugify(title)}`,
    _type: 'certificationCategory',
    title,
    slug: {current: slugify(title)},
  }));
}

function buildGalleryCategoryDocuments(galleryItems) {
  return uniq(galleryItems.map((item) => item.tags?.[0] || item.mediaType || 'Gallery')).map(
    (title) => ({
      _id: `galleryCategory-${slugify(title)}`,
      _type: 'galleryCategory',
      title,
      slug: {current: slugify(title)},
    })
  );
}

function buildCertificationIssuerDocuments(certifications) {
  return uniq(certifications.map((item) => item.issuer)).map((title) => ({
    _id: `certificationIssuer-${slugify(title)}`,
    _type: 'certificationIssuer',
    title,
    slug: {current: slugify(title)},
  }));
}

function buildHeroSectionDocument(profile, socials) {
  const supportedSocials = socials
    .filter((item) => {
      const icon = String(item?.icon || '').toLowerCase();
      return ['github', 'linkedin', 'facebook', 'instagram', 'twitter', 'x', 'mail', 'email', 'cal', 'discord'].includes(icon);
    })
    .map((item) => ({
      _key: slugify(item.name),
      platform: mapSocialPlatform(item),
      icon: String(item.icon || '').toLowerCase(),
      url: item.link,
      placements: item.featured ? ['hero', 'quickActions'] : ['footer'],
    }));

  return {
    _id: 'heroSection',
    _type: 'heroSection',
    fullName: profile.name,
    title: profile.title,
    heroRoles: uniq([profile.title, 'AI Automation Specialist']).slice(0, 2),
    location: profile.location,
    availabilityLabel: 'Available',
    contactEmail: profile.email,
    resumeUrl: '/resume.pdf',
    socialLinks: supportedSocials,
  };
}

function buildTechStackDocument(technologies) {
  return {
    _id: 'techStack',
    _type: 'techStack',
    title: 'Tech Stack',
    technologies: technologies.map((technology) => ({
      _key: slugify(`${technology.category}-${technology.name}`),
      name: technology.name,
      logo: technology.logo,
      category: technology.category,
      proficiency: technology.proficiency,
    })),
  };
}

function buildExperienceDocuments(experiences) {
  return experiences.map((experience, index) => ({
    _id: `experience-${index + 1}-${slugify(experience.company)}-${slugify(experience.position)}`,
    _type: 'experience',
    order: index + 1,
    role: experience.position,
    company: experience.company,
    location: experience.country,
    startDate: experience.startedAt,
    endDate: experience.endedAt ?? 'Present',
    employmentType: experience.type,
    workModel: experience.modality,
    summary: experience.summary,
    highlights: experience.highlights,
    tags: experience.technologies,
    achievements: experience.achievements,
    images: experience.images,
  }));
}

async function buildProjectDocuments(projects, assetContext) {
  const docs = [];

  for (const [index, project] of projects.entries()) {
    const imageId = await assetContext.projectImage(project.image);
    const galleryImages = [];

    for (const galleryItem of project.gallery ?? []) {
      const galleryImageId = await assetContext.projectImage(galleryItem.image);
      galleryImages.push(buildImageValue(galleryImageId, galleryItem.caption));
    }

    docs.push({
      _id: `project-${index + 1}-${slugify(project.title)}`,
      _type: 'project',
      order: project.featuredRank ?? index + 1,
      title: project.title,
      slug: {current: slugify(project.title)},
      summary: project.description,
      year: project.year,
      category: project.category,
      role: project.role,
      technologies: project.tags,
      achievements: (project.impactMetrics ?? []).map((metric) => `${metric.label}: ${metric.value}`),
      image: buildImageValue(imageId, project.title),
      gallery: galleryImages,
      liveUrl: project.detailURL || project.liveURL || undefined,
      repositoryUrl: project.repositoryURL || undefined,
      featuredRank: project.featuredRank ?? undefined,
      status: project.status ?? undefined,
    });
  }

  return docs;
}

async function buildCertificationDocuments(certifications, assetContext, issuerMap, categoryMap) {
  const docs = [];

  for (const [index, certification] of certifications.entries()) {
    const issuerRef = issuerMap.get(certification.issuer);
    const categoryTitle = certification.tags?.[0] || 'General';
    const categoryRef = categoryMap.get(categoryTitle);
    const imageId = await assetContext.certificationImage(certification.image);

    docs.push({
      _id: `certification-${index + 1}-${slugify(certification.title)}`,
      _type: 'certification',
      order: index + 1,
      title: certification.title,
      issuer: issuerRef ? {_type: 'reference', _ref: issuerRef} : undefined,
      issuedAt: certification.issuedAt,
      category: categoryRef ? {_type: 'reference', _ref: categoryRef} : undefined,
      image: buildImageValue(imageId, certification.title),
    });
  }

  return docs;
}

async function buildGalleryDocuments(galleryItems, assetContext, categoryMap) {
  const docs = [];

  for (const [index, item] of galleryItems.entries()) {
    const categoryTitle = item.tags?.[0] || item.mediaType || 'Gallery';
    const categoryRef = categoryMap.get(categoryTitle);
    const imageId = await assetContext.galleryImage(item.media);

    docs.push({
      _id: `galleryImage-${index + 1}-${slugify(item.title)}`,
      _type: 'galleryImage',
      order: index + 1,
      title: item.title,
      category: categoryRef ? {_type: 'reference', _ref: categoryRef} : undefined,
      capturedAt: item.createdAt,
      alt: item.title,
      image: buildImageValue(imageId, item.title),
    });
  }

  return docs;
}

async function buildBlogDocuments(blogPosts, assetContext, authorRef, categoryMap) {
  const docs = [];

  for (const [index, post] of blogPosts.entries()) {
    const imageId = await assetContext.blogImage(path.basename(post.coverImage));
    const categories = uniq(post.tags).map((tag) => categoryMap.get(tag)).filter(Boolean);

    docs.push({
      _id: `post-${index + 1}-${slugify(post.slug)}`,
      _type: 'post',
      title: post.title,
      slug: {current: post.slug},
      excerpt: post.excerpt,
      mainImage: buildImageValue(imageId, post.title),
      body: markdownToBlocks(post.content),
      author: authorRef ? {_type: 'reference', _ref: authorRef} : undefined,
      categories: categories.map((categoryId) => ({_type: 'reference', _ref: categoryId})),
      publishedAt: post.date,
      published: true,
      featured: index === 0,
    });
  }

  return docs;
}

function buildMembershipDocuments(memberships) {
  return memberships.map((membership, index) => ({
    _id: `membership-${index + 1}-${slugify(membership.name)}`,
    _type: 'membership',
    name: membership.name,
    url: membership.url,
    joinedAt: membership.joinedAt,
  }));
}

function buildRecommendationDocuments(recommendations) {
  return recommendations.map((recommendation, index) => ({
    _id: `recommendation-${index + 1}-${slugify(recommendation.name)}`,
    _type: 'recommendation',
    ...recommendation,
  }));
}

function describeDoc(doc) {
  return `${doc._type}:${doc._id}`;
}

function chunk(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

async function mutateDocuments({projectId, dataset, token, docs}) {
  for (const group of chunk(docs, 25)) {
    const response = await fetch(
      `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mutations: group.map((doc) => ({createOrReplace: doc})),
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Sanity mutation failed: ${response.status} ${body}`);
    }
  }
}

function printPlan(plan) {
  console.log('Phase 1 Sanity migration import runner');
  console.log('-------------------------------------');
  for (const entry of phaseOneManifest) {
    console.log(`${entry.sourceFile} -> ${entry.targetModel}`);
  }
  console.log('');
  console.log(`Documents queued: ${plan.documents.length}`);
  console.log(`Assets queued: ${plan.assets.length}`);
  if (plan.warnings.length > 0) {
    console.log('');
    console.log('Source warnings:');
    for (const warning of plan.warnings) {
      console.log(`- ${warning}`);
    }
  }
  console.log('');
  for (const [type, count] of Object.entries(plan.countsByType)) {
    console.log(`- ${type}: ${count}`);
  }
  console.log('');
  console.log('Planned imports:');
  for (const doc of plan.documents.slice(0, 20)) {
    console.log(`- ${describeDoc(doc)}`);
  }
  if (plan.documents.length > 20) {
    console.log(`- ...and ${plan.documents.length - 20} more`);
  }
}

async function main() {
  await loadEnvironment();

  const dryRun = process.argv.includes('--dry-run');
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN || '';

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID.');
  }

  const profile = await readJson(sourceFiles.profile);
  const experiences = await readJson(sourceFiles.experiences);
  const projects = await readJson(sourceFiles.projects);
  const certifications = await readJson(sourceFiles.certifications);
  const gallery = await readJson(sourceFiles.gallery);
  const technologies = await readJson(sourceFiles.technologies);
  const blogPosts = await readJson(sourceFiles.blog);
  const socials = await readJson(sourceFiles.socials);
  const memberships = await readJson(sourceFiles.memberships);
  const recommendations = await readJson(sourceFiles.recommendations);

  const blogCategoryDocs = buildBlogCategoryDocuments(blogPosts);
  const certificationIssuerDocs = buildCertificationIssuerDocuments(certifications);
  const certificationCategoryDocs = buildCertificationCategoryDocuments(certifications);
  const galleryCategoryDocs = buildGalleryCategoryDocuments(gallery);
  const authorDoc = buildAuthorDocument(profile);
  const heroSectionDoc = buildHeroSectionDocument(profile, socials);
  const techStackDoc = buildTechStackDocument(technologies);
  const experienceDocs = buildExperienceDocuments(experiences);
  const membershipDocs = buildMembershipDocuments(memberships);
  const recommendationDocs = buildRecommendationDocuments(recommendations);
  const profileDoc = buildProfileDocument(profile);
  const warnings = [];

  if (recommendations.length === 0) {
    warnings.push('portfolio-resources/data/recommendations.json is empty; skipping recommendation document writes.');
  }

  const issuerMap = new Map(
    certificationIssuerDocs.map((doc) => [doc.title, doc._id])
  );
  const certificationCategoryMap = new Map(
    certificationCategoryDocs.map((doc) => [doc.title, doc._id])
  );
  const galleryCategoryMap = new Map(
    galleryCategoryDocs.map((doc) => [doc.title, doc._id])
  );
  const blogCategoryMap = new Map(blogCategoryDocs.map((doc) => [doc.title, doc._id]));

  const assetContext = {
    projectImage: async (fileName) => {
      if (dryRun) {
        return `dry-run:projects/${fileName}`;
      }
      return uploadImageAsset({projectId, dataset, token, folder: 'projects', fileName});
    },
    certificationImage: async (fileName) => {
      if (dryRun) {
        return `dry-run:certifications/${fileName}`;
      }
      return uploadImageAsset({projectId, dataset, token, folder: 'certifications', fileName});
    },
    galleryImage: async (fileName) => {
      if (dryRun) {
        return `dry-run:gallery/${fileName}`;
      }
      return uploadImageAsset({projectId, dataset, token, folder: 'gallery', fileName});
    },
    blogImage: async (fileName) => {
      if (dryRun) {
        return `dry-run:blog/${fileName}`;
      }
      return uploadImageAsset({projectId, dataset, token, folder: 'blog', fileName});
    },
  };

  const projectDocs = await buildProjectDocuments(projects, assetContext);
  const certificationDocs = await buildCertificationDocuments(
    certifications,
    assetContext,
    issuerMap,
    certificationCategoryMap
  );
  const galleryDocs = await buildGalleryDocuments(gallery, assetContext, galleryCategoryMap);
  const blogDocs = await buildBlogDocuments(blogPosts, assetContext, authorDoc._id, blogCategoryMap);

  const documents = [
    ...certificationIssuerDocs,
    ...certificationCategoryDocs,
    ...galleryCategoryDocs,
    ...blogCategoryDocs,
    profileDoc,
    authorDoc,
    heroSectionDoc,
    techStackDoc,
    ...experienceDocs,
    ...projectDocs,
    ...certificationDocs,
    ...galleryDocs,
    ...blogDocs,
    ...membershipDocs,
    ...recommendationDocs,
  ];

  const countsByType = documents.reduce((acc, doc) => {
    acc[doc._type] = (acc[doc._type] || 0) + 1;
    return acc;
  }, {});

  const plan = {
    documents,
    countsByType,
    assets: documents.filter((doc) => doc.image?.asset?._ref || doc.mainImage?.asset?._ref),
    warnings,
  };

  printPlan(plan);

  if (dryRun) {
    console.log('');
    console.log('Dry run complete. No documents were written.');
    return;
  }

  if (!token) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN.');
  }

  await mutateDocuments({projectId, dataset, token, docs: documents});

  console.log('');
  console.log(`Imported ${documents.length} documents into ${dataset} on ${projectId}.`);
}

main().catch((error) => {
  console.error('[sanity-import]', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
