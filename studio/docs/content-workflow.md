# Content Lifecycle Workflow

This document describes the content lifecycle for the Namias CMS Studio.

## Workflow Stages

### 1. Draft

- Create new content using the studio
- Use AI Assist for suggestions and auto-generation
- Save as draft (auto-saved by Sanity)

### 2. Review

- Check content health score in the inspector panel
- Review SEO preview (Google SERP, Twitter card, Open Graph)
- Verify all required fields are filled
- Use AI Assist to optimize content

### 3. Publish

- Click "Publish" to make content live
- Studio triggers revalidation webhook for both v1 and v2
- Content appears on both portfolio sites

### 4. Maintain

- Monitor content health scores
- Update stale content (30+ days old)
- Review and refresh outdated information
- Use bulk operations for batch updates

## Content Types

| Type | Location | Frequency |
|------|----------|-----------|
| Profile | Homepage > Hero & Profile | Quarterly |
| Projects | Collections > Projects | As needed |
| Experience | Collections > Experience | As needed |
| Certifications | Collections > Certifications | As earned |
| Blog Posts | Blog > Posts | Weekly/Monthly |
| Gallery | Collections > Gallery | As needed |

## Best Practices

1. **Use AI Assist** — Let AI help generate and optimize content
2. **Check Health Score** — Aim for 80%+ completeness
3. **SEO Preview** — Always check before publishing
4. **Alt Text** — Add descriptive alt text to all images
5. **Slug** — Use clean, SEO-friendly slugs
6. **Featured** — Mark important content as featured

## Roles

- **Content Editor** — Can create, edit, and publish content
- **Reviewer** — Can review and approve content
- **Admin** — Full access to all studio features

## Emergency Procedures

### Rollback

1. Go to document history
2. Select previous version
3. Restore and republish

### Bulk Archive

1. Select multiple documents
2. Use bulk operations
3. Archive instead of delete
