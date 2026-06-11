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
    liveURL: 'https://namias.tech',
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
    githubRepo: 'CaseMaster',
    title: 'CaseMaster',
    shortDescription: 'A comprehensive case management system with Office login and email integration',
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
    githubRepo: 'Gigachad-Accounting-System',
    title: 'Gigachad Accounting System',
    shortDescription: 'Full-featured accounting system with financial tracking and reporting',
    tier: 'featured',
    showcaseDetail: true,
    category: 'Desktop Application',
    role: 'Full-Stack Developer',
    highlights: [
      'Financial transaction tracking',
      'Invoice management',
      'Reporting dashboard',
      'Multi-user support',
    ],
  },
  {
    githubRepo: 'Student-Attendance-Management-System',
    title: 'Student Attendance System',
    shortDescription: 'Barcode-based attendance tracking with mobile app and admin dashboard',
    tier: 'featured',
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
    githubRepo: 'Billing-Management-System',
    title: 'Billing Management System',
    shortDescription: 'Shop management with product CRUD, billing logs, and Excel export',
    tier: 'featured',
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
    githubRepo: 'Biometric-Attendance-System-Using-IOT',
    title: 'Biometric IoT Attendance',
    shortDescription: 'Biometric attendance using IoT fingerprint scanner hardware integration',
    tier: 'featured',
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
    githubRepo: 'Whisper_AI_Real_Time',
    title: 'Whisper AI Real-Time',
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
    githubRepo: 'Whisper-AI-Generate-Subtitles-Transcriptions',
    title: 'Whisper AI Subtitles',
    shortDescription: 'Generate subtitles and transcriptions from audio/video with Whisper AI',
    tier: 'featured',
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
    githubRepo: 'Aura-AI-Discord-Bot',
    title: 'Aura AI Discord Bot',
    shortDescription: 'AI-powered Discord bot with smart moderation and community features',
    tier: 'featured',
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
    githubRepo: 'Pre-enrollment-Management-System',
    title: 'Pre-Enrollment System',
    shortDescription: 'Student pre-enrollment management for Young Achievers School of Caloocan',
    tier: 'featured',
    showcaseDetail: true,
    liveURL: 'https://pp-namias.github.io/Pre-enrollment-Management-System',
    category: 'Education Tech',
    role: 'Full-Stack Developer',
    highlights: [
      'Student data management',
      'Enrollment workflow automation',
      'Database design and optimization',
      'Web application for school admin',
    ],
  },
  {
    githubRepo: 'Java-Rice',
    title: 'Java Rice',
    shortDescription: 'An interactive food ordering system built with Java',
    tier: 'standard',
    showcaseDetail: true,
    category: 'Desktop Application',
    role: 'Developer',
    highlights: [
      'Interactive food ordering UI',
      'Order management system',
      'Java Swing interface',
      'Database integration',
    ],
  },
  {
    githubRepo: 'ATM-System',
    title: 'ATM System',
    shortDescription: 'Automated teller machine application with command line interface',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Desktop Application',
    role: 'Developer',
    highlights: [
      'CLI-based interface',
      'Transaction processing',
      'Account management',
      'Python implementation',
    ],
  },
  {
    githubRepo: 'Car-Dealership-Management-Program',
    title: 'Car Dealership Manager',
    shortDescription: 'Car dealership management system built entirely in C++',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Desktop Application',
    role: 'Developer',
    highlights: [
      'Vehicle inventory management',
      'Sales tracking',
      'C++ implementation',
      'File I/O operations',
    ],
  },
  {
    githubRepo: 'UCC-Student-Portal',
    title: 'UCC Student Portal',
    shortDescription: 'Front-end design for University of Caloocan City student web application',
    tier: 'standard',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/UCC-Student-Portal',
    category: 'Web Application',
    role: 'Frontend Developer',
    highlights: [
      'Responsive student portal UI',
      'Modern HTML/CSS design',
      'User-friendly navigation',
      'University branding',
    ],
  },
  {
    githubRepo: 'UCC-Access-Module',
    title: 'UCC Access Module',
    shortDescription: 'Module access system for the University of Caloocan City',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Web Application',
    role: 'Full-Stack Developer',
    highlights: [
      'Secure module access',
      'User authentication',
      'PHP backend',
      'Database integration',
    ],
  },
  {
    githubRepo: 'Point-of-Sale-System',
    title: 'Point of Sale System',
    shortDescription: 'Point of sale system for retail transaction management',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Desktop Application',
    role: 'Developer',
    highlights: [
      'Transaction processing',
      'Product catalog',
      'Receipt generation',
      'Inventory tracking',
    ],
  },
  {
    githubRepo: 'Banking-System',
    title: 'Banking System',
    shortDescription: 'Banking system with account management and transaction processing',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Desktop Application',
    role: 'Developer',
    highlights: [
      'Account management',
      'Transaction processing',
      'Balance inquiries',
      'Java implementation',
    ],
  },
  {
    githubRepo: 'Final-Program-DSA',
    title: 'DSA in Action',
    shortDescription: 'Data structures and algorithms implementation showcase',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Academic',
    role: 'Developer',
    highlights: [
      'Common data structures',
      'Algorithm implementations',
      'Performance analysis',
      'Java programming',
    ],
  },
  {
    githubRepo: 'HCI-Final-Project',
    title: 'HCI Final Project',
    shortDescription: 'Human-Computer Interaction course final project with UI/UX focus',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Web Application',
    role: 'UI/UX Developer',
    highlights: [
      'User-centered design',
      'Usability testing',
      'Interface prototyping',
      'HCI principles application',
    ],
  },
  {
    githubRepo: 'GizDuino-Program',
    title: 'GizDuino Program',
    shortDescription: 'GizDuino microcontroller programming for IoT and embedded systems',
    tier: 'standard',
    showcaseDetail: false,
    category: 'IoT',
    role: 'IoT Developer',
    highlights: [
      'Microcontroller programming',
      'Hardware interfacing',
      'Sensor integration',
      'C/C++ implementation',
    ],
  },
  {
    githubRepo: 'Tourism-Case-Study',
    title: 'Philippines Tourism',
    shortDescription: 'Tourism case study website showcasing Philippine natural wonders',
    tier: 'standard',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/Tourism-Case-Study',
    category: 'Web Application',
    role: 'Frontend Developer',
    highlights: [
      'Responsive tourism website',
      'Image gallery showcase',
      'HTML/CSS/JS implementation',
      'Cultural content presentation',
    ],
  },
  {
    githubRepo: 'PHP-Login',
    title: 'PHP Login System',
    shortDescription: 'PHP-based login and authentication system',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Web Application',
    role: 'Backend Developer',
    highlights: [
      'User authentication',
      'Session management',
      'PHP backend',
      'Database integration',
    ],
  },
  {
    githubRepo: 'Simple-Program-Menu',
    title: 'Simple Program Menu',
    shortDescription: 'Odd/Even check and looping exercise in Java',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Academic',
    role: 'Developer',
    highlights: [
      'Control flow implementation',
      'Looping constructs',
      'Java basics',
      'Menu-driven program',
    ],
  },
  {
    githubRepo: 'Passed-or-Failed',
    title: 'Passed or Failed',
    shortDescription: 'Grade checker application for student evaluation',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Academic',
    role: 'Developer',
    highlights: [
      'Grade calculation logic',
      'Conditional statements',
      'Java implementation',
      'Student evaluation tool',
    ],
  },
  {
    githubRepo: 'Full-Name-Rotation',
    name: 'Full Name Rotation',
    shortDescription: 'Web system for rotating full name in various directions',
    tier: 'standard',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/Full-Name-Rotation',
    category: 'Web Application',
    role: 'Frontend Developer',
    highlights: [
      'CSS text rotation effects',
      'Interactive web interface',
      'HTML/CSS/JS implementation',
      'Midterm web systems project',
    ],
  },
  {
    githubRepo: 'Galaxy-Animation',
    title: 'Galaxy Animation',
    shortDescription: 'Mesmerizing galaxy animation with pure HTML, CSS, and JavaScript',
    tier: 'archived',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/Galaxy-Animation',
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
    githubRepo: 'CSS3-Robot-Web-Art',
    title: 'CSS3 Robot Art',
    shortDescription: 'CSS robot web art created with pure HTML and CSS',
    tier: 'archived',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/CSS3-Robot-Web-Art',
    category: 'Web Art',
    role: 'Frontend Developer',
    highlights: [
      'Pure CSS artwork',
      'Creative design',
      'No JavaScript used',
      'Web Systems activity',
    ],
  },
  {
    githubRepo: 'CSS3-Robot-Animation',
    title: 'CSS3 Robot Animation',
    shortDescription: 'Animated robot created with pure CSS3 animations',
    tier: 'archived',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/CSS3-Robot-Animation',
    category: 'Web Art',
    role: 'Frontend Developer',
    highlights: [
      'CSS3 keyframe animations',
      'Character animation',
      'Pure CSS implementation',
      'Web Systems activity',
    ],
  },
  {
    githubRepo: 'CSS3-Egg-Asteroid',
    title: 'CSS3 Egg Asteroid',
    shortDescription: 'Egg animation resembling an asteroid floating in space',
    tier: 'archived',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/CSS3-Egg-Asteroid',
    category: 'Web Art',
    role: 'Frontend Developer',
    highlights: [
      'Creative CSS animation',
      'Space theme design',
      'Pure HTML/CSS',
      'Web Systems activity',
    ],
  },
  {
    githubRepo: 'Short-Clip-Animation',
    title: 'Short Clip Animation',
    shortDescription: 'Interactive website showcasing the 2011 Bugatti Veyron sports car',
    tier: 'archived',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/Short-Clip-Animation',
    category: 'Web Art',
    role: 'Frontend Developer',
    highlights: [
      'Interactive car showcase',
      'CSS animation effects',
      'HTML/CSS/JS implementation',
      'Web Systems activity',
    ],
  },
  {
    githubRepo: 'Optimus-Prime-Animation',
    title: 'Optimus Prime Animation',
    shortDescription: 'Transformer character animation created with CSS',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Web Art',
    role: 'Frontend Developer',
    highlights: [
      'Character CSS animation',
      'Creative design',
      'Pure CSS implementation',
      'Web art project',
    ],
  },
  {
    githubRepo: 'Floppy-Bird',
    title: 'Floppy Bird',
    shortDescription: 'Flappy Bird clone game built with web technologies',
    tier: 'archived',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/Floppy-Bird',
    category: 'Game',
    role: 'Game Developer',
    highlights: [
      'Canvas-based game',
      'Physics simulation',
      'Score tracking',
      'HTML/CSS/JS game',
    ],
  },
  {
    githubRepo: 'QR-Code',
    title: 'QR Code Generator',
    shortDescription: 'QR code generation application',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Utility',
    role: 'Developer',
    highlights: [
      'QR code generation',
      'Java implementation',
      'Image processing',
      'Utility application',
    ],
  },
  {
    githubRepo: 'Calendar-2023',
    title: 'Calendar 2023',
    shortDescription: 'Interactive calendar website for Web Systems activity',
    tier: 'archived',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io/Calendar-2023',
    category: 'Web Application',
    role: 'Frontend Developer',
    highlights: [
      'Interactive calendar UI',
      'Date navigation',
      'HTML/CSS/JS',
      'Web Systems activity',
    ],
  },
  {
    githubRepo: 'PP-Namias.github.io',
    title: 'GitHub Pages Bio',
    shortDescription: 'Personal bio data website hosted on GitHub Pages',
    tier: 'archived',
    showcaseDetail: false,
    liveURL: 'https://pp-namias.github.io',
    category: 'Web Application',
    role: 'Frontend Developer',
    highlights: [
      'GitHub Pages deployment',
      'Personal branding',
      'HTML/CSS/JS',
      'Web Systems activity',
    ],
  },
  {
    githubRepo: 'Website-Project',
    title: 'Grade 11 Website',
    shortDescription: 'Grade 11 ICT project for Computer Programming course',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Web Application',
    role: 'Developer',
    highlights: [
      'Grade 11 coursework',
      'HTML/CSS/JS',
      'Computer Programming',
      'ICT project',
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
  {
    githubRepo: 'UCC-Programing-Competition-2023',
    title: 'UCC Programming Competition',
    shortDescription: 'Competition solutions for UCC Programming Competition 2023',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Academic',
    role: 'Competitive Programmer',
    highlights: [
      'Algorithm problem solving',
      'Competitive programming',
      'Java implementation',
      'Time-optimized solutions',
    ],
  },
  {
    githubRepo: 'Java-Program',
    title: 'Java Program Hub',
    shortDescription: 'Collection of Java programs and testing exercises',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Academic',
    role: 'Developer',
    highlights: [
      'Java program collection',
      'Testing exercises',
      'Learning repository',
      'Code practice',
    ],
  },
  {
    githubRepo: 'Cube-Drift',
    title: 'Cube Drift',
    shortDescription: 'Cube drift game built with web technologies',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Game',
    role: 'Game Developer',
    highlights: [
      'Canvas-based game',
      'Physics simulation',
      'HTML/CSS/JS',
      'Game development',
    ],
  },
  {
    githubRepo: 'Login-with-Google',
    title: 'Google Login',
    shortDescription: 'Google Authentication with Firebase using HTML, CSS, and JavaScript',
    tier: 'standard',
    showcaseDetail: false,
    category: 'Web Application',
    role: 'Full-Stack Developer',
    highlights: [
      'Firebase authentication',
      'Google OAuth integration',
      'HTML/CSS/JS implementation',
      'Secure login flow',
    ],
  },
  {
    githubRepo: 'AdventureTyper',
    title: 'Adventure Typer',
    shortDescription: 'Typing adventure game for learning touch typing',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Game',
    role: 'Game Developer',
    highlights: [
      'Typing game mechanics',
      'Adventure theme',
      'JavaScript implementation',
      'Educational game',
    ],
  },
  {
    githubRepo: 'My-first-project-in-programming',
    title: 'First Programming Project',
    shortDescription: 'Very first project in programming - the beginning of the coding journey',
    tier: 'archived',
    showcaseDetail: false,
    category: 'Academic',
    role: 'Developer',
    highlights: [
      'First programming project',
      'Learning fundamentals',
      'C++ implementation',
      'Beginning of coding journey',
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
