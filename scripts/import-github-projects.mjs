#!/usr/bin/env node

/**
 * GitHub Project Importer for Namias Portfolio
 *
 * Fetches public repos from GitHub, applies curated metadata,
 * and upserts Sanity project documents.
 *
 * Usage:
 *   node scripts/import-github-projects.mjs --token=<sanity-token> --github-token=<gh-token>
 *   node scripts/import-github-projects.mjs --dry-run
 *   node scripts/import-github-projects.mjs --filter=featured
 *   node scripts/import-github-projects.mjs --repo=Klaro
 */

import { parseArgs } from 'node:util';
import { readFileSync } from 'node:fs';
import { config } from 'dotenv';
import { fetchRepo, fetchRepoLanguages, getRateLimit } from './lib/github-api.mjs';
import { upsertProject, fetchExistingProjects, validateConnection } from './lib/sanity-client.mjs';
import { CURATED_PROJECTS, getProjectsByTier, getProjectByRepo, getTierCounts } from './lib/project-curator.mjs';
import { buildSanityDocument } from './lib/data-transform.mjs';
import { getEnrichment, generateFallbackEnrichment } from './lib/enrichment.mjs';
import { validateDocument } from './lib/validation.mjs';
import { createResults, logSuccess, logSkip, logError, printReport, generateJsonReport } from './lib/reporter.mjs';

// Load .env file from project root
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

config({ path: resolve(projectRoot, '.env') });

// Load cached GitHub data for offline mode
let CACHED_REPOS = {};
try {
  const cacheData = JSON.parse(readFileSync(new URL('../docs/github-projects.json', import.meta.url), 'utf-8'));
  if (cacheData.projects) {
    // Projects are organized by tier: { featured: [...], standard: [...], archived: [...] }
    const allProjects = [
      ...(cacheData.projects.featured || []),
      ...(cacheData.projects.standard || []),
      ...(cacheData.projects.archived || []),
    ];
    for (const repo of allProjects) {
      CACHED_REPOS[repo.name] = repo;
    }
  }
} catch {
  // Cache file not available
}

