# EPIC-C: Meta Tags & Open Graph

## Overview

Ensure `og:image` and `twitter:image` meta tags are properly set across all pages for social media previews and search result thumbnails.

## Goal

All pages will have proper `og:image` and `twitter:image` meta tags that reference the SEO images from Sanity.

## Slices

### Slice C-1: Update generateMetadata for og:image

**Files**: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/projects/[slug]/page.tsx`

**Changes**:
- Update `generateMetadata` functions to include `og:image`
- Use absolute URLs for images (include domain)
- Fetch SEO image from Sanity for each page
- Fall back to default portfolio image

**Acceptance Criteria**:
- [ ] Homepage has `og:image` meta tag
- [ ] Project pages have `og:image` meta tag
- [ ] Blog pages have `og:image` meta tag
- [ ] Images use absolute URLs
- [ ] Fallback to default image works

---

### Slice C-2: Add twitter:image meta tags

**File**: `src/app/layout.tsx`

**Changes**:
- Add `twitter:card` meta tag (summary_large_image)
- Add `twitter:image` meta tag
- Add `twitter:title` meta tag
- Add `twitter:description` meta tag

**Acceptance Criteria**:
- [ ] All pages have `twitter:card` = `summary_large_image`
- [ ] All pages have `twitter:image` meta tag
- [ ] Twitter Card Validator shows correct preview

---

### Slice C-3: Create SEO image helper utility

**File**: `src/lib/seo-image.ts`

**Changes**:
- Create `getSeoImageUrl()` function
- Accept Sanity image object or URL
- Return absolute URL with proper dimensions
- Add fallback to default image
- Support image transformations (resize, format)

**Acceptance Criteria**:
- [ ] Utility function exists
- [ ] Returns absolute URLs
- [ ] Handles Sanity image objects
- [ ] Falls back to default image
- [ ] Supports image transformations

---

## Testing

- Use Facebook Sharing Debugger to test og:image
- Use Twitter Card Validator to test twitter:image
- Verify images load correctly in social previews
- Test with and without SEO images set

## Commit Strategy

Each slice will be committed separately:
1. `feat(seo): update generateMetadata with og:image`
2. `feat(seo): add twitter:image meta tags`
3. `feat(seo): create SEO image helper utility`
