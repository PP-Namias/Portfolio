# Content Health Plan

> **Priority:** P2 — Studio features  
> **Status:** Planning

---

## Goal

Monitor and improve content quality with automated health checks.

---

## Current State

### What Exists

- ✅ ContentHealthPanel component
- ✅ Field completeness checks
- ✅ Stale content detection
- ✅ Orphaned reference detection
- ✅ Welcome page integration

---

## Enhancements

### 1. Add Content Score

```typescript
// components/health/ContentScore.tsx
- Calculate health score (0-100)
- Breakdown by category
- Trend over time
- Comparison with previous score
```

### 2. Add Fix Suggestions

```typescript
// components/health/FixSuggestions.tsx
- Suggest fixes for each issue
- One-click fix buttons
- Batch fix all issues
- Auto-fix for common problems
```

### 3. Add Health History

```typescript
// components/health/HealthHistory.tsx
- Track health over time
- Show improvement/decline
- Export health reports
- Schedule health checks
```

### 4. Add Content Completeness

```typescript
// components/health/ContentCompleteness.tsx
- Required fields check
- Recommended fields check
- SEO completeness
- Image completeness
```

---

## Health Categories

### 1. Required Fields

| Document | Required Fields |
|----------|-----------------|
| `profile` | fullName, title, email |
| `aboutSection` | aboutContent |
| `project` | title, slug, summary |
| `experience` | title, company, startDate |
| `certification` | title, issuer, issueDate |
| `post` | title, slug, body |

### 2. Recommended Fields

| Document | Recommended Fields |
|----------|-------------------|
| `profile` | profileImage, education |
| `project` | shortDescription, technologies |
| `experience` | description, endDate |
| `post` | excerpt, mainImage |

### 3. SEO Fields

| Document | SEO Fields |
|----------|------------|
| `project` | seoTitle, seoDescription, ogImage |
| `post` | seoTitle, seoDescription, ogImage |

### 4. Image Fields

| Document | Image Fields |
|----------|--------------|
| `project` | image (with alt text) |
| `post` | mainImage (with alt text) |

---

## Files to Modify

| File | Action |
|------|--------|
| `studio/components/health/ContentHealthPanel.tsx` | ENHANCE |
| `studio/components/health/ContentScore.tsx` | CREATE |
| `studio/components/health/FixSuggestions.tsx` | CREATE |
| `studio/components/health/HealthHistory.tsx` | CREATE |
| `studio/components/health/ContentCompleteness.tsx` | CREATE |

---

## Implementation Steps

### Step 1: Add Content Score

1. Create scoring algorithm
2. Calculate score per document
3. Display overall score

### Step 2: Add Fix Suggestions

1. Create suggestion engine
2. Add fix buttons
3. Implement batch fixes

### Step 3: Add Health History

1. Store health data in localStorage
2. Track changes over time
3. Display history chart

### Step 4: Add Content Completeness

1. Define completeness rules
2. Check each document
3. Display completeness percentage

### Step 5: Test

- [ ] Score calculates correctly
- [ ] Suggestions are helpful
- [ ] History tracks changes
- [ ] Completeness checks work

---

## Scoring Algorithm

```typescript
function calculateHealthScore(document: any): number {
  let score = 100
  
  // Required fields (-10 each)
  const requiredFields = getRequiredFields(document._type)
  for (const field of requiredFields) {
    if (!document[field]) score -= 10
  }
  
  // Recommended fields (-5 each)
  const recommendedFields = getRecommendedFields(document._type)
  for (const field of recommendedFields) {
    if (!document[field]) score -= 5
  }
  
  // SEO fields (-3 each)
  const seoFields = ['seoTitle', 'seoDescription']
  for (const field of seoFields) {
    if (!document[field]) score -= 3
  }
  
  // Images without alt text (-2 each)
  if (document.image && !document.image.alt) score -= 2
  
  return Math.max(0, score)
}
```

---

## Commit Strategy

```
plan(sanity): add content health plan
feat(sanity): add content scoring
feat(sanity): add fix suggestions
feat(sanity): add health history
feat(sanity): add content completeness
```
