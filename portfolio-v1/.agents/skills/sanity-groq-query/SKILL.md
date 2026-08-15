---
name: sanity-groq-query
description: Write, debug, and optimize GROQ queries for Sanity CMS in this portfolio
---

# Sanity GROQ Query Skill

Write, debug, and optimize GROQ queries for Sanity CMS with the v2026-02-19 parser.

## When to use this skill

- Writing new GROQ queries for Sanity data fetching
- Debugging GROQ parse errors
- Optimizing query performance
- Adding new document types or fields

## Sanity project details

- **Project ID:** `4bg9jxr4`
- **Dataset:** `production`
- **API Version:** `2026-02-19`
- **API Host:** `apicdn.sanity.io`

## Critical: GROQ v2026-02-19 parser quirks

The 2026-02-19 parser is stricter than older versions:

### Field ordering matters
```groq
// WRONG — parser sees galleryItems as part of the outer object
*[_type == "project" && slug.current == $slug][0]{
  title,
  slug,
  galleryItems{
    images[]{ url, alt }
  },
  technologies // parser error here
}

// CORRECT — nested projections must come AFTER all top-level fields
*[_type == "project" && slug.current == $slug][0]{
  title,
  slug,
  technologies,
  tier,
  showcaseDetail,
  galleryItems{
    images[]{ url, alt }
  }
}
```

### Use quoted field names for aliases
```groq
// WRONG — unquoted aliases cause parse errors
*[_type == "project"]{
  title,
  projectTitle: title // error
}

// CORRECT — use quoted names for aliases
*[_type == "project"]{
  title,
  "projectTitle": title
}
```

### Array projections need careful nesting
```groq
// WRONG
*[_type == "project"]{
  title,
  galleryItems[]{
    images[]{ url, alt, caption }
  }
}

// CORRECT
*[_type == "project"]{
  title,
  galleryItems[] {
    images[] { url, alt, caption }
  }
}
```

## Query patterns

### Fetch all projects (summary)
```groq
*[_type == "project"] | order(orderRank asc) {
  title,
  slug,
  description,
  tier,
  technologies,
  orderRank
}
```

### Fetch single project by slug
```groq
*[_type == "project" && slug.current == $slug][0] {
  title,
  slug,
  description,
  tier,
  projectUrl,
  repoUrl,
  orderRank,
  featured,
  technologies,
  features,
  challenges,
  learnings,
  metrics,
  showcaseDetail {
    challenge,
    solution,
    result,
    architecture,
    highlights
  },
  galleryItems[] {
    images[] { url, alt, caption, type }
  },
  _updatedAt
}
```

### Fetch hero section
```groq
*[_type == "heroSection"][0] {
  name,
  title,
  roleRotator,
  contactEmail
}
```

### Fetch blog posts
```groq
*[_type == "blogPost"] | order(publishedAt desc) {
  title,
  slug,
  publishedAt,
  excerpt,
  tags,
  readingTime,
  featured
}
```

### Fetch certifications
```groq
*[_type == "certification"] | order(issuedDate desc) {
  name,
  issuer,
  issuedDate,
  expirationDate,
  credentialId,
  credentialUrl,
  logo {
    asset->{url}
  }
}
```

### Fetch experience
```groq
*[_type == "experience"] | order(startDate desc) {
  company,
  position,
  location,
  startDate,
  endDate,
  current,
  description,
  highlights,
  technologies
}
```

### Fetch skills
```groq
*[_type == "skill"] | order(category asc, name asc) {
  name,
  category,
  level,
  yearsOfExperience
}
```

## Common errors

### "Parse error: expected `}`"
- Usually a missing comma between fields
- Check nested projections for missing closing braces

### "Parse error: unexpected token"
- Unquoted alias names
- Missing commas between fields
- Gallery/nested projection before top-level fields

### "Cannot query"
- Wrong dataset name
- Missing `*` at the start of query
- Wrong `_type` name

## Debugging workflow

1. Test query in Sanity Vision (Sanity Studio)
2. Use `console.log` to see raw query string
3. Check for comma placement
4. Verify field names match schema
5. Ensure nested projections come last

## Checklist

- [ ] Query works in Sanity Vision
- [ ] No parse errors with v2026-02-19
- [ ] Nested projections come after top-level fields
- [ ] Aliases use quoted names
- [ ] Slug input is sanitized (no GROQ injection)
