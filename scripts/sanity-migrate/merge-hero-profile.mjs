/**
 * Migration: Merge heroSection into profile
 *
 * Copies heroRoles, socialLinks, profileImage, availabilityLabel, resumeUrl
 * from heroSection to profile. Profile fields win on conflict.
 *
 * Usage:
 *   node scripts/sanity-migrate/merge-hero-profile.mjs --dry-run
 *   node scripts/sanity-migrate/merge-hero-profile.mjs
 *   node scripts/sanity-migrate/merge-hero-profile.mjs --rollback
 */

const SANITY_API_VERSION = 'v2024-01-01';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

const DRY_RUN = process.argv.includes('--dry-run');
const ROLLBACK = process.argv.includes('--rollback');

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing required env vars: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN');
  process.exit(1);
}

async function sanityFetch(query) {
  const url = `https://${PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Query error: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

async function sanityMutate(mutations) {
  const url = `https://${PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutate error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  MERGE heroSection → profile          ║');
  console.log(`║  Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}${ROLLBACK ? ' (ROLLBACK)' : ''}              ║`);
  console.log('╚══════════════════════════════════════╝\n');

  // 1. Fetch both singletons
  const hero = await sanityFetch('*[_type == "heroSection"][0]{_id, _rev, fullName, title, heroRoles, location, availabilityLabel, contactEmail, resumeUrl, profileImage, socialLinks}');
  const profile = await sanityFetch('*[_type == "profile"][0]{_id, _rev, fullName, title, email, phone, location, github, linkedin, summary, avatar, availabilityLabel, resumeUrl, heroRoles, socialLinks, profileImage, highlights, education}');

  if (!hero) {
    console.log('✅ No heroSection found. Nothing to merge.');
    return;
  }

  if (!profile) {
    console.log('❌ No profile found. Create profile first before running this migration.');
    return;
  }

  console.log(`heroSection: ${hero._id}`);
  console.log(`profile: ${profile._id}\n`);

  // 2. Determine what to copy (profile wins on conflict)
  const changes = [];

  // Fields that should be copied if profile is empty
  const fieldsToCopy = [
    { heroField: 'heroRoles', profileField: 'heroRoles', label: 'Hero roles' },
    { heroField: 'socialLinks', profileField: 'socialLinks', label: 'Social links' },
    { heroField: 'profileImage', profileField: 'profileImage', label: 'Profile image' },
  ];

  // Fields where heroSection value should fill profile if profile is empty
  const fieldsToFill = [
    { heroField: 'availabilityLabel', profileField: 'availabilityLabel', label: 'Availability label' },
    { heroField: 'resumeUrl', profileField: 'resumeUrl', label: 'Resume URL' },
    { heroField: 'contactEmail', profileField: 'email', label: 'Email (from contactEmail)' },
  ];

  const profileUpdate = {};

  for (const f of fieldsToCopy) {
    const heroVal = hero[f.heroField];
    const profileVal = profile[f.profileField];

    if (heroVal && (!profileVal || (Array.isArray(profileVal) && profileVal.length === 0))) {
      profileUpdate[f.profileField] = heroVal;
      changes.push({ field: f.label, action: 'COPY', from: 'heroSection', to: 'profile' });
    } else if (heroVal && profileVal) {
      changes.push({ field: f.label, action: 'SKIP (profile has value)', from: 'heroSection', to: 'profile' });
    } else {
      changes.push({ field: f.label, action: 'SKIP (hero empty)', from: 'heroSection', to: 'profile' });
    }
  }

  for (const f of fieldsToFill) {
    const heroVal = hero[f.heroField];
    const profileVal = profile[f.profileField];

    if (heroVal && !profileVal) {
      profileUpdate[f.profileField] = heroVal;
      changes.push({ field: f.label, action: 'FILL', from: 'heroSection', to: 'profile' });
    } else if (heroVal && profileVal) {
      changes.push({ field: f.label, action: 'SKIP (profile has value)', from: 'heroSection', to: 'profile' });
    } else {
      changes.push({ field: f.label, action: 'SKIP (hero empty)', from: 'heroSection', to: 'profile' });
    }
  }

  // 3. Print changes
  console.log('Changes:');
  for (const c of changes) {
    const icon = c.action.startsWith('SKIP') ? '  ⏭️' : '  ✅';
    console.log(`${icon} ${c.field}: ${c.action}`);
  }

  const hasChanges = Object.keys(profileUpdate).length > 0;
  console.log(`\n${hasChanges ? `Will update ${Object.keys(profileUpdate).length} field(s)` : 'No changes needed'}`);

  if (ROLLBACK) {
    // Rollback: restore heroSection from profile (reverse migration)
    console.log('\n🔄 ROLLBACK MODE: Restoring heroSection from profile...');

    const heroRestore = {};
    if (profile.heroRoles?.length) heroRestore.heroRoles = profile.heroRoles;
    if (profile.socialLinks?.length) heroRestore.socialLinks = profile.socialLinks;
    if (profile.profileImage) heroRestore.profileImage = profile.profileImage;
    if (profile.availabilityLabel) heroRestore.availabilityLabel = profile.availabilityLabel;
    if (profile.resumeUrl) heroRestore.resumeUrl = profile.resumeUrl;
    if (profile.email) heroRestore.contactEmail = profile.email;

    if (Object.keys(heroRestore).length === 0) {
      console.log('Nothing to restore.');
      return;
    }

    if (DRY_RUN) {
      console.log('Would restore:', Object.keys(heroRestore));
      return;
    }

    await sanityMutate([{ patch: { id: hero._id, rev: hero._rev, set: heroRestore } }]);
    console.log('✅ heroSection restored.');
    return;
  }

  if (!hasChanges) {
    console.log('\n✅ Nothing to migrate. Profile already has all data.');
    return;
  }

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN — no changes made. Run without --dry-run to apply.');
    return;
  }

  // 4. Apply migration
  console.log('\nApplying migration...');

  // Save migration log for rollback
  const migrationLog = {
    _type: 'migrationLog',
    _id: `migration-merge-hero-profile-${new Date().toISOString().slice(0, 10)}`,
    migration: 'merge-hero-profile',
    executedAt: new Date().toISOString(),
    changes: Object.entries(profileUpdate).map(([field, value]) => ({
      documentId: profile._id,
      action: 'update',
      field,
      newValue: typeof value === 'object' ? JSON.stringify(value) : value,
    })),
  };

  const mutations = [
    // Update profile
    { patch: { id: profile._id, rev: profile._rev, set: profileUpdate } },
    // Save migration log
    { createOrReplace: migrationLog },
  ];

  const result = await sanityMutate(mutations);
  console.log('✅ Profile updated:', result.results?.[0]?.id);

  // 5. Delete heroSection
  console.log('\nDeleting heroSection...');
  const deleteResult = await sanityMutate([{ delete: hero._id }]);
  console.log('✅ heroSection deleted:', deleteResult.results?.[0]?.id);

  console.log('\n✅ Migration complete!');
  console.log('Run with --rollback to reverse if needed.');
}

main().catch(console.error);
