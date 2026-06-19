/**
 * Data Transform
 *
 * Maps GitHub repository data and curated overrides
 * to Sanity document fields.
 */

/**
 * Build a Sanity document from GitHub repo data and curated overrides
 * @param {Object} repo - GitHub repository object
 * @param {Object} curated - Curated project override
 * @param {Object} [languages] - Language breakdown from GitHub API
 * @returns {Object} Sanity document ready for upsert
 */
export function buildSanityDocument(repo, curated, languages) {
  const repoLanguages = languages ? Object.keys(languages) : [];
  const topics = repo.topics || [];
  const curatedTech = curated.technologies || [];
  const allTags = [...new Set([...repoLanguages, ...topics, ...curatedTech])];

  return {
    _type: 'project',
    _id: `github-${repo.name}`,

    // Identity
    title: curated.title || repo.name,
    slug: { current: generateSlug(curated.title || repo.name) },
    githubRepo: repo.name,

    // Content
    summary: padSummary(curated.shortDescription || repo.description || ''),
    shortDescription: (curated.shortDescription || repo.description || '').slice(0, 120),
    challenge: curated.challenge || null,
    solution: curated.solution || null,
    result: curated.result || null,

    // Classification
    year: new Date(repo.created_at).getFullYear(),
    category: curated.category || inferCategory(repo),
    role: curated.role || 'Developer',
    tier: curated.tier || 'standard',
    featured: curated.tier === 'featured',
    status: 'completed',

    // Display
    technologies: allTags.filter(Boolean).slice(0, 8),
    highlights: curated.highlights || [],
    achievements: curated.highlights || [],

    // Links
    liveUrl: curated.liveURL || repo.homepage || null,
    repositoryUrl: repo.html_url,

    // Ordering
    order: curated.order || getOrderFromTier(curated.tier),
    featuredRank: curated.featuredRank || getFeaturedRank(curated.tier, curated.order),

    // Feature flags
    showcaseDetail: curated.showcaseDetail || false,

    // Images (set manually post-import)
    image: null,
    gallery: [],
  };
}

/**
 * Generate a URL-safe slug from a title
 * @param {string} title - Project title
 * @returns {string} URL-safe slug
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Pad summary to meet Sanity validation min length (60 chars)
 * @param {string} text - Summary text
 * @returns {string} Padded summary
 */
export function padSummary(text) {
  if (!text) return '';
  if (text.length >= 60) return text.slice(0, 320);

  // Pad with context about the project
  const padding = ' A software development project.';
  return (text + padding).slice(0, 320);
}

/**
 * Infer category from GitHub repo data
 * @param {Object} repo - GitHub repository object
 * @returns {string} Inferred category
 */
export function inferCategory(repo) {
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const name = (repo.name || '').toLowerCase();

  if (topics.includes('machine-learning') || topics.includes('ai')) return 'AI/ML';
  if (topics.includes('iot') || topics.includes('arduino')) return 'IoT';
  if (name.includes('bot')) return 'Bot';
  if (name.includes('animation') || name.includes('art')) return 'Web Art';
  if (name.includes('game') || name.includes('bird') || name.includes('drift')) return 'Game';
  if (repo.language === 'C++' || repo.language === 'C') return 'Academic';
  if (repo.language === 'Java') return 'Desktop Application';
  return 'Web Application';
}

/**
 * Get default order from tier
 * @param {string} tier - Project tier
 * @returns {number} Order value
 */
function getOrderFromTier(tier) {
  switch (tier) {
    case 'featured': return 1;
    case 'standard': return 14;
    case 'archived': return 28;
    default: return 99;
  }
}

/**
 * Get featured rank from tier and order
 * @param {string} tier - Project tier
 * @param {number} [order] - Project order within tier
 * @returns {number} Featured rank
 */
function getFeaturedRank(tier, order) {
  switch (tier) {
    case 'featured': return order || 1;
    case 'standard': return 14 + (order || 0);
    case 'archived': return 28 + (order || 0);
    default: return 99;
  }
}
