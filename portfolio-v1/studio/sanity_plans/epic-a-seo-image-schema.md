# EPIC-A: SEO Image Schema & Sanity Fields

## Overview

Add SEO image fields to Sanity schemas (Profile, Project, Post) with validation to ensure images meet Google's requirements for rich snippets.

## Goal

Enable content creators to upload and manage SEO preview images for each content type in Sanity Studio, with validation ensuring images are at least 1200x630 pixels.

## Slices

### Slice A-1: Add seoImage field to Profile singleton

**File**: `studio/schemaTypes/singletons/profile.ts`

**Changes**:
- Add `seoImage` field of type `image`
- Include hotspot for responsive cropping
- Add fields for `alt` text (required for accessibility)
- Add preview configuration for image

**Acceptance Criteria**:
- [ ] `seoImage` field appears in Profile singleton editor
- [ ] Image upload works with drag-and-drop
- [ ] Alt text field is required when image is present
- [ ] Image preview shows in Sanity Studio

---

### Slice A-2: Add seoImage field to Project schema

**File**: `studio/schemaTypes/documents/project.ts`

**Changes**:
- Add `seoImage` field of type `image`
- Include hotspot for responsive cropping
- Add `seoImageAlt` field for alt text
- Add fallback logic: use `coverImage` if `seoImage` not set

**Acceptance Criteria**:
- [ ] `seoImage` field appears in Project document editor
- [ ] Alt text field is available
- [ ] Fallback to `coverImage` works when `seoImage` is empty
- [ ] Image preview shows in Sanity Studio

---

### Slice A-3: Add featuredImage field to Post schema

**File**: `studio/schemaTypes/documents/post.ts`

**Changes**:
- Add `featuredImage` field of type `image` (if not already present)
- Include hotspot for responsive cropping
- Add `featuredImageAlt` field for alt text
- Ensure this field is used for both display and SEO

**Acceptance Criteria**:
- [ ] `featuredImage` field appears in Post document editor
- [ ] Alt text field is available
- [ ] Image is used in Article JSON-LD
- [ ] Image preview shows in Sanity Studio

---

### Slice A-4: Add image dimension validation

**File**: `studio/validation/seoImageValidation.ts`

**Changes**:
- Create custom validation function for image dimensions
- Validate minimum dimensions: 1200x630 pixels
- Show warning if image is larger than 5MB
- Validate image format (WebP, JPEG, PNG)

**Acceptance Criteria**:
- [ ] Validation error shows if image < 1200x630
- [ ] Warning shows if image > 5MB
- [ ] Validation error shows for unsupported formats
- [ ] Validation passes for valid images

---

## Testing

- Upload images in Sanity Studio and verify fields appear
- Test validation with images of various sizes
- Test fallback logic for projects without seoImage
- Verify alt text is required when image is present

## Commit Strategy

Each slice will be committed separately:
1. `feat(sanity): add seoImage field to Profile singleton`
2. `feat(sanity): add seoImage field to Project schema`
3. `feat(sanity): add featuredImage field to Post schema`
4. `feat(sanity): add image dimension validation`
