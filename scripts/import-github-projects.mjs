#!/usr/bin/env node

/**
 * GitHub Project Importer for Namias Portfolio
 *
 * Fetches public repos from GitHub, filters by curated list,
 * and upserts Sanity project documents.
 *
 * Usage:
 *   node scripts/import-github-projects.mjs --token=<sanity-token> --github-token=<gh-token>
 *   node scripts/import-github-projects.mjs --dry-run
 */

import { parseArgs } from 'node:util';

const GITHUB_OWNER = 'PP-Namias';
const GITHUB_API = 'https://api.github.com';

const { values } = parseArgs({
  options: {
    token: { type: 'string' },
    'github-token': { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
  strict: false,
});

if (values.help) {
  console.log(`
Usage: node scripts/import-github-projects.mjs [options]

Options:
  --token=<sanity-token>    Sanity API write token
  --github-token=<gh-token> GitHub personal access token (optional, raises rate limit)
  --dry-run                 Preview changes without writing to Sanity
  --help, -h                Show this help message
  `);
  process.exit(0);
}

const SANITY_TOKEN = values.token || process.env.SANITY_API_READ_TOKEN;
const GITHUB_TOKEN = values['github-token'] || process.env.GITHUB_TOKEN;
const DRY_RUN = values['dry-run'];

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const SANITY_API_VERSION = '2024-01-01';

const CURATED_PROJECTS = [
  {
    githubRepo: 'Portfolio',
    title: 'Namias Portfolio',
    shortDescription: 'Production portfolio with AI chat, Sanity CMS, and 278 tests',
    tier: 'featured',
    showcaseDetail: false,
    category: 'Web Application',
    role: 'Full-Stack Developer',
    highlights: [
      '278 tests with react-doctor 100/100 score',
      '19 CI/CD workflows with GitHub Actions',
      'AI chat integration',
      'PentestAgent security scanning',
    ],
  },
  {
    githubRepo: 'Klaro',
    title: 'Klaro - AI Health Companion',
    shortDescription: 'AI-assisted Filipino health companion with document scan and multilingual chatbot',
    tier: 'featured',
    showcaseDetail: true,
    category: 'Healthcare AI',
    role: 'Lead Developer',
    highlights: [
      'Multilingual support for Filipino dialects',
      'Medical document scanning with AI',
      'Facility discovery and consultation booking',
      'Full-stack monorepo with Turborepo',
    ],
  },
  {
    githubRepo: 'Whisper_AI_Real_Time',
    title: 'Whisper AI Real-Time Transcription',
    shortDescription: 'Real-time speech-to-text powered by OpenAI Whisper with GPU acceleration',
    tier: 'featured',
    showcaseDetail: true,
    category: 'AI/ML',
    role: 'AI/ML Developer',
    highlights: [
      'Real-time speech-to-text transcription',
      'Multiple model sizes for different needs',
      'GPU acceleration support',
      'State-of-the-art AI accuracy',
    ],
  },
  {
    githubRepo: 'CaseMaster',
    title: 'CaseMaster - Legal Case Management',
    shortDescription: 'Comprehensive case management with Office login, email, and Notion-style tracker',
    tier: 'featured',
    showcaseDetail: true,
    category: 'Desktop Application',
    role: 'Full-Stack Developer',
    highlights: [
      'Microsoft Office integration',
      'Email management system',
      'Notion-style case tracker',
      'Audit logs and archive system',
    ],
  },
  {
    githubRepo: 'Billing-Management-System',
    title: 'Billing Management System',
    shortDescription: 'Shop management with product CRUD, billing logs, and Excel export',
    tier: 'standard',
    showcaseDetail: true,
    category: 'Desktop Application',
    role: 'Backend Developer',
    highlights: [
      'JavaFX 21 modern UI',
      'MySQL database integration',
      'Excel export functionality',
      'Multi-contributor collaboration',
    ],
  },
  {
    githubRepo: 'Student-Attendance-Management-System',
    title: 'Student Attendance System',
    shortDescription: 'Barcode-based attendance tracking with mobile app and admin dashboard',
    tier: 'standard',
    showcaseDetail: true,
    category: 'Education Tech',
    role: 'Full-Stack Developer',
    highlights: [
      'Barcode-based attendance tracking',
      'Mobile app for teachers',
      'Admin dashboard with analytics',
      'Role-based access control',
    ],
  },
  {
    githubRepo: 'EVOLVE-OR-PERISH',
    title: 'Evolve or Perish',
    shortDescription: 'Animal survival simulation using evolutionary algorithms and neural networks',
    tier: 'standard',
    showcaseDetail: true,
    category: 'AI/ML',
    role: 'AI/ML Developer',
    highlights: [
      'Evolutionary algorithm training',
      'Multi-layer perceptron neural network',
      'Real-time simulation visualization',
      'Computational biology approach',
    ],
  },
  {
    githubRepo: 'Sage-AI',
    title: 'Sage AI - Interactive Fiction',
    shortDescription: 'AI-driven interactive fiction with dynamic storytelling and real-time generation',
    tier: 'standard',
    showcaseDetail: true,
    category: 'AI/Game',
    role: 'AI Developer',
    highlights: [
      'Dynamic storytelling with AI',
      'Player agency with controlled outcomes',
      'Character consistency across sessions',
      'Real-time AI content generation',
    ],
  },
  {
    githubRepo: 'Companion-App-AI',
    title: 'AI Companion App',
    shortDescription: 'Android AI companion built with Kotlin and Jetpack Compose',
    tier: 'standard',
    showcaseDetail: true,
    category: 'Mobile App',
    role: 'Mobile Developer',
    highlights: [
      'Native Android with Jetpack Compose',
      'AI-powered conversations',
      'Modern Material Design UI',
      'Kotlin coroutines for async',
    ],
  },
  {
    githubRepo: 'Whisper-AI-Generate-Subtitles-Transcriptions',
    title: 'Whisper AI Subtitles',
    shortDescription: 'Generate subtitles and transcriptions from audio/video with Whisper AI',
    tier: 'standard',
    showcaseDetail: true,
    category: 'AI/ML',
    role: 'AI/ML Developer',
    highlights: [
      'Audio/video subtitle generation',
      'Multiple output formats',
      'Batch processing support',
      'High accuracy transcription',
    ],
  },
  {
    githubRepo: 'Biometric-Attendance-System-Using-IOT',
    title: 'Biometric IoT Attendance',
    shortDescription: 'Biometric attendance using IoT fingerprint scanner hardware integration',
    tier: 'standard',
    showcaseDetail: true,
    category: 'IoT',
    role: 'IoT Developer',
    highlights: [
      'Fingerprint scanner integration',
      'IoT hardware communication',
      'Real-time attendance logging',
      'Embedded systems programming',
    ],
  },
  {
    githubRepo: 'Aura-AI-Discord-Bot',
    title: 'Aura AI Discord Bot',
    shortDescription: 'AI-powered Discord bot with smart moderation and community features',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Bot',
    role: 'Bot Developer',
    highlights: [
      'AI-powered moderation',
      'Community engagement features',
      'Discord.js integration',
      'Automated responses',
    ],
  },
  {
    githubRepo: 'Galaxy-Animation',
    title: 'Galaxy Animation',
    shortDescription: 'Mesmerizing galaxy animation with pure HTML, CSS, and JavaScript',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Web Art',
    role: 'Frontend Developer',
    highlights: [
      'Pure CSS animations',
      'No external dependencies',
      'Particle system effects',
      'Responsive canvas',
    ],
  },
  {
    githubRepo: 'Pre-enrollment-Management-System',
    title: 'Pre-Enrollment System',
    shortDescription: 'Student pre-enrollment management for Young Achievers School',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Education Tech',
    role: 'Developer',
    highlights: [
      'Student data management',
      'Enrollment workflow',
      'Database design',
      'Web application',
    ],
  },
  {
    githubRepo: 'CSD-Bot',
    title: 'CSD Freshman Bot',
    shortDescription: 'Discord bot with 20+ commands for the CSD Freshman server',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Bot',
    role: 'Bot Developer',
    highlights: [
      '20+ commands',
      'Server management features',
      'Discord.js framework',
      'Community tooling',
    ],
  },
];

async function fetchGitHub(path, token) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'namias-portfolio-importer',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${GITHUB_API}${path}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchRepo(owner, repoName, token) {
  return fetchGitHub(`/repos/${owner}/${repoName}`, token);
}

async function fetchRepoLanguages(owner, repoName, token) {
  return fetchGitHub(`/repos/${owner}/${repoName}/languages`, token);
}

function buildSanityDocument(repo, curated) {
  const languages = repo.language ? [repo.language] : [];
  const topics = repo.topics || [];
  const allTags = [...new Set([...languages, ...topics])].filter(Boolean);

  return {
    _type: 'project',
    _id: `github-${repo.name}`,
    title: curated.title || repo.name,
    slug: { current: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') },
    summary: repo.description || curated.shortDescription || '',
    shortDescription: curated.shortDescription || (repo.description || '').slice(0, 120),
    year: new Date(repo.created_at).getFullYear(),
    category: curated.category || '',
    role: curated.role || '',
    featured: curated.tier === 'featured',
    tier: curated.tier || 'standard',
    showcaseDetail: curated.showcaseDetail || false,
    technologies: allTags.slice(0, 8),
    achievements: curated.highlights || [],
    highlights: curated.highlights || [],
    repositoryUrl: repo.html_url,
    githubRepo: repo.name,
    status: 'completed',
    featuredRank: curated.tier === 'featured' ? 1 : curated.tier === 'standard' ? 2 : 3,
  };
}

async function sanityRequest(method, path, body, token) {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/${SANITY_DATASET}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sanity API error: ${response.status} ${errorText}`);
  }
  return response.json();
}

async function main() {
  console.log('=== Namias Portfolio GitHub Importer ===\n');

  if (!SANITY_TOKEN) {
    console.error('Error: --token or SANITY_API_READ_TOKEN environment variable is required');
    process.exit(1);
  }

  if (!SANITY_PROJECT_ID) {
    console.error('Error: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID environment variable is required');
    process.exit(1);
  }

  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`GitHub owner: ${GITHUB_OWNER}`);
  console.log(`Sanity project: ${SANITY_PROJECT_ID}`);
  console.log(`Sanity dataset: ${SANITY_DATASET}`);
  console.log(`Curated projects: ${CURATED_PROJECTS.length}\n`);

  const results = { created: 0, updated: 0, skipped: 0, errors: 0 };

  for (const curated of CURATED_PROJECTS) {
    process.stdout.write(`[${curated.githubRepo}] `);

    try {
      const repo = await fetchRepo(GITHUB_OWNER, curated.githubRepo, GITHUB_TOKEN);
      const doc = buildSanityDocument(repo, curated);

      if (DRY_RUN) {
        console.log(`WOULD UPSERT: ${doc.title} (${doc.tier})`);
        console.log(`  Slug: ${doc.slug.current}`);
        console.log(`  Tags: ${doc.technologies.join(', ')}`);
        console.log(`  Showcase: ${doc.showcaseDetail}`);
        results.created++;
        continue;
      }

      await sanityRequest('PUT', `/data/mutate/${curated.githubRepo}`, {
        mutations: [{ createIfNotExists: doc }],
      }, SANITY_TOKEN);

      console.log(`OK: ${doc.title} (${doc.tier})`);
      results.created++;
    } catch (error) {
      console.error(`ERROR: ${error.message}`);
      results.errors++;
    }
  }

  console.log(`\n=== Import Complete ===`);
  console.log(`Created/updated: ${results.created}`);
  console.log(`Skipped: ${results.skipped}`);
  console.log(`Errors: ${results.errors}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
