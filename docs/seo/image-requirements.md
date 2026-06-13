# SEO Image Requirements

## Overview

This document describes the image requirements for Google search result thumbnails and social media previews.

## Google Search Result Thumbnails

### Minimum Requirements
- **Dimensions**: 1200x630 pixels (minimum)
- **Aspect Ratio**: 1.91:1
- **Formats**: WebP, JPEG, PNG
- **Max File Size**: 5MB
- **Accessibility**: Alt text required

### Recommended Settings
- **Dimensions**: 1200x630 pixels (exact)
- **Format**: WebP with JPEG fallback
- **File Size**: Under 1MB
- **Alt Text**: Descriptive text for accessibility

## Social Media Previews

### Facebook / Open Graph
- **Image URL**: `og:image` meta tag
- **Dimensions**: 1200x630 pixels (recommended)
- **Aspect Ratio**: 1.91:1
- **Formats**: JPEG, PNG

### Twitter Cards
- **Image URL**: `twitter:image` meta tag
- **Card Type**: `summary_large_image`
- **Dimensions**: 1200x630 pixels (recommended)
- **Aspect Ratio**: 1.91:1
- **Formats**: JPEG, PNG

## Image Object Structure

```json
{
  "@type": "ImageObject",
  "url": "https://namias.tech/images/profile.jpg",
  "width": 1200,
  "height": 630,
  "alt": "Jhon Keneth Ryan Namias - Full Stack Developer"
}
```

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `@type` | string | Yes | Must be "ImageObject" |
| `url` | string | Yes | Absolute URL to image |
| `width` | number | Yes | Image width in pixels |
| `height` | number | Yes | Image height in pixels |
| `alt` | string | Yes | Descriptive alt text |

## Sanity Studio Fields

### Profile Singleton
- **Field**: `seoImage`
- **Type**: Image with hotspot
- **Subfields**: `alt` (required)

### Project Document
- **Field**: `seoImage`
- **Type**: Image with hotspot
- **Subfields**: `alt` (required)
- **Fallback**: Cover image (`image` field)

### Post Document
- **Field**: `seoImage`
- **Type**: Image with hotspot
- **Subfields**: `alt` (required)
- **Fallback**: Main image (`mainImage` field)

## Validation Rules

### Dimension Validation
- Minimum: 1200x630 pixels
- Warning if smaller than recommended
- Current dimensions shown in warning message

### Alt Text Validation
- Minimum: 4 characters
- Required for accessibility
- Warning if missing or too short

## Testing Checklist

- [ ] Image is at least 1200x630 pixels
- [ ] Image is in WebP, JPEG, or PNG format
- [ ] Image is under 5MB
- [ ] Alt text is descriptive (4+ characters)
- [ ] Image URL is absolute (https://...)
- [ ] Image passes Google's Rich Results Test
- [ ] Image displays correctly in Facebook Sharing Debugger
- [ ] Image displays correctly in Twitter Card Validator

## Common Issues

### Issue: Image not showing in search results
**Causes**:
- Image dimensions too small
- Image not accessible via public URL
- Structured data missing image property

**Fixes**:
- Upload larger image (1200x630 minimum)
- Ensure image URL is public
- Add image property to JSON-LD

### Issue: Image showing but blurred
**Causes**:
- Image resolution too low
- Image compressed too much

**Fixes**:
- Upload higher resolution image
- Reduce compression

### Issue: Wrong image showing
**Causes**:
- Multiple image meta tags
- Cached old image

**Fixes**:
- Ensure only one og:image tag
- Request re-indexing in Google Search Console

## Tools for Image Creation

### Canva
- Template: Facebook Post (1200x630)
- Export as PNG or JPEG

### Figma
- Frame: 1200x630
- Export as PNG or JPEG

### Photopea (Free)
- Canvas: 1200x630
- Export as WebP or PNG

## File Naming Convention

Use descriptive filenames:
- ✅ `keneth-namias-profile.jpg`
- ✅ `project-screenshot.png`
- ❌ `image1.jpg`
- ❌ `IMG_20260613.jpg`
