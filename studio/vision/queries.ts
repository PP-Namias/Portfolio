/**
 * Curated GROQ queries for the studio.
 *
 * These are the queries the team runs most often. Each one is
 * documented in studio/skills/use-vision-tool-saved-queries.md
 * and add-a-saved-vision-query.md.
 *
 * To use: copy a query into Vision's editor and run (Cmd/Ctrl + Enter).
 * The Vision tool reads from local storage for user-saved queries;
 * this file is the team-curated baseline.
 */

export type VisionQuery = {
  title: string
  description: string
  query: string
}

export const visionQueries: Record<string, VisionQuery> = {
  siteHealth: {
    title: 'Site health',
    description: 'Count of every document type + last edited.',
    query: /* groq */ `
*[_type in [
  "project", "post", "certification", "experience",
  "membership", "recommendation", "galleryImage"
]] | order(_updatedAt desc) {
  _type,
  "updatedAt": _updatedAt,
  "id": _id,
  "slug": slug.current,
  "title": coalesce(title, name)
}
    `.trim(),
  },
  staleContent: {
    title: 'Stale content',
    description: 'Documents not updated in 30+ days.',
    query: /* groq */ `
*[_type in ["post", "project", "certification", "experience"]
  && _updatedAt < now() - 60*60*24*30] | order(_updatedAt asc) {
  _id, _type, title, _updatedAt
}
    `.trim(),
  },
  brokenReferences: {
    title: 'Broken references',
    description: 'References pointing to non-existent documents.',
    query: /* groq */ `
{
  "projects": *[_type == "project" && defined(coverImage)]
    [count(coverImage) > 0 && !defined(*[_id == ^.coverImage._ref][0])],
  "posts":    *[_type == "post" && defined(mainImage)]
    [count(mainImage) > 0 && !defined(*[_id == ^.mainImage._ref][0])],
  "certs":    *[_type == "certification" && defined(issuer)]
    [!defined(*[_id == ^.issuer._ref][0])]
}
    `.trim(),
  },
  expiringCertifications: {
    title: 'Expiring certifications',
    description: 'Certifications expiring within 90 days.',
    query: /* groq */ `
*[_type == "certification"
  && !neverExpires
  && defined(expiresAt)
  && expiresAt < now() + 60*60*24*90] | order(expiresAt asc) {
  _id, title, "issuer": issuer->name, issuedAt, expiresAt
}
    `.trim(),
  },
  featuredCoverage: {
    title: 'Featured coverage',
    description: 'Which projects/posts are marked featured.',
    query: /* groq */ `
{
  "featuredProjects":      *[_type == "project"    && featured] { _id, title, "slug": slug.current },
  "featuredPosts":         *[_type == "post"       && featured] { _id, title, "slug": slug.current },
  "featuredRecommendations": *[_type == "recommendation" && featured] { _id, name, company }
}
    `.trim(),
  },
}

export const visionQueryList: VisionQuery[] = Object.values(visionQueries)
