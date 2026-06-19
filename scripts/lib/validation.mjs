/**
 * Validation
 *
 * Pre-import validation for Sanity documents.
 * Ensures all fields meet schema constraints before upsert.
 */

/**
 * Validate a Sanity document before import
 * @param {Object} doc - Sanity document object
 * @param {Object} repo - GitHub repository object
 * @returns {Object} { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateDocument(doc, repo) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!doc.title) errors.push('Missing title');
  if (!doc.slug?.current) errors.push('Missing slug');
  if (!doc.summary) errors.push('Missing summary');
  if (!doc.repositoryUrl) warnings.push('Missing repositoryUrl');

  // Summary length validation (60-320 chars)
  if (doc.summary) {
    if (doc.summary.length < 60) {
      warnings.push(`Summary too short (${doc.summary.length}/60 min)`);
    }
    if (doc.summary.length > 320) {
      errors.push(`Summary too long (${doc.summary.length}/320 max)`);
    }
  }

  // Slug validation (URL-safe)
  if (doc.slug?.current && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(doc.slug.current)) {
    errors.push(`Invalid slug format: ${doc.slug.current}`);
  }

  // URL validation
  if (doc.liveUrl && !doc.liveUrl.startsWith('https://') && !doc.liveUrl.startsWith('http://')) {
    errors.push(`Invalid liveUrl format: ${doc.liveUrl}`);
  }

  // Tier validation
  if (!['featured', 'standard', 'archived'].includes(doc.tier)) {
    errors.push(`Invalid tier: ${doc.tier}`);
  }

  // shortDescription length
  if (doc.shortDescription && doc.shortDescription.length > 120) {
    warnings.push(`shortDescription over 120 chars (${doc.shortDescription.length})`);
  }

  // Technologies array validation
  if (doc.technologies && doc.technologies.length > 8) {
    warnings.push(`Technologies array over 8 items (${doc.technologies.length})`);
  }

  // highlights array validation
  if (doc.highlights && doc.highlights.length > 6) {
    warnings.push(`Highlights array over 6 items (${doc.highlights.length})`);
  }

  // Showcase project validation
  if (doc.showcaseDetail) {
    if (!doc.challenge) warnings.push('Showcase project missing challenge');
    if (!doc.solution) warnings.push('Showcase project missing solution');
    if (!doc.result) warnings.push('Showcase project missing result');
  }

  // GitHub repo name validation
  if (!doc.githubRepo) {
    warnings.push('Missing githubRepo field');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a batch of documents
 * @param {Array} documents - Array of { doc, repo } objects
 * @returns {Object} Batch validation results
 */
export function validateBatch(documents) {
  const results = {
    valid: 0,
    invalid: 0,
    warnings: 0,
    errors: [],
  };

  for (const { doc, repo } of documents) {
    const validation = validateDocument(doc, repo);
    if (validation.valid) {
      results.valid++;
    } else {
      results.invalid++;
      results.errors.push({
        repo: repo.name,
        errors: validation.errors,
      });
    }
    results.warnings += validation.warnings.length;
  }

  return results;
}
