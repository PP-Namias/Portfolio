/**
 * Sanity API Client
 *
 * Handles document upserts, queries, and mutations
 * against the Sanity Content Lake.
 */

const SANITY_API_VERSION = '2024-01-01';

/**
 * Create or update a project document (idempotent upsert)
 * @param {Object} doc - Sanity document object
 * @param {string} token - Sanity API token
 * @param {string} projectId - Sanity project ID
 * @param {string} dataset - Sanity dataset name
 * @returns {Promise<Object>} Mutation result
 */
export async function upsertProject(doc, token, projectId, dataset) {
  const url = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${dataset}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutations: [{ createIfNotExists: doc }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sanity mutation error: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Batch upsert multiple project documents
 * @param {Array<Object>} docs - Array of Sanity document objects
 * @param {string} token - Sanity API token
 * @param {string} projectId - Sanity project ID
 * @param {string} dataset - Sanity dataset name
 * @returns {Promise<Object>} Batch mutation result
 */
export async function batchUpsertProjects(docs, token, projectId, dataset) {
  const url = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${dataset}`;
  
  const mutations = docs.map(doc => ({ createIfNotExists: doc }));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sanity batch mutation error: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Execute a GROQ query
 * @param {string} query - GROQ query string
 * @param {string} token - Sanity API token
 * @param {string} projectId - Sanity project ID
 * @param {string} dataset - Sanity dataset name
 * @returns {Promise<any>} Query results
 */
export async function sanityQuery(query, token, projectId, dataset) {
  const url = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}/data/query/${dataset}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sanity query error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result.result;
}

/**
 * Fetch all existing project IDs from Sanity
 * @param {string} token - Sanity API token
 * @param {string} projectId - Sanity project ID
 * @param {string} dataset - Sanity dataset name
 * @returns {Promise<Array>} Array of project IDs and metadata
 */
export async function fetchExistingProjects(token, projectId, dataset) {
  const query = `*[_type == "project"]{ _id, title, githubRepo, tier, slug }`;
  return sanityQuery(query, token, projectId, dataset);
}

/**
 * Validate Sanity connection and permissions
 * @param {string} token - Sanity API token
 * @param {string} projectId - Sanity project ID
 * @param {string} dataset - Sanity dataset name
 * @returns {Promise<boolean>} True if connection is valid
 */
export async function validateConnection(token, projectId, dataset) {
  try {
    await sanityQuery(`count(*[_type == "project"])`, token, projectId, dataset);
    return true;
  } catch {
    return false;
  }
}
