# EPIC-B: JSON-LD Structured Data

## Overview

Implement JSON-LD structured data with image properties for Person, Article, and CreativeWork schemas to enable rich snippets in Google search results.

## Goal

Add `image` property to all JSON-LD structured data components so Google can display thumbnails in search results.

## Slices

### Slice B-1: Enhance Person JSON-LD with image

**File**: `src/components/seo/PersonJsonLd.tsx`

**Changes**:
- Add `image` property to Person schema
- Use `ImageObject` structure with `url`, `width`, `height`, `alt`
- Fetch `seoImage` from Sanity profile singleton
- Fall back to default profile image if no SEO image set

**Acceptance Criteria**:
- [ ] Person JSON-LD includes `image` property
- [ ] Image uses `ImageObject` structure
- [ ] Image URL is absolute (includes domain)
- [ ] Fallback to default image works
- [ ] Alt text is included

---

### Slice B-2: Create Article JSON-LD component

**File**: `src/components/seo/ArticleJsonLd.tsx`

**Changes**:
- Create new component for Article JSON-LD
- Include `image` property with `ImageObject` structure
- Accept `featuredImage` from blog post
- Include `headline`, `datePublished`, `author`

**Acceptance Criteria**:
- [ ] Article JSON-LD component exists
- [ ] Includes `image` property
- [ ] Uses `ImageObject` structure
- [ ] Validates with Google's Rich Results Test

---

### Slice B-3: Create CreativeWork JSON-LD component

**File**: `src/components/seo/CreativeWorkJsonLd.tsx`

**Changes**:
- Create new component for CreativeWork JSON-LD
- Include `image` property with `ImageObject` structure
- Accept `seoImage` or `coverImage` from project
- Include `name`, `url`, `description`

**Acceptance Criteria**:
- [ ] CreativeWork JSON-LD component exists
- [ ] Includes `image` property
- [ ] Uses `ImageObject` structure
- [ ] Validates with Google's Rich Results Test

---

### Slice B-4: Add image object structure

**File**: `src/components/seo/types.ts`

**Changes**:
- Define `ImageObject` TypeScript interface
- Define `PersonSchema`, `ArticleSchema`, `CreativeWorkSchema` types
- Ensure all schemas support `image` property

**Acceptance Criteria**:
- [ ] `ImageObject` interface defined
- [ ] All schema types support `image`
- [ ] Types are used across all JSON-LD components

---

## Testing

- Validate each JSON-LD component with Google's Rich Results Test
- Test with and without SEO images set
- Verify image URLs are absolute
- Check that alt text is included

## Commit Strategy

Each slice will be committed separately:
1. `feat(seo): enhance Person JSON-LD with image`
2. `feat(seo): create Article JSON-LD component`
3. `feat(seo): create CreativeWork JSON-LD component`
4. `feat(seo): add ImageObject type definitions`
