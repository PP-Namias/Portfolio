/**
 * Sanity Data Audit Script
 *
 * Queries all document types and reports:
 * - Document counts per type
 * - Field population rates
 * - Duplicate detection
 * - Reference integrity
 *
 * Usage: node scripts/sanity-migrate/audit.mjs [--verbose]
 */

import { sanityQuery } from '../lib/sanity-client.mjs';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const TOKEN = process.env.SANITY_API_READ_TOKEN;

const VERBOSE = process.argv.includes('--verbose');

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing required env vars: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN');
  process.exit(1);
}

const SCHEMA_TYPES = [
  // Singletons
  'heroSection', 'aboutSection', 'profile', 'siteSettings',
  'seoSettings', 'mediaSettings', 'techStack', 'resume',
  // Collections
  'project', 'experience', 'certification', 'galleryImage',
  'recommendation', 'membership', 'post', 'author', 'category',
  // Reference
  'certificationCategory', 'certificationIssuer', 'galleryCategory',
];

async function queryCount(type) {
  try {
    const result = await sanityQuery(`count(*[_type == "${type}"])`, TOKEN, PROJECT_ID, DATASET);
    return result || 0;
  } catch (e) {
    console.error(`  Error querying ${type}: ${e.message}`);
    return -1;
  }
}

async function queryDocuments(type, fields) {
  try {
    const fieldQuery = fields.join(', ');
    const result = await sanityQuery(
      `*[_type == "${type}"]{ _id, _rev, ${fieldQuery} }`,
      TOKEN, PROJECT_ID, DATASET
    );
    return result || [];
  } catch (e) {
    console.error(`  Error querying ${type}: ${e.message}`);
    return [];
  }
}

async function auditSingletons() {
  console.log('\n=== SINGLETONS ===\n');

  const singletons = [
    {
      type: 'heroSection',
      fields: ['fullName', 'title', 'heroRoles', 'location', 'availabilityLabel', 'contactEmail', 'resumeUrl', 'profileImage', 'socialLinks'],
    },
    {
      type: 'aboutSection',
      fields: ['aboutContent', 'aboutParagraphs', 'education'],
    },
    {
      type: 'profile',
      fields: ['fullName', 'title', 'email', 'phone', 'location', 'github', 'linkedin', 'summary', 'avatar', 'availabilityLabel', 'resumeUrl', 'highlights', 'education'],
    },
    {
      type: 'siteSettings',
      fields: ['siteName', 'siteTagline', 'ownerName', 'contactEmail', 'logo', 'favicon'],
    },
    {
      type: 'seoSettings',
      fields: ['siteTitle', 'siteDescription', 'canonicalUrl', 'ogImage', 'noindex'],
    },
    {
      type: 'mediaSettings',
      fields: ['defaultAltTextGuidance', 'fallbackImage', 'imageQualityPreset'],
    },
    {
      type: 'techStack',
      fields: ['title', 'technologies'],
    },
    {
      type: 'resume',
      fields: ['resumeFile', 'resumeUrl', 'isActive'],
    },
  ];

  for (const s of singletons) {
    const count = await queryCount(s.type);
    const status = count === 1 ? '✅' : count === 0 ? '❌ MISSING' : `⚠️ ${count} docs`;
    console.log(`${status} ${s.type} (${count})`);

    if (count > 0) {
      const docs = await queryDocuments(s.type, s.fields);
      const doc = docs[0];
      if (doc && VERBOSE) {
        for (const field of s.fields) {
          const val = doc[field];
          const populated = val !== undefined && val !== null && val !== '' &&
            !(Array.isArray(val) && val.length === 0);
          console.log(`    ${populated ? '  ✅' : '  ❌'} ${field}: ${populated ? 'populated' : 'EMPTY'}`);
        }
      }
    }
  }
}

