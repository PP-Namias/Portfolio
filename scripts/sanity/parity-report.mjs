#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const apiVersion = '2021-06-07';

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
  try {
    const content = await fs.readFile(path.join(repoRoot, fileName), 'utf8');
    const parsed = parseEnvContent(content);

    for (const [key, value] of Object.entries(parsed)) {
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // Optional file; ignore when missing.
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

function buildExpectedCounts({experiences, projects, certifications, gallery, blogPosts, memberships, recommendations}) {
  return {
    profile: 1,
    author: 1,
    heroSection: 1,
    techStack: 1,
    resume: 1,
    experience: experiences.length,
    project: projects.length,
    certificationIssuer: uniq(certifications.map((item) => item.issuer)).length,
    certificationCategory: uniq(certifications.flatMap((item) => item.tags?.slice(0, 1) ?? [])).length,
    certification: certifications.length,
    galleryCategory: uniq(gallery.map((item) => item.tags?.[0] || item.mediaType || 'Gallery')).length,
    galleryImage: gallery.length,
    category: uniq(blogPosts.flatMap((post) => post.tags ?? [])).length,
    post: blogPosts.length,
    membership: memberships.length,
    recommendation: recommendations.length,
  };
}

async function fetchTypeCount({projectId, dataset, token, type}) {
  const query = encodeURIComponent(`count(*[_type == "${type}"])`);
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

  const response = await fetch(url, {
    headers: token ? {Authorization: `Bearer ${token}`} : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Count query failed for ${type}: ${response.status} ${body}`);
  }

  const payload = await response.json();
  return Number(payload.result ?? 0);
}

function printReport(rows) {
  console.log('Sanity import parity report');
  console.log('---------------------------');

  let mismatchCount = 0;

  for (const row of rows) {
    const status = row.actual === row.expected ? 'OK' : 'MISMATCH';
    if (status === 'MISMATCH') {
      mismatchCount += 1;
    }

    console.log(
      `${status.padEnd(8)} ${row.type.padEnd(24)} expected=${String(row.expected).padStart(3)} actual=${String(row.actual).padStart(3)}`
    );
  }

  console.log('');
  console.log(`Checked ${rows.length} document types. Mismatches: ${mismatchCount}.`);

  return mismatchCount;
}

async function main() {
  await loadEnvironment();

  const strict = process.argv.includes('--strict');
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_READ_TOKEN?.trim() || '';

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID.');
  }

  const [
    experiences,
    projects,
    certifications,
    gallery,
    blogPosts,
    memberships,
    recommendations,
  ] = await Promise.all([
    readJson('portfolio-resources/data/experiences.json'),
    readJson('portfolio-resources/data/projects.json'),
    readJson('portfolio-resources/data/certifications.json'),
    readJson('portfolio-resources/data/gallery.json'),
    readJson('portfolio-resources/data/blog.json'),
    readJson('portfolio-resources/data/memberships.json'),
    readJson('portfolio-resources/data/recommendations.json'),
  ]);

  const expectedCounts = buildExpectedCounts({
    experiences,
    projects,
    certifications,
    gallery,
    blogPosts,
    memberships,
    recommendations,
  });

  const rows = [];

  for (const [type, expected] of Object.entries(expectedCounts)) {
    const actual = await fetchTypeCount({projectId, dataset, token, type});
    rows.push({type, expected, actual});
  }

  const mismatchCount = printReport(rows);

  if (strict && mismatchCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[sanity-parity]', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
