/**
 * Migration: cleanup-duplicates
 *
 * Removes duplicate projects by normalized slug.
 * Keeps the document with more fields populated.
 */

export const cleanupDuplicates = {
  name: 'cleanup-duplicates',
  description: 'Remove duplicate projects by normalized slug',

  async validate(query) {
    const projects = await query('*[_type == "project"]{ _id, title, slug }');
    if (!projects || projects.length === 0) {
      console.log('  ✅ No projects to check');
      return true;
    }

    const slugMap = {};
    for (const p of projects) {
      const slug = (p.slug?.current || '').trim().toLowerCase();
      if (!slug) continue;
      if (!slugMap[slug]) slugMap[slug] = [];
      slugMap[slug].push(p);
    }

    const dupes = Object.entries(slugMap).filter(([, docs]) => docs.length > 1);
    if (dupes.length === 0) {
      console.log('  ✅ No duplicate slugs found');
      return true;
    }

    console.log(`  ⚠️ Found ${dupes.length} duplicate slug group(s):`);
    for (const [slug, docs] of dupes) {
      console.log(`    "${slug}": ${docs.map(d => d._id).join(', ')}`);
    }
    return false;
  },

  async up(query, mutate, dryRun) {
    const projects = await query('*[_type == "project"]{ _id, title, slug, summary, technologies, image, liveUrl, repositoryUrl, status, tier, showcaseDetail, shortDescription, highlights, githubRepo, category, featured, year, role, achievements, challenge, solution, result, order }');

    if (!projects || projects.length === 0) {
      return { success: true, documentsAffected: 0, changes: [] };
    }

    // Group by normalized slug
    const slugMap = {};
    for (const p of projects) {
      const slug = (p.slug?.current || '').trim().toLowerCase();
      if (!slug) continue;
      if (!slugMap[slug]) slugMap[slug] = [];
      slugMap[slug].push(p);
    }

    const changes = [];
    let affected = 0;

    for (const [slug, docs] of Object.entries(slugMap)) {
      if (docs.length <= 1) continue;

      // Keep the one with most fields populated
      const scored = docs.map(d => ({
        doc: d,
        score: Object.values(d).filter(v => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)).length,
      }));
      scored.sort((a, b) => b.score - a.score);

      const keep = scored[0].doc;
      const remove = scored.slice(1).map(s => s.doc);

      for (const r of remove) {
        changes.push({ field: r._id, action: dryRun ? 'would-delete' : 'delete' });
        if (!dryRun) {
          await mutate([{ delete: { id: r._id } }]);
          affected++;
        }
      }

      // Normalize the kept document's slug
      if (!dryRun && keep.slug?.current !== slug) {
        await mutate([{ patch: { id: keep._id, set: { 'slug.current': slug } } }]);
        changes.push({ field: 'slug', action: 'normalize', value: slug });
      }
    }

    return { success: true, documentsAffected: affected, changes };
  },

  async down() {
    return { success: true, documentsAffected: 0, changes: [{ field: 'rollback', action: 'skip', reason: 'deleted documents cannot be restored' }] };
  },
};
