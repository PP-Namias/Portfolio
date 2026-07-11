# EPIC-D: Automated Content Validation

## Goal
Add real-time content validation: required fields, data consistency, duplicate detection, and SEO checks.

## Current State
- Basic validation rules in schema definitions
- No real-time visual feedback
- No duplicate detection
- No SEO validation
- No URL validation

## Slice 1: Real-Time Field Validation
**Files:** `studio/schemaTypes/*.ts`, `studio/inspectors/ValidationInspector.tsx`

### Changes
1. Add validation rules to all schemas:
   - `project`: title required, category required, year required
   - `experience`: position required, company required, startedAt required
   - `certification`: title required, issuer required
   - `post`: title required, slug required, content required
2. Create `ValidationInspector.tsx` that shows validation errors
3. Show visual indicators (red/yellow/green) for field status

### Validation Rules
```typescript
// Example for project schema
defineField({
  name: 'title',
  type: 'string',
  validation: (Rule) => Rule.required().error('Project title is required'),
})
defineField({
  name: 'year',
  type: 'number',
  validation: (Rule) => Rule.required().min(2020).max(2030).error('Year must be between 2020-2030'),
})
```

### Verification
- Open any document
- Leave required fields empty
- Validation inspector shows errors
- Red indicators on empty required fields

---

## Slice 2: Duplicate Detection
**Files:** `studio/inspectors/ValidationInspector.tsx`

### Changes
1. Check for duplicate project titles (case-insensitive)
2. Check for duplicate certification titles
3. Check for duplicate blog post slugs
4. Show warnings with links to duplicates

### Detection Logic
```typescript
async function checkDuplicates(client, documentType, fieldName, currentValue, currentId) {
  const query = `count(*[_type == "${documentType}" && lower(${fieldName}) == lower($value) && _id != $id])`
  const count = await client.fetch(query, { value: currentValue, id: currentId })
  return count > 0
}
```

### Verification
- Create two projects with same title
- Validation inspector shows duplicate warning
- Clicking warning shows both documents

---

## Slice 3: SEO & URL Validation
**Files:** `studio/inspectors/ValidationInspector.tsx`

### Changes
1. Validate meta title length (50-60 chars)
2. Validate meta description length (150-160 chars)
3. Validate image alt text presence
4. Validate URLs (liveURL, repositoryURL) are valid format
5. Check for missing og:image

### SEO Checks
| Check | Pass | Warning | Error |
|-------|------|---------|-------|
| Meta title | 50-60 chars | 40-49 or 61-70 | <40 or >70 |
| Meta description | 150-160 chars | 140-149 or 161-170 | <140 or >170 |
| Image alt text | Present | Missing | N/A |
| Live URL | Valid URL | HTTP (not HTTPS) | Invalid format |
| Repository URL | Valid URL | HTTP (not HTTPS) | Invalid format |

### Verification
- Open project with invalid URL
- Validation inspector shows URL error
- Fix URL — error disappears

---

## Execution Order
1. Real-time field validation (Slice 1)
2. Duplicate detection (Slice 2)
3. SEO & URL validation (Slice 3)

## Commit Log
- `feat(sanity): add real-time field validation with visual indicators`
- `feat(sanity): add duplicate detection for projects, certifications, posts`
- `feat(sanity): add SEO and URL validation`

## Testing Checklist
- [ ] Required field validation works
- [ ] Duplicate detection catches duplicates
- [ ] URL validation catches invalid URLs
- [ ] SEO validation checks meta lengths
- [ ] Visual indicators show correct status
- [ ] Validation updates in real-time