async function auditCollections() {
  console.log('\n=== COLLECTIONS ===\n');

  const collections = [
    {
      type: 'project',
      fields: ['title', 'slug', 'summary', 'category', 'featured', 'technologies', 'image', 'liveUrl', 'repositoryUrl', 'status', 'tier', 'showcaseDetail', 'shortDescription', 'highlights', 'githubRepo'],
    },
    {
      type: 'experience',
      fields: ['role', 'company', 'location', 'startDate', 'endDate', 'employmentType', 'workModel', 'summary', 'highlights', 'tags', 'status'],
    },
    {
      type: 'certification',
      fields: ['title', 'issuer', 'issuedAt', 'expiresAt', 'neverExpires', 'credentialUrl', 'category', 'tags', 'image'],
    },
    {
      type: 'galleryImage',
      fields: ['title', 'mediaType', 'category', 'capturedAt', 'alt', 'tags', 'image'],
    },
    {
      type: 'recommendation',
      fields: ['quote', 'featured', 'name', 'title', 'relationship', 'company', 'avatar'],
    },
    {
      type: 'membership',
      fields: ['name', 'url', 'joinedAt'],
    },
    {
      type: 'post',
      fields: ['title', 'slug', 'excerpt', 'featured', 'body', 'author', 'categories', 'tags', 'publishedAt', 'published'],
    },
    { type: 'author', fields: ['name', 'slug', 'image', 'bio'] },
    { type: 'category', fields: ['title', 'slug', 'description'] },
    { type: 'certificationCategory', fields: ['title', 'slug'] },
    { type: 'certificationIssuer', fields: ['title', 'slug'] },
    { type: 'galleryCategory', fields: ['title', 'slug'] },
  ];

  for (const c of collections) {
    const count = await queryCount(c.type);
    const icon = count > 0 ? '✅' : '⚠️ EMPTY';
    console.log(`${icon} ${c.type}: ${count} documents`);

    if (count > 0 && VERBOSE) {
      const docs = await queryDocuments(c.type, c.fields);
      const fieldPop = {};
      for (const field of c.fields) {
        const populated = docs.filter(d => {
          const val = d[field];
          return val !== undefined && val !== null && val !== '' &&
            !(Array.isArray(val) && val.length === 0);
        }).length;
        fieldPop[field] = `${populated}/${count}`;
      }
      for (const [field, pop] of Object.entries(fieldPop)) {
        const pct = Math.round((parseInt(pop) / count) * 100);
        const icon = pct === 100 ? '  ✅' : pct > 50 ? '  ⚠️' : '  ❌';
        console.log(`    ${icon} ${field}: ${pop} (${pct}%)`);
      }
    }
  }
}

async function auditDuplicates() {
  console.log('\n=== DUPLICATE CHECK ===\n');

  try {
    const projects = await sanityQuery(
      `*[_type == "project"]{ _id, title, slug, githubRepo }`,
      TOKEN, PROJECT_ID, DATASET
    );

    if (!projects || projects.length === 0) {
      console.log('No projects to check.');
      return;
    }

    // Group by normalized slug
    const slugMap = {};
    for (const p of projects) {
      const slug = (p.slug?.current || '').trim().toLowerCase();
      if (!slug) continue;
      if (!slugMap[slug]) slugMap[slug] = [];
      slugMap[slug].push(p);
    }

    let dupes = 0;
    for (const [slug, docs] of Object.entries(slugMap)) {
      if (docs.length > 1) {
        dupes++;
        console.log(`  ⚠️ DUPLICATE slug "${slug}":`);
        for (const d of docs) {
          console.log(`    - ${d._id}: "${d.title}" (githubRepo: ${d.githubRepo || 'none'})`);
        }
      }
    }

    if (dupes === 0) {
      console.log('  ✅ No duplicate slugs found');
    } else {
      console.log(`\n  Found ${dupes} duplicate slug group(s)`);
    }
  } catch (e) {
    console.error(`  Error: ${e.message}`);
  }
}

