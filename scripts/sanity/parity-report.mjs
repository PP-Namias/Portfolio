#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const apiVersion = '2021-06-07';

const statusPadding = 10;

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

async function fetchCountQuery({projectId, dataset, token, query}) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodedQuery}`;

  const response = await fetch(url, {
    headers: token ? {Authorization: `Bearer ${token}`} : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Readiness query failed: ${response.status} ${body}`);
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
      `${status.padEnd(statusPadding)} ${row.type.padEnd(24)} expected=${String(row.expected).padStart(3)} actual=${String(row.actual).padStart(3)}`
    );
  }

  console.log('');
  console.log(`Checked ${rows.length} document types. Mismatches: ${mismatchCount}.`);

  return mismatchCount;
}

function buildReadinessChecks() {
  return [
    {
      id: 'project-detail-url-defined',
      severity: 'critical',
      description: 'Projects should define detailUrl for explicit click-through parity.',
      query: 'count(*[_type == "project" && !defined(detailUrl)])',
      expected: 0,
      help: 'Populate detailUrl on each project document (or update import mapping to set it).',
    },
    {
      id: 'project-primary-link-available',
      severity: 'critical',
      description: 'Projects should have at least one usable primary link.',
      query:
        'count(*[_type == "project" && !defined(detailUrl) && !defined(liveUrl) && !defined(repositoryUrl)])',
      expected: 0,
      help: 'Ensure each project has detailUrl or liveUrl or repositoryUrl.',
    },
    {
      id: 'hero-whatsapp-contact-integrity',
      severity: 'critical',
      description: 'WhatsApp social links should provide url or whatsappNumber.',
      query:
        'count(*[_type == "heroSection" && count(socialLinks[platform == "whatsapp" && !defined(url) && !defined(whatsappNumber)]) > 0])',
      expected: 0,
      help: 'For WhatsApp items, set either url or whatsappNumber.',
    },
    {
      id: 'blog-cover-source-defined',
      severity: 'critical',
      description: 'Published posts should have a cover source field.',
      query:
        'count(*[_type == "post" && published == true && !defined(mainImage.asset) && !defined(coverImagePath)])',
      expected: 0,
      help: 'Set mainImage (preferred) or coverImagePath for each published post.',
    },
    {
      id: 'about-section-document-exists',
      severity: 'warning',
      description: 'aboutSection singleton should exist before runtime cutover.',
      query: 'count(*[_type == "aboutSection"])',
      expected: 1,
      help: 'Create and maintain a single aboutSection document.',
    },
    {
      id: 'site-settings-document-exists',
      severity: 'warning',
      description: 'siteSettings singleton should exist before runtime cutover.',
      query: 'count(*[_type == "siteSettings"])',
      expected: 1,
      help: 'Create and maintain a single siteSettings document.',
    },
  ];
}

function renderReadinessStatus(check, actual) {
  if (actual === check.expected) {
    return 'READY';
  }

  return check.severity === 'critical' ? 'BLOCKED' : 'WARN';
}

function printReadinessReport(results) {
  console.log('');
  console.log('Readiness checks');
  console.log('----------------');

  let blockedCount = 0;
  let warningCount = 0;

  for (const result of results) {
    const status = renderReadinessStatus(result.check, result.actual);
    if (status === 'BLOCKED') {
      blockedCount += 1;
    }
    if (status === 'WARN') {
      warningCount += 1;
    }

    const expectedLabel = `expected=${result.check.expected}`;
    const actualLabel = `actual=${result.actual}`;
    console.log(
      `${status.padEnd(statusPadding)} ${result.check.id.padEnd(34)} ${expectedLabel.padEnd(12)} ${actualLabel.padEnd(10)} ${result.check.description}`
    );

    if (status !== 'READY') {
      console.log(`${' '.repeat(statusPadding)} ${result.check.help}`);
    }
  }

  console.log('');
  console.log(`Readiness summary: blocked=${blockedCount}, warnings=${warningCount}.`);

  return {blockedCount, warningCount};
}

async function main() {
  await loadEnvironment();

  const strict = process.argv.includes('--strict');
  const readinessOnly = process.argv.includes('--readiness');
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_READ_TOKEN?.trim() || '';

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID.');
  }

  let mismatchCount = 0;

  if (!readinessOnly) {
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

    mismatchCount = printReport(rows);
  } else {
    console.log('Skipping parity count checks (`--readiness` mode).');
  }

  const readinessChecks = buildReadinessChecks();
  const readinessResults = [];

  for (const check of readinessChecks) {
    const actual = await fetchCountQuery({projectId, dataset, token, query: check.query});
    readinessResults.push({check, actual});
  }

  const readinessSummary = printReadinessReport(readinessResults);

  if (strict && (mismatchCount > 0 || readinessSummary.blockedCount > 0)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[sanity-parity]', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
