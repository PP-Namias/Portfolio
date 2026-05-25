# Vision Query Pack

Use these queries in Sanity Vision when checking homepage structure, preview parity, and content relationships.

## Homepage shell

```groq
*[_type == "heroSection"][0]{
  title,
  subtitle,
  roles,
  location,
  "socialCount": count(socialLinks)
}
```

```groq
*[_type == "siteSettings"][0]{
  aboutSection,
  experienceSection,
  projectsSection,
  certificationsSection,
  gallerySection,
  contactSection,
  heroActions,
  contactActions,
  footer
}
```

## Resume selection

```groq
*[_type == "resume"] | order(isActive desc, _updatedAt desc){
  _id,
  isActive,
  resumeUrl,
  "fileName": resumeFile.asset->originalFilename,
  "fileUrl": resumeFile.asset->url
}
```

```groq
count(*[_type == "resume" && isActive == true])
```

## Blog parity

```groq
*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  published,
  featured,
  "author": author->name,
  "categories": categories[]->title
}
```

```groq
count(*[_type == "post" && published == true])
```

## Projects and homepage collections

```groq
*[_type == "project"] | order(order asc, featuredRank asc, title asc){
  _id,
  title,
  order,
  featuredRank,
  status,
  "primaryLink": coalesce(detailURL, liveURL, repositoryURL)
}
```

```groq
*[_type == "experience"] | order(order asc, startDate desc){
  _id,
  role,
  company,
  location,
  startDate,
  endDate
}
```

```groq
*[_type == "certification"] | order(order asc, issuedAt desc){
  _id,
  title,
  "issuer": issuer->title,
  "category": category->title,
  issuedAt
}
```

```groq
*[_type == "galleryImage"] | order(order asc, capturedAt desc){
  _id,
  title,
  mediaType,
  "category": category->title,
  capturedAt,
  tags
}
```

## Reference and support data

```groq
{
  "profile": *[_type == "profile"][0]{fullName, title, email, location},
  "membershipCount": count(*[_type == "membership"]),
  "recommendationCount": count(*[_type == "recommendation"]),
  "categoryCount": count(*[_type == "category"])
}
```

## Quick checks

- Confirm exactly one `resume` document is marked active before publishing.
- Compare the `post` count to the intended live blog set before turning on preview.
- Use the project and experience queries to confirm ordering before and after an import run.
- Check `siteSettings` after homepage copy changes to keep the Studio labels aligned with the localhost site.