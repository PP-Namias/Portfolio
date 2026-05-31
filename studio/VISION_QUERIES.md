# Vision Query Pack

Use these queries in Sanity Vision when checking homepage structure, preview parity, and content relationships.

## Recommended inspection order

1. Run the homepage shell queries first to confirm the structure and preview labels.
2. Check the resume selection queries next to confirm the active file and fallback URL.
3. Use the blog and collection queries to verify counts and ordering before and after imports.
4. Finish with the interview demo queries to confirm the content model is ready for presentation.
5. Use the reference and support data query to confirm the homepage inputs stay aligned.

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
*[_type == "project" && featured == true] | order(order asc, featuredRank asc, title asc){
  _id,
  title,
  order,
  featuredRank,
  status
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
*[_type == "experience" && defined(featuredStory)] | order(order asc, startDate desc){
  _id,
  role,
  company,
  status,
  "storyLength": length(featuredStory)
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
*[_type == "certification" && defined(credentialUrl)] | order(order asc, issuedAt desc){
  _id,
  title,
  "issuer": issuer->title,
  "category": category->title,
  issuedAt,
  credentialUrl
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

```groq
*[_type == "galleryImage" && defined(image.asset)] | order(order asc, capturedAt desc){
  _id,
  title,
  mediaType,
  "category": category->title,
  capturedAt
}
```

## Interview demo

```groq
{
  "homepageCount": count(*[_type in ["heroSection", "aboutSection", "profile", "techStack", "siteSettings", "resume"]]),
  "blogCount": count(*[_type == "post" && defined(slug.current)]),
  "projectCount": count(*[_type == "project"]),
  "experienceCount": count(*[_type == "experience"]),
  "certificationCount": count(*[_type == "certification"]),
  "galleryCount": count(*[_type == "galleryImage"])
}
```

```groq
{
  "previewTargets": *[_type in ["heroSection", "aboutSection", "siteSettings", "post"]][]{
    _type,
    _id,
    "label": coalesce(title, fullName, siteTitle)
  }
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
