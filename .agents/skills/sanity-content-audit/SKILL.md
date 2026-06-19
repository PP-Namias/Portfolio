# Sanity Content Auditor

Audits Sanity content for completeness, consistency, and quality issues.

## Usage

```bash
node scripts/sanity-content-audit.mjs
```

## What It Checks

1. **Missing Required Fields**: Documents with empty required fields
2. **Orphaned References**: References to non-existent documents
3. **Image Issues**: Missing alt text, broken image URLs
4. **Date Validation**: Invalid dates, future dates on past events
5. **URL Validation**: Malformed URLs, broken links
6. **Duplicate Content**: Duplicate titles, slugs, or descriptions
7. **Content Gaps**: Missing translations, empty rich text blocks
8. **Size Issues**: Content that's too long or too short

## Output Format

```json
{
  "summary": {
    "totalDocuments": 45,
    "issuesFound": 12,
    "critical": 2,
    "warnings": 10
  },
  "issues": [
    {
      "type": "missing_alt_text",
      "severity": "warning",
      "document": "project-abc",
      "field": "image",
      "message": "Image missing alt text"
    }
  ]
}
```

## Exit Codes

- `0`: No critical issues
- `1`: Critical issues found

## Integration

```yaml
- name: Audit Sanity content
  run: node scripts/sanity-content-audit.mjs
  env:
    SANITY_API_READ_TOKEN: ${{ secrets.SANITY_API_READ_TOKEN }}
```
