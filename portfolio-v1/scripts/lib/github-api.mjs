/**
 * GitHub API Client
 *
 * Fetches repository data, languages, topics, and README content
 * from the GitHub REST API with rate limit handling.
 */

const GITHUB_API = 'https://api.github.com';
const GITHUB_OWNER = 'PP-Namias';

/**
 * Fetch a repository from GitHub
 * @param {string} repoName - Repository name
 * @param {string} [token] - GitHub personal access token
 * @returns {Promise<Object>} Repository data
 */
export async function fetchRepo(repoName, token) {
  return fetchGitHub(`/repos/${GITHUB_OWNER}/${repoName}`, token);
}

/**
 * Fetch repository languages
 * @param {string} repoName - Repository name
 * @param {string} [token] - GitHub personal access token
 * @returns {Promise<Object>} Language breakdown { language: bytes }
 */
export async function fetchRepoLanguages(repoName, token) {
  return fetchGitHub(`/repos/${GITHUB_OWNER}/${repoName}/languages`, token);
}

/**
 * Fetch repository topics
 * @param {string} repoName - Repository name
 * @param {string} [token] - GitHub personal access token
 * @returns {Promise<Object>} Topics object { names: string[] }
 */
export async function fetchRepoTopics(repoName, token) {
  return fetchGitHub(`/repos/${GITHUB_OWNER}/${repoName}/topics`, token);
}

/**
 * Fetch repository README content
 * @param {string} repoName - Repository name
 * @param {string} [token] - GitHub personal access token
 * @returns {Promise<string|null>} README content or null
 */
export async function fetchRepoReadme(repoName, token) {
  try {
    const data = await fetchGitHub(`/repos/${GITHUB_OWNER}/${repoName}/readme`, token);
    if (data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch all public repos for a user
 * @param {string} [token] - GitHub personal access token
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchAllRepos(token) {
  const repos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const data = await fetchGitHub(`/users/${GITHUB_OWNER}/repos?per_page=${perPage}&page=${page}&type=public`, token);
    if (!data || data.length === 0) break;
    repos.push(...data);
    if (data.length < perPage) break;
    page++;
  }

  return repos;
}

/**
 * Get rate limit status
 * @param {string} [token] - GitHub personal access token
 * @returns {Promise<Object>} Rate limit info
 */
export async function getRateLimit(token) {
  return fetchGitHub('/rate_limit', token);
}

/**
 * Internal fetch helper with error handling
 */
async function fetchGitHub(path, token) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'namias-portfolio-importer',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API}${path}`, { headers });

  if (response.status === 403) {
    const resetTime = response.headers.get('x-ratelimit-reset');
    const resetDate = resetTime ? new Date(Number(resetTime) * 1000) : null;
    throw new Error(
      `GitHub rate limit exceeded. Resets at ${resetDate?.toISOString() || 'unknown'}. ` +
      'Use --github-token to increase limit to 5000 req/hr.'
    );
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText} for ${path}`);
  }

  return response.json();
}
