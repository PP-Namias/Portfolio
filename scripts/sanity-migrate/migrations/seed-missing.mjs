/**
 * Migration: seed-missing
 *
 * Ensures all required singletons exist with sensible defaults.
 */

export const seedMissing = {
  name: 'seed-missing',
  description: 'Seed missing singletons with default values',

  async validate(query) {
    const types = ['profile', 'aboutSection', 'siteSettings', 'techStack'];
    const results = {};
    for (const type of types) {
      const doc = await query(`*[_type == "${type}"][0]._id`);
      results[type] = !!doc;
    }

    const missing = types.filter(t => !results[t]);
    if (missing.length === 0) {
      console.log('  ✅ All required singletons exist');
      return true;
    }

    console.log(`  ⚠️ Missing: ${missing.join(', ')}`);
    return false;
  },

  async up(query, mutate, dryRun) {
    const defaults = {
      profile: {
        _type: 'profile',
        _id: 'profile',
        fullName: 'Namias',
        title: 'Software Engineer',
        email: 'contact@namias.tech',
        availabilityLabel: 'Available',
        heroRoles: ['Full Stack Engineer', 'AI Automation Specialist'],
      },
      aboutSection: {
        _type: 'aboutSection',
        _id: 'aboutSectionSingleton',
        aboutContent: [],
        education: {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of Caloocan City',
          location: 'Caloocan City, Metro Manila',
          period: '2022 – 2026',
          highlights: ['Cum Laude', "Dean's Lister"],
        },
      },
      siteSettings: {
        _type: 'siteSettings',
        _id: 'siteSettings',
        siteName: 'Namias Portfolio',
        contactEmail: 'contact@namias.tech',
      },
      techStack: {
        _type: 'techStack',
        _id: 'techStackSingleton',
        title: 'Tech Stack',
        technologies: [],
      },
    };

    const changes = [];
    let affected = 0;

    for (const [type, defaultDoc] of Object.entries(defaults)) {
      const existing = await query(`*[_type == "${type}"][0]._id`);
      if (existing) {
        changes.push({ field: type, action: 'skip', reason: 'exists' });
        continue;
      }

      changes.push({ field: type, action: dryRun ? 'would-create' : 'create' });
      if (!dryRun) {
        await mutate([{ create: defaultDoc }]);
        affected++;
      }
    }

    return { success: true, documentsAffected: affected, changes };
  },

  async down() {
    return { success: true, documentsAffected: 0, changes: [{ field: 'rollback', action: 'skip', reason: 'seeded documents should not be auto-deleted' }] };
  },
};
