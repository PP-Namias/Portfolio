/**
 * Migration: merge-hero-profile
 *
 * Merges heroSection singleton into profile singleton.
 * Already executed — this module is kept for reference and rollback.
 */

export const mergeHeroProfile = {
  name: 'merge-hero-profile',
  description: 'Merge heroSection singleton into profile (already executed)',

  async validate(query) {
    const hero = await query('*[_type == "heroSection"][0]._id');
    const profile = await query('*[_type == "profile"][0]._id');
    if (hero) {
      console.log('  ⚠️ heroSection still exists — migration may be needed');
      return false;
    }
    if (!profile) {
      console.log('  ❌ profile not found');
      return false;
    }
    console.log('  ✅ heroSection removed, profile exists');
    return true;
  },

  async up(query, mutate, dryRun) {
    const hero = await query('*[_type == "heroSection"][0]{_id, heroRoles, socialLinks, profileImage, availabilityLabel, resumeUrl, contactEmail}');
    const profile = await query('*[_type == "profile"][0]{_id, heroRoles, socialLinks, profileImage, availabilityLabel, resumeUrl, email}');

    const changes = [];
    if (!hero) {
      return { success: true, documentsAffected: 0, changes: [{ field: 'heroSection', action: 'skip', reason: 'not found' }] };
    }
    if (!profile) {
      return { success: false, documentsAffected: 0, changes: [{ field: 'profile', action: 'skip', reason: 'not found' }] };
    }

    const update = {};
    const fieldMap = [
      { hero: 'heroRoles', profile: 'heroRoles', label: 'Hero roles' },
      { hero: 'socialLinks', profile: 'socialLinks', label: 'Social links' },
      { hero: 'profileImage', profile: 'profileImage', label: 'Profile image' },
      { hero: 'availabilityLabel', profile: 'availabilityLabel', label: 'Availability label' },
      { hero: 'resumeUrl', profile: 'resumeUrl', label: 'Resume URL' },
      { hero: 'contactEmail', profile: 'email', label: 'Email' },
    ];

    for (const f of fieldMap) {
      const heroVal = hero[f.hero];
      const profileVal = profile[f.profile];
      if (heroVal && !profileVal) {
        update[f.profile] = heroVal;
        changes.push({ field: f.label, action: 'copy' });
      } else {
        changes.push({ field: f.label, action: 'skip' });
      }
    }

    if (Object.keys(update).length === 0) {
      return { success: true, documentsAffected: 0, changes };
    }

    if (dryRun) return { success: true, documentsAffected: 0, changes };

    await mutate([{ patch: { id: profile._id, set: update } }]);
    await mutate([{ delete: { id: hero._id } }]);

    return { success: true, documentsAffected: 2, changes };
  },

  async down(query, mutate) {
    const profile = await query('*[_type == "profile"][0]{_id, heroRoles, socialLinks, profileImage, availabilityLabel, resumeUrl, email}');
    if (!profile) return { success: true, documentsAffected: 0, changes: [] };

    const heroData = {
      _type: 'heroSection',
      _id: 'heroSection',
      fullName: profile.fullName || 'Namias',
      title: profile.title || 'Software Engineer',
      heroRoles: profile.heroRoles || [],
      availabilityLabel: profile.availabilityLabel || 'Available',
      contactEmail: profile.email || '',
      resumeUrl: profile.resumeUrl || '',
      profileImage: profile.profileImage,
      socialLinks: profile.socialLinks || [],
    };

    await mutate([{ createOrReplace: heroData }]);
    return { success: true, documentsAffected: 1, changes: [{ field: 'heroSection', action: 'restored' }] };
  },
};
