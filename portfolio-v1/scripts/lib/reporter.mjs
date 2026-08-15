/**
 * Reporter
 *
 * Generates import summary reports and diff summaries.
 */

/**
 * Create an empty results tracker
 * @returns {Object} Results tracker
 */
export function createResults() {
  return {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    details: [],
  };
}

/**
 * Log a successful import
 * @param {Object} results - Results tracker
 * @param {string} repoName - Repository name
 * @param {string} title - Project title
 * @param {string} tier - Project tier
 * @param {boolean} isDryRun - Whether this is a dry run
 */
export function logSuccess(results, repoName, title, tier, isDryRun) {
  results.created++;
  results.details.push({
    repo: repoName,
    title,
    tier,
    status: isDryRun ? 'would_create' : 'created',
  });
}

/**
 * Log a skipped import
 * @param {Object} results - Results tracker
 * @param {string} repoName - Repository name
 * @param {string} reason - Skip reason
 */
export function logSkip(results, repoName, reason) {
  results.skipped++;
  results.details.push({
    repo: repoName,
    status: 'skipped',
    reason,
  });
}

/**
 * Log an import error
 * @param {Object} results - Results tracker
 * @param {string} repoName - Repository name
 * @param {string} error - Error message
 */
export function logError(results, repoName, error) {
  results.errors++;
  results.details.push({
    repo: repoName,
    status: 'error',
    error,
  });
}

/**
 * Print the import summary report
 * @param {Object} results - Results tracker
 * @param {boolean} isDryRun - Whether this is a dry run
 */
export function printReport(results, isDryRun) {
  console.log('\n' + '='.repeat(60));
  console.log(`  IMPORT REPORT ${isDryRun ? '(DRY RUN)' : ''}`);
  console.log('='.repeat(60));

  console.log(`\n  Summary:`);
    console.log(`    Created/Updated: ${results.created}`);
    console.log(`    Skipped:         ${results.skipped}`);
    console.log(`    Errors:          ${results.errors}`);

  if (results.details.length > 0) {
    console.log(`\n  Details:`);
    for (const detail of results.details) {
      const icon = detail.status === 'created' ? '✓' :
                   detail.status === 'would_create' ? '~' :
                   detail.status === 'skipped' ? 'skip' : '✗';
      console.log(`    ${icon} ${detail.repo} (${detail.tier || 'unknown'})`);
      if (detail.error) {
        console.log(`      Error: ${detail.error}`);
      }
      if (detail.reason) {
        console.log(`      Reason: ${detail.reason}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
}

/**
 * Generate a JSON report for programmatic consumption
 * @param {Object} results - Results tracker
 * @param {Object} metadata - Import metadata
 * @returns {Object} JSON-serializable report
 */
export function generateJsonReport(results, metadata) {
  return {
    timestamp: new Date().toISOString(),
    mode: metadata.isDryRun ? 'dry-run' : 'live',
    sanityProject: metadata.projectId,
    sanityDataset: metadata.dataset,
    githubOwner: metadata.githubOwner,
    curatedCount: metadata.curatedCount,
    summary: {
      created: results.created,
      skipped: results.skipped,
      errors: results.errors,
    },
    details: results.details,
  };
}
