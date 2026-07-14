# Search Result Thumbnail & Rich Snippet Image - Master Plan

## Overview

This project adds Search Result Thumbnails (images in rich snippets) to improve Click-Through Rate (CTR) in Google search results. When users search for "Keneth Namias" or the portfolio website, Google will display a thumbnail image next to the search result.

## Problem Statement

Currently, search results for "Keneth Namias" or the portfolio website show text-only results without images. This results in lower CTR compared to results that include thumbnails. Search Result Thumbnails catch the user's eye and make the result look more credible.

## Goals

1. Display thumbnail images in Google search results for portfolio-related queries
2. Improve Click-Through Rate (CTR) from search results
3. Ensure images meet Google's recommended dimensions (1200x630px minimum)
4. Maintain consistent branding across search results and social previews
5. Support different images for different content types (person, projects, blog posts)

## Epics

| Epic | Title | Status |
|------|-------|--------|
| EPIC-A | SEO Image Schema & Sanity Fields | Planning |
| EPIC-B | JSON-LD Structured Data | Planning |
| EPIC-C | Meta Tags & Open Graph | Planning |
| EPIC-D | Google Rich Results Testing | Planning |

## Implementation Order

1. **EPIC-A** - Add SEO image fields to Sanity schemas
2. **EPIC-B** - Implement JSON-LD structured data with images
3. **EPIC-C** - Update meta tags and Open Graph
4. **EPIC-D** - Test and validate with Google's Rich Results Test

## Technical Requirements

- JSON-LD structured data must validate with Google's Rich Results Test
- Images must be at least 1200x630 pixels (Google recommendation)
- Images must be accessible via public URL (no auth required)
- og:image and twitter:image meta tags must be present on all pages
- Image alt text must be descriptive for accessibility
- Images should use WebP format with JPEG fallback for compatibility

## Google Requirements

### Person Schema
```json
{
  "@type": "Person",
  "name": "Keneth Namias",
  "url": "https://ppnamias.com",
  "image": {
    "@type": "ImageObject",
    "url": "https://ppnamias.com/images/profile.jpg",
    "width": 1200,
    "height": 630,
    "alt": "Keneth Namias - Full Stack Developer"
  }
}
```

### Article Schema
```json
{
  "@type": "Article",
  "headline": "Blog Post Title",
  "image": {
    "@type": "ImageObject",
    "url": "https://ppnamias.com/images/post.jpg",
    "width": 1200,
    "height": 630,
    "alt": "Blog Post Featured Image"
  },
  "datePublished": "2026-06-13",
  "author": {
    "@type": "Person",
    "name": "Keneth Namias"
  }
}
```

### CreativeWork Schema
```json
{
  "@type": "CreativeWork",
  "name": "Project Name",
  "url": "https://ppnamias.com/projects/project-slug",
  "image": {
    "@type": "ImageObject",
    "url": "https://ppnamias.com/images/project.jpg",
    "width": 1200,
    "height": 630,
    "alt": "Project Screenshot"
  }
}
```

## Image Specifications

| Property | Requirement |
|----------|-------------|
| Minimum Dimensions | 1200x630 pixels |
| Recommended Dimensions | 1200x630 pixels |
| Aspect Ratio | 1.91:1 |
| Supported Formats | WebP, JPEG, PNG |
| Maximum File Size | 5MB |
| Alt Text | Required for accessibility |

## Files to Modify

### Sanity Schemas
- `studio/schemaTypes/singletons/profile.ts` - Add seoImage field
- `studio/schemaTypes/documents/project.ts` - Add seoImage field
- `studio/schemaTypes/documents/post.ts` - Add featuredImage field

### JSON-LD Components
- `src/components/seo/PersonJsonLd.tsx` - Add image property
- `src/components/seo/ArticleJsonLd.tsx` - New component
- `src/components/seo/CreativeWorkJsonLd.tsx` - New component
- `src/components/seo/types.ts` - Add ImageObject type

### Meta Tags
- `src/app/layout.tsx` - Update generateMetadata
- `src/app/page.tsx` - Add og:image
- `src/app/projects/[slug]/page.tsx` - Add og:image
- `src/lib/seo-image.ts` - New utility

### Documentation
- `docs/seo/google-rich-results-test.md` - Testing guide
- `docs/seo/image-requirements.md` - Image requirements

## Commit Strategy

Each slice will be committed separately with descriptive commit messages:
1. `feat(sanity): add seoImage field to Profile singleton`
2. `feat(sanity): add seoImage field to Project schema`
3. `feat(sanity): add featuredImage field to Post schema`
4. `feat(sanity): add image dimension validation`
5. `feat(seo): enhance Person JSON-LD with image`
6. `feat(seo): create Article JSON-LD component`
7. `feat(seo): create CreativeWork JSON-LD component`
8. `feat(seo): add ImageObject type definitions`
9. `feat(seo): update generateMetadata with og:image`
10. `feat(seo): add twitter:image meta tags`
11. `feat(seo): create SEO image helper utility`
12. `docs(seo): add Person schema testing documentation`
13. `docs(seo): add Article schema testing documentation`
14. `docs(seo): add image requirements documentation`

## Testing Checklist

- [ ] Person JSON-LD passes Google's Rich Results Test
- [ ] Article JSON-LD passes Google's Rich Results Test
- [ ] CreativeWork JSON-LD passes Google's Rich Results Test
- [ ] og:image meta tag present on all pages
- [ ] twitter:image meta tag present on all pages
- [ ] Images are at least 1200x630 pixels
- [ ] Images have descriptive alt text
- [ ] Fallback images work when SEO image not set

## Success Metrics

- Google Rich Results Test passes for all schema types
- og:image and twitter:image meta tags present on all pages
- Images meet minimum 1200x630 dimension requirement
- No structured data errors in Google Search Console
- CTR improvement visible in Google Search Console (after 2-4 weeks)

## Timeline

| Phase | Duration |
|-------|----------|
| Planning | 1-2 days |
| Implementation | 2-3 days |
| Testing | 1 day |
| Deployment | 1 day |
| Monitoring | 2-4 weeks post-deployment |

## Monitoring

After deployment, monitor:
1. Google Search Console for structured data errors
2. Google Search Console for CTR improvements
3. Facebook Sharing Debugger for og:image previews
4. Twitter Card Validator for twitter:image previews
