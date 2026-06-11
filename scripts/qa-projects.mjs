#!/usr/bin/env node

/**
 * QA Script for Sanity Projects
 *
 * Validates imported project documents against Sanity schema constraints.
 * Run after import to verify data integrity.
 *
 * Usage:
 *   node scripts/qa-projects.mjs --token=<sanity-token>
 *   node scripts/qa-projects.mjs --dry-run
 */

import { parseArgs } from 'node:util';
import { sanityQuery, validateConnection } from './lib/sanity-client.mjs';

// CLI argument parsing
const { values } = parseArgs({
  options: {
    token: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
  strict: false,
});

if (values.help) {
  console.log(`
Usage: node scripts/qa-projects.mjs [options]

Options:
  --token=<sanity-token>  Sanity API read token (or SANITY_API_READ_TOKEN env)
  --dry-run               Show what would be checked
  --help, -h              Show this help message
`);
  process.exit(0);
}

const SANITY_TOKEN = values.token || process.env.SANITY_API_READ_TOKEN;
const DRY_RUN = values['dry-run'];
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';

async function main() {
  console.log('=== Sanity Projects QA ===\n');

  if (!SANITY_TOKEN && !DRY_RUN) {
    console.error('Error: --token or SANITY_API_READ_TOKEN environment variable is required');
    process.exit(1);
  }

  if (!SANITY_PROJECT_ID && !DRY_RUN) {
    console.error('Error: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID environment variable is required');
    process.exit(1);
  }

  console.log(`Project:   ${SANITY_PROJECT_ID || '(dry-run)'}`);
  console.log(`Dataset:   ${SANITY_DATASET}`);
  console.log(`Mode:      ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  if (DRY_RUN) {
    console.log('Dry run mode - skipping actual queries\n');
    console.log('Would check:');
    console.log('  1. Total project count');
    console.log('  2. Tier distribution');
    console.log('  3. Summary length validation');
    console.log('  4. Showcase project completeness');
    console.log('  5. Slug uniqueness');
    console.log('  6. Featured rank ordering');
    process.exit(0);
  }

  // Validate connection
  const connected = await validateConnection(SANITY_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET);
  if (!connected) {
    console.error('Error: Could not connect to Sanity. Check your token and project ID.');
    process.exit(1);
  }

  console.log('Connected to Sanity ✓\n');

  const issues = [];
  const warnings = [];

  // 1. Count projects
  console.log('1. Project Count');
  const countQuery = `{
    "total": count(*[_type == "project"]),
    "featured": count(*[_type == "project" && tier == "featured"]),
    "standard": count(*[_type == "project" && tier == "standard"]),
    "archived": count(*[_type == "project" && tier == "archived"]),
    "showcase": count(*[_type == "project" && showcaseDetail == true])
  }`;
  const counts = await sanityQuery(countQuery, SANITY_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET);
  console.log(`   Total:    ${counts.total}`);
  console.log(`   Featured: ${counts.featured}`);
  console.log(`   Standard: ${counts.standard}`);
  console.log(`   Archived: ${counts.archived}`);
  console.log(`   Showcase: ${counts.showcase}\n`);

  // 2. Summary length validation
  console.log('2. Summary Length Validation');
  const summaryQuery = `*[_type == "project"] {
    _id,
    title,
    "summaryLength": length(summary),
    summary
  }`;
  const projects = await sanityQuery(summaryQuery, SANITY_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET);

  const tooShort = projects.filter(p => p.summaryLength < 60);
  const tooLong = projects.filter(p => p.summaryLength > 320);

  if (tooShort.length > 0) {
    warnings.push(`${tooShort.length} projects have summaries under 60 chars`);
    for (const p of tooShort.slice(0, 5)) {
      console.log(`   ⚠ ${p.title}: ${p.summaryLength} chars`);
    }
  }
  if (tooLong.length > 0) {
    issues.push(`${tooLong.length} projects have summaries over 320 chars`);
    for (const p of tooLong.slice(0, 5)) {
      console.log(`   ✗ ${p.title}: ${p.summaryLength} chars`);
    }
  }
  if (tooShort.length === 0 && tooLong.length === 0) {
    console.log('   ✓ All summaries within 60-320 chars');
  }
  console.log('');

  // 3. Showcase project completeness
  console.log('3. Showcase Project Completeness');
  const showcaseQuery = `*[_type == "project" && showcaseDetail == true] {
    _id,
    title,
    hasChallenge: defined(challenge),
    hasSolution: defined(solution),
    hasResult: defined(result),
    hasImage: defined(image),
    "highlightCount": count(highlights)
  }`;
  const showcaseProjects = await sanityQuery(showcaseQuery, SANITY_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET);

  const incompleteShowcase = showcaseProjects.filter(p => !p.hasChallenge || !p.hasSolution || !p.hasResult);
  const missingHighlights = showcaseProjects.filter(p => p.highlightCount < 4);

  if (incompleteShowcase.length > 0) {
    issues.push(`${incompleteShowcase.length} showcase projects missing challenge/solution/result`);
    for (const p of incompleteShowcase.slice(0, 5)) {
      console.log(`   ✗ ${p.title}: challenge=${p.hasChallenge}, solution=${p.hasSolution}, result=${p.hasResult}`);
    }
  }
  if (missingHighlights.length > 0) {
    warnings.push(`${missingHighlights.length} showcase projects with fewer than 4 highlights`);
  }
  if (incompleteShowcase.length === 0) {
    console.log('   ✓ All showcase projects have challenge/solution/result');
  }
  console.log('');

  // 4. Slug uniqueness
  console.log('4. Slug Uniqueness');
  const slugQuery = `*[_type == "project"] {
    "slug": slug.current,
    title
  }`;
  const slugs = await sanityQuery(slugQuery, SANITY_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET);

  const slugMap = new Map();
  for (const p of slugs) {
    if (p.slug) {
      if (slugMap.has(p.slug)) {
        slugMap.get(p.slug).push(p.title);
      } else {
        slugMap.set(p.slug, [p.title]);
      }
    }
  }

  const duplicates = [...slugMap.entries()].filter(([, titles]) => titles.length > 1);
  if (duplicates.length > 0) {
    issues.push(`${duplicates.length} duplicate slugs found`);
    for (const [slug, titles] of duplicates.slice(0, 5)) {
      console.log(`   ✗ "${slug}": ${titles.join(', ')}`);
    }
  } else {
    console.log('   ✓ All slugs are unique');
  }
  console.log('');

  // 5. Featured rank ordering
  console.log('5. Featured Rank Ordering');
  const rankQuery = `*[_type == "project" && tier == "featured"] | order(featuredRank asc) {
    title,
    featuredRank,
    order
  }`;
  const featured = await sanityQuery(rankQuery, SANITY_TOKEN, SANITY_PROJECT_ID, SANITY_DATASET);

  const missingRank = featured.filter(p => !p.featuredRank);
  if (missingRank.length > 0) {
    warnings.push(`${missingRank.length} featured projects missing featuredRank`);
  }
  console.log(`   ${featured.length} featured projects`);
  for (const p of featured.slice(0, 5)) {
    console.log(`   ${p.featuredRank || '?'}. ${p.title}`);
  }
  console.log('');

  // Summary
  console.log('='.repeat(60));
  console.log('  QA SUMMARY');
  console.log('='.repeat(60));
  console.log(`  Issues:   ${issues.length}`);
  console.log(`  Warnings: ${warnings.length}`);

  if (issues.length > 0) {
    console.log('\n  Issues:');
    for (const issue of issues) {
      console.log(`    ✗ ${issue}`);
    }
  }

  if (warnings.length > 0) {
    console.log('\n  Warnings:');
    for (const warning of warnings) {
      console.log(`    ⚠ ${warning}`);
    }
  }

  if (issues.length === 0 && warnings.length === 0) {
    console.log('\n  ✓ All checks passed!');
  }

  console.log('='.repeat(60));

  process.exit(issues.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('\nFatal error:', error);
  process.exit(1);
});
