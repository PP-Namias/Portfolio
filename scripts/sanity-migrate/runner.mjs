/**
 * Migration Runner Framework
 *
 * Idempotent, dry-runnable, rollback-capable migration runner for Sanity.
 *
 * Usage:
 *   node scripts/sanity-migrate/runner.mjs                    # run all pending
 *   node scripts/sanity-migrate/runner.mjs --dry-run          # preview only
 *   node scripts/sanity-migrate/runner.mjs --only <name>      # run specific
 *   node scripts/sanity-migrate/runner.mjs --validate-only    # validate only
 *   node scripts/sanity-migrate/runner.mjs --rollback <name>  # rollback
 */

import { mergeHeroProfile } from './migrations/merge-hero-profile.mjs';
import { cleanupDuplicates } from './migrations/cleanup-duplicates.mjs';
import { seedMissing } from './migrations/seed-missing.mjs';

const SANITY_API_VERSION = 'v2024-01-01';
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

// CLI flags
const DRY_RUN = process.argv.includes('--dry-run');
const VALIDATE_ONLY = process.argv.includes('--validate-only');
const ROLLBACK_FLAG = process.argv.includes('--rollback');
const ONLY_INDEX = process.argv.indexOf('--only');
const ONLY_NAME = ONLY_INDEX !== -1 ? process.argv[ONLY_INDEX + 1] : null;
const ROLLBACK_INDEX = process.argv.indexOf('--rollback');
const ROLLBACK_NAME = ROLLBACK_INDEX !== -1 ? process.argv[ROLLBACK_INDEX + 1] : null;

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing required env vars: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN');
  process.exit(1);
}

// All registered migrations in order
const MIGRATIONS = [
  mergeHeroProfile,
  cleanupDuplicates,
  seedMissing,
];

// Sanity API helpers
export async function sanityFetch(query) {
  const url = `https://${PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Query error: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

export async function sanityMutate(mutations) {
  const url = `https://${PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutate error: ${res.status} ${await res.text()}`);
  return res.json();
}

function log(emoji, msg) {
  console.log(`${emoji} ${msg}`);
}

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  SANITY MIGRATION RUNNER              ║');
  console.log(`║  Project: ${PROJECT_ID?.slice(0, 12)}...         ║`);
  console.log(`║  Dataset: ${DATASET}                 ║`);
  console.log(`║  Mode: ${DRY_RUN ? 'DRY RUN' : VALIDATE_ONLY ? 'VALIDATE' : ROLLBACK_FLAG ? 'ROLLBACK' : 'LIVE'}${ONLY_NAME ? ` (${ONLY_NAME})` : ''}             ║`);
  console.log('╚══════════════════════════════════════╝\n');

  // Filter migrations if --only specified
  let migrations = MIGRATIONS;
  if (ONLY_NAME) {
    migrations = MIGRATIONS.filter(m => m.name === ONLY_NAME);
    if (migrations.length === 0) {
      console.error(`Migration "${ONLY_NAME}" not found. Available: ${MIGRATIONS.map(m => m.name).join(', ')}`);
      process.exit(1);
    }
  }

  // Validate only
  if (VALIDATE_ONLY) {
    console.log('Running validation checks...\n');
    let allValid = true;
    for (const m of migrations) {
      if (m.validate) {
        const valid = await m.validate(sanityFetch);
        if (!valid) allValid = false;
      }
    }
    console.log(allValid ? '\n✅ All validations passed!' : '\n❌ Some validations failed.');
    process.exit(allValid ? 0 : 1);
  }

  // Rollback
  if (ROLLBACK_FLAG) {
    const target = ROLLBACK_NAME || ONLY_NAME;
    if (!target) {
      console.error('Specify migration to rollback: --rollback <name>');
      process.exit(1);
    }
    const migration = MIGRATIONS.find(m => m.name === target);
    if (!migration) {
      console.error(`Migration "${target}" not found.`);
      process.exit(1);
    }
    if (!migration.down) {
      console.error(`Migration "${target}" has no rollback handler.`);
      process.exit(1);
    }
    console.log(`Rolling back: ${migration.name}\n`);
    if (DRY_RUN) {
      log('🔍', 'DRY RUN — no changes made.');
      return;
    }
    const result = await migration.down(sanityFetch, sanityMutate);
    log(result.success ? '✅' : '❌', `${migration.name} rollback: ${result.documentsAffected} documents affected`);
    return;
  }

  // Run migrations
  let totalAffected = 0;
  for (const m of migrations) {
    console.log(`\n── ${m.name} ──`);
    console.log(`   ${m.description}`);

    try {
      if (m.validate) {
        const valid = await m.validate(sanityFetch);
        if (!valid) {
          log('⏭️', `Skipping ${m.name} (validation failed)`);
          continue;
        }
      }

      const result = await m.up(sanityFetch, sanityMutate, DRY_RUN);

      if (result.changes.length === 0) {
        log('✅', 'No changes needed');
      } else {
        for (const c of result.changes) {
          log(c.action === 'skip' ? '⏭️' : '✅', `  ${c.field}: ${c.action}`);
        }
        log('📋', `${result.changes.filter(c => c.action !== 'skip').length} changes applied`);
        totalAffected += result.documentsAffected;
      }
    } catch (err) {
      log('❌', `Error: ${err.message}`);
      process.exit(1);
    }
  }

  console.log(`\n${'═'.repeat(40)}`);
  console.log(`✅ Done! ${totalAffected} total documents affected.`);
}

main().catch(console.error);
