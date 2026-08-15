# Google Rich Results Testing

## Overview

This document describes how to test structured data (JSON-LD) with Google's Rich Results Test tool to ensure search result thumbnails appear correctly.

## Testing Tools

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Google Search Console**: https://search.google.com/search-console
3. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator**: https://cards-dev.twitter.com/validator

## Person Schema Testing

### URL to Test
```
https://namias.tech
```

### Expected Result
- Person schema with image property
- Image displays in search results
- No errors or warnings

### How to Test
1. Go to https://search.google.com/test/rich-results
2. Enter `https://namias.tech`
3. Click "Test URL"
4. Verify Person schema is detected
5. Check that image property is present
6. Verify no errors

## Article Schema Testing

### URL to Test
```
https://namias.tech/blog/[slug]
```

### Expected Result
- Article schema with image property
- Featured image displays in search results
- No errors or warnings

### How to Test
1. Go to https://search.google.com/test/rich-results
2. Enter a blog post URL
3. Click "Test URL"
4. Verify Article schema is detected
5. Check that image property is present
6. Verify no errors

## CreativeWork Schema Testing

### URL to Test
```
https://namias.tech/projects/[slug]
```

### Expected Result
- CreativeWork schema with image property
- Project image displays in search results
- No errors or warnings

### How to Test
1. Go to https://search.google.com/test/rich-results
2. Enter a project detail URL
3. Click "Test URL"
4. Verify CreativeWork schema is detected
5. Check that image property is present
6. Verify no errors

## Common Errors and Fixes

### Error: "Missing required field: image"
**Fix**: Ensure the `image` property is present in the JSON-LD schema with `@type: 'ImageObject'`.

### Error: "Image URL is not absolute"
**Fix**: Use absolute URLs (https://namias.tech/...) instead of relative URLs.

### Error: "Image dimensions missing"
**Fix**: Include `width` and `height` properties in the ImageObject.

### Error: "Image alt text missing"
**Fix**: Include `alt` property in the ImageObject for accessibility.

## Image Requirements

| Property | Requirement |
|----------|-------------|
| Minimum Dimensions | 1200x630 pixels |
| Aspect Ratio | 1.91:1 |
| Formats | WebP, JPEG, PNG |
| Max File Size | 5MB |
| Alt Text | Required |

## Monitoring

After deployment, monitor:
1. Google Search Console for structured data errors
2. Google Search Console for CTR improvements
3. Facebook Sharing Debugger for og:image previews
4. Twitter Card Validator for twitter:image previews

## Timeline

- **Week 1**: Deploy changes, submit URLs for indexing
- **Week 2-4**: Monitor Google Search Console for improvements
- **Week 4+**: Analyze CTR data and adjust if needed