async function auditReferences() {
  console.log('\n=== REFERENCE INTEGRITY ===\n');

  try {
    // Check certifications referencing issuers and categories
    const certs = await sanityQuery(
      `*[_type == "certification"]{ _id, title, issuer->_id, category->_id }`,
      TOKEN, PROJECT_ID, DATASET
    );

    if (certs) {
      let brokenRefs = 0;
      for (const c of certs) {
        if (!c.issuer) {
          console.log(`  ❌ "${c.title}" has no issuer`);
          brokenRefs++;
        }
        if (!c.category) {
          console.log(`  ⚠️ "${c.title}" has no category`);
          brokenRefs++;
        }
      }
      if (brokenRefs === 0) console.log('  ✅ All certification references valid');
    }

    // Check posts referencing authors
    const posts = await sanityQuery(
      `*[_type == "post"]{ _id, title, author->_id, categories[]->_id }`,
      TOKEN, PROJECT_ID, DATASET
    );

    if (posts) {
      let brokenRefs = 0;
      for (const p of posts) {
        if (!p.author) {
          console.log(`  ❌ "${p.title}" has no author`);
          brokenRefs++;
        }
      }
      if (brokenRefs === 0) console.log('  ✅ All post references valid');
    }

    // Check gallery images referencing categories
    const gallery = await sanityQuery(
      `*[_type == "galleryImage"]{ _id, title, category->_id }`,
      TOKEN, PROJECT_ID, DATASET
    );

    if (gallery) {
      let orphaned = 0;
      for (const g of gallery) {
        if (!g.category) {
          console.log(`  ⚠️ "${g.title}" has no category`);
          orphaned++;
        }
      }
      if (orphaned === 0) console.log('  ✅ All gallery images have categories');
    }
  } catch (e) {
    console.error(`  Error: ${e.message}`);
  }
}

async function auditHeroVsProfile() {
  console.log('\n=== HERO vs PROFILE OVERLAP ===\n');

  try {
    const hero = await sanityQuery(
      `*[_type == "heroSection"][0]{ fullName, title, contactEmail, location, availabilityLabel, resumeUrl, heroRoles, socialLinks, profileImage }`,
      TOKEN, PROJECT_ID, DATASET
    );

    const profile = await sanityQuery(
      `*[_type == "profile"][0]{ fullName, title, email, location, availabilityLabel, resumeUrl, avatar, highlights, education }`,
      TOKEN, PROJECT_ID, DATASET
    );

    if (!hero && !profile) {
      console.log('  Neither heroSection nor profile found!');
      return;
    }

    if (hero && !profile) {
      console.log('  ⚠️ heroSection exists but profile is MISSING');
      console.log('  -> Migration will create profile from heroSection data');
      return;
    }

    if (!hero && profile) {
      console.log('  ✅ Only profile exists (heroSection not found)');
      return;
    }

    // Both exist - check overlap
    const overlaps = [
      { field: 'fullName', hero: hero?.fullName, profile: profile?.fullName },
      { field: 'title', hero: hero?.title, profile: profile?.title },
      { field: 'location', hero: hero?.location, profile: profile?.location },
      { field: 'availabilityLabel', hero: hero?.availabilityLabel, profile: profile?.availabilityLabel },
      { field: 'resumeUrl', hero: hero?.resumeUrl, profile: profile?.resumeUrl },
    ];

    console.log('  Both singletons exist. Field comparison:');
    for (const o of overlaps) {
      const heroEmpty = !o.hero;
      const profileEmpty = !o.profile;
      const same = o.hero === o.profile;
      if (same) {
        console.log(`    ✅ ${o.field}: same value`);
      } else if (heroEmpty && profileEmpty) {
        console.log(`    ⚠️ ${o.field}: both empty`);
      } else if (heroEmpty) {
        console.log(`    📋 ${o.field}: only in profile`);
      } else if (profileEmpty) {
        console.log(`    📋 ${o.field}: only in heroSection -> will migrate`);
      } else {
        console.log(`    ⚠️ ${o.field}: DIFFERENT (hero="${o.hero}", profile="${o.profile}") -> profile wins`);
      }
    }

    // Check hero-only fields
    console.log('\n  heroSection-only fields (will migrate to profile):');
    console.log(`    heroRoles: ${hero?.heroRoles?.length ? `${hero.heroRoles.length} items` : 'empty'}`);
    console.log(`    socialLinks: ${hero?.socialLinks?.length ? `${hero.socialLinks.length} items` : 'empty'}`);
    console.log(`    profileImage: ${hero?.profileImage ? 'present' : 'empty'}`);

  } catch (e) {
    console.error(`  Error: ${e.message}`);
  }
}

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   SANITY DATA AUDIT                  ║');
  console.log(`║   Project: ${PROJECT_ID}              ║`);
  console.log(`║   Dataset: ${DATASET}                 ║`);
  console.log('╚══════════════════════════════════════╝');

  await auditSingletons();
  await auditCollections();
  await auditDuplicates();
  await auditReferences();
  await auditHeroVsProfile();

  console.log('\n=== AUDIT COMPLETE ===\n');
}

main().catch(console.error);