// CLI argument parsing
const { values } = parseArgs({
  options: {
    token: { type: 'string' },
    'github-token': { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    offline: { type: 'boolean', default: true },
    filter: { type: 'string' },
    repo: { type: 'string' },
    verbose: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
  strict: false,
});

// Show help
if (values.help) {
  console.log(`
Usage: node scripts/import-github-projects.mjs [options]

Options:
  --token=<sanity-token>     Sanity API write token (or SANITY_API_READ_TOKEN env)
  --github-token=<gh-token>  GitHub PAT for higher rate limits (or GITHUB_TOKEN env)
  --dry-run                  Preview changes without writing to Sanity
  --offline                  Use cached data from docs/github-projects.json (no GitHub API calls)
  --filter=<tier>            Import only: featured | standard | archived
  --repo=<repo-name>         Import a single repository
  --verbose                  Show detailed output per project
  --help, -h                 Show this help message

Examples:
  # Full import
  node scripts/import-github-projects.mjs --token=xxx --github-token=yyy

  # Dry run
  node scripts/import-github-projects.mjs --dry-run

  # Import only featured projects
  node scripts/import-github-projects.mjs --filter=featured

  # Re-import a single project
  node scripts/import-github-projects.mjs --repo=Klaro --verbose
`);
  process.exit(0);
}

// Environment and config
const SANITY_TOKEN = values.token || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
const GITHUB_TOKEN = values['github-token'] || process.env.GITHUB_TOKEN;
const DRY_RUN = values['dry-run'];
const OFFLINE = values.offline !== false; // Default to online (use cache) unless --offline=false
const FILTER = values.filter;
const REPO_FILTER = values.repo;
const VERBOSE = values.verbose;

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';

// Main orchestrator
async function main() {
  console.log('=== Namias Portfolio GitHub Importer ===\n');

  // Validate environment
  if (!SANITY_TOKEN && !DRY_RUN) {
    console.error('Error: --token or SANITY_API_READ_TOKEN environment variable is required');
    console.error('       (not needed for --dry-run)');
    process.exit(1);
  }

  if (!SANITY_PROJECT_ID && !DRY_RUN) {
    console.error('Error: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID environment variable is required');
    process.exit(1);
  }

  // Display config
  console.log(`Mode:      ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log(`GitHub:    PP-Namias`);
  console.log(`Sanity:    ${SANITY_PROJECT_ID || '(dry-run mode)'}`);
  console.log(`Dataset:   ${SANITY_DATASET}`);
  if (OFFLINE) {
    console.log(`Cache:     ${Object.keys(CACHED_REPOS).length} repos loaded from docs/github-projects.json`);
  }

  // Determine which projects to process
  let projectsToProcess = CURATED_PROJECTS;

  if (REPO_FILTER) {
    const project = getProjectByRepo(REPO_FILTER);
    if (!project) {
      console.error(`Error: Repository "${REPO_FILTER}" not found in curated list`);
      console.error(`Available repos: ${CURATED_PROJECTS.map(p => p.githubRepo).join(', ')}`);
      process.exit(1);
    }
    projectsToProcess = [project];
    console.log(`Filter:    Single repo (${REPO_FILTER})`);
  } else if (FILTER) {
    if (!['featured', 'standard', 'archived'].includes(FILTER)) {
      console.error(`Error: Invalid filter "${FILTER}". Use: featured, standard, or archived`);
      process.exit(1);
    }
    projectsToProcess = getProjectsByTier(FILTER);
    console.log(`Filter:    ${FILTER} tier (${projectsToProcess.length} projects)`);
  }

  const tierCounts = getTierCounts();
  console.log(`Total:     ${tierCounts.total} curated (${tierCounts.featured} featured, ${tierCounts.standard} standard, ${tierCounts.archived} archived)`);
  console.log(`Processing: ${projectsToProcess.length} projects\n`);

  // Check GitHub rate limit (skip in offline mode)
  if (GITHUB_TOKEN && !OFFLINE) {
    try {
      const rateLimit = await getRateLimit(GITHUB_TOKEN);
      console.log(`GitHub API: ${rateLimit.resources.core.remaining}/${rateLimit.resources.core.limit} requests remaining`);
    } catch {
      console.log('GitHub API: Could not check rate limit');
    }
  } else if (!OFFLINE) {
    console.log('GitHub API: No token provided (60 req/hr limit)');
  } else {
    console.log('GitHub API: Offline mode (using cached data)');
  }

  // Validate Sanity connection
  if (!DRY_RUN && SANITY_TOKEN) {
    const connected = await validateConnection(SANITY_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET);
    if (!connected) {
      console.error('Error: Could not connect to Sanity. Check your token and project ID.');
      console.error(`  Project ID: ${SANITY_PROJECT_ID}`);
      console.error(`  Dataset: ${SANITY_DATASET}`);
      console.error(`  Token: ${SANITY_TOKEN ? SANITY_TOKEN.substring(0, 20) + '...' : 'NOT SET'}`);
      process.exit(1);
    }
    console.log('Sanity:    Connected ✓');
  }

  console.log('');

  // Initialize results tracker
  const results = createResults();

  // Process each project
  for (const curated of projectsToProcess) {
    process.stdout.write(`[${curated.githubRepo}] `);

    try {
      // Fetch GitHub data (or use cache in offline mode)
      let repo;
      let languages = {};

      if (OFFLINE) {
        // Use cached data
        repo = CACHED_REPOS[curated.githubRepo];
        if (!repo) {
          console.log(`SKIP: No cached data for ${curated.githubRepo}`);
          logSkip(results, curated.githubRepo, 'No cached data');
          continue;
        }
        // Construct minimal repo object for document building
        repo = {
          name: repo.name || curated.githubRepo,
          description: repo.description || '',
          html_url: repo.githubUrl || `https://github.com/PP-Namias/${curated.githubRepo}`,
          homepage: repo.liveURL || null,
          created_at: repo.createdAt || new Date().toISOString(),
          language: repo.technologies?.[0] || null,
          topics: [],
        };
      } else {
        // Fetch from GitHub API
        repo = await fetchRepo(curated.githubRepo, GITHUB_TOKEN);
        try {
          languages = await fetchRepoLanguages(curated.githubRepo, GITHUB_TOKEN);
        } catch {
          // Languages fetch is optional
        }
      }

      // Build Sanity document
      const doc = buildSanityDocument(repo, curated, languages);

      // Apply enrichment
      const enrichment = getEnrichment(curated.githubRepo);
      if (enrichment) {
        doc.challenge = enrichment.challenge;
        doc.solution = enrichment.solution;
        doc.result = enrichment.result;
      } else if (curated.showcaseDetail) {
        const fallback = generateFallbackEnrichment(repo, curated);
        doc.challenge = fallback.challenge;
        doc.solution = fallback.solution;
        doc.result = fallback.result;
      }

      // Validate document
      const validation = validateDocument(doc, repo);
      if (!validation.valid) {
        console.log(`VALIDATION FAILED:`);
        for (const error of validation.errors) {
          console.log(`  ✗ ${error}`);
        }
        logError(results, curated.githubRepo, validation.errors.join('; '));
        continue;
      }

      if (validation.warnings.length > 0 && VERBOSE) {
        for (const warning of validation.warnings) {
          console.log(`  ⚠ ${warning}`);
        }
      }

      // Dry run mode
      if (DRY_RUN) {
        console.log(`WOULD UPSERT: ${doc.title} (${doc.tier})`);
        if (VERBOSE) {
          console.log(`  Slug:        ${doc.slug.current}`);
          console.log(`  Tags:        ${doc.technologies.join(', ')}`);
          console.log(`  Showcase:    ${doc.showcaseDetail}`);
          console.log(`  Summary:     ${doc.summary.slice(0, 60)}...`);
        }
        logSuccess(results, curated.githubRepo, doc.title, doc.tier, true);
        continue;
      }

      // Upsert to Sanity
      await upsertProject(doc, SANITY_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET);
      console.log(`OK: ${doc.title} (${doc.tier})`);
      logSuccess(results, curated.githubRepo, doc.title, doc.tier, false);

      // Rate limiting - small delay between writes
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.log(`ERROR: ${error.message}`);
      logError(results, curated.githubRepo, error.message);
    }
  }

  // Print report
  printReport(results, DRY_RUN);

  // Generate JSON report file
  const report = generateJsonReport(results, {
    isDryRun: DRY_RUN,
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    githubOwner: 'PP-Namias',
    curatedCount: projectsToProcess.length,
  });

  // Write report to file
  if (!DRY_RUN) {
    const fs = await import('node:fs/promises');
    const reportPath = 'scripts/import-report.json';
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${reportPath}`);
  }

  // Exit with appropriate code
  process.exit(results.errors > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('\nFatal error:', error);
  process.exit(1);
});
