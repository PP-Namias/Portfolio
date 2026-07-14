# Validation Plan

> **Priority:** P2 — Studio features  
> **Status:** Planning

---

## Goal

Enhance content validation to catch issues before publishing.

---

## Current State

### What Exists

- ✅ Field-level validation rules
- ✅ Duplicate title detection
- ✅ SEO length validation
- ✅ Year range validation
- ✅ Max array items validation

---

## Enhancements

### 1. Add Cross-Field Validation

```typescript
// validation/cross-field.ts
- Validate related fields
- Conditional validation
- Date range validation
```

### 2. Add Business Rules

```typescript
// validation/business-rules.ts
- Required fields for published documents
- Status-based validation
- Role-based validation
```

### 3. Add Custom Validators

```typescript
// validation/custom-validators.ts
- URL accessibility check
- Image dimensions check
- Email format validation
- Phone format validation
```

### 4. Add Validation Messages

```typescript
// validation/messages.ts
- Friendly error messages
- Helpful suggestions
- Links to documentation
```

---

## Validation Rules

### 1. Required Fields

```typescript
// For published documents
const requiredForPublish = {
  project: ['title', 'slug', 'summary', 'status'],
  post: ['title', 'slug', 'body'],
  certification: ['title', 'issuer', 'issueDate'],
  experience: ['title', 'company', 'startDate'],
}
```

### 2. Date Validation

```typescript
// Date must be in past
const dateInPast = (field: string) => (rule: Rule) =>
  rule.custom((value, context) => {
    if (new Date(value) > new Date()) {
      return `${field} must be in the past`
    }
    return true
  })

// End date after start date
const dateAfterStart = (startField: string) => (rule: Rule) =>
  rule.custom((value, context) => {
    const start = context.document[startField]
    if (new Date(value) < new Date(start)) {
      return `End date must be after start date`
    }
    return true
  })
```

### 3. URL Validation

```typescript
// URL must be accessible
const urlAccessible = (rule: Rule) =>
  rule.custom(async (value) => {
    if (!value) return true
    try {
      const response = await fetch(value, {method: 'HEAD'})
      if (!response.ok) {
        return `URL is not accessible (${response.status})`
      }
      return true
    } catch {
      return `URL is not accessible`
    }
  })
```

### 4. Image Validation

```typescript
// Image must have alt text
const imageWithAlt = (rule: Rule) =>
  rule.custom((value) => {
    if (!value) return true
    if (!value.alt || value.alt.length < 4) {
      return 'Image must have descriptive alt text (4+ characters)'
    }
    return true
  })
```

---

## Files to Modify

| File | Action |
|------|--------|
| `studio/validation/rules.ts` | ENHANCE |
| `studio/validation/cross-field.ts` | CREATE |
| `studio/validation/business-rules.ts` | CREATE |
| `studio/validation/custom-validators.ts` | CREATE |
| `studio/validation/messages.ts` | CREATE |

---

## Implementation Steps

### Step 1: Add Cross-Field Validation

1. Create cross-field validators
2. Add date range validation
3. Add conditional validation

### Step 2: Add Business Rules

1. Create business rule validators
2. Add required fields for publish
3. Add status-based validation

### Step 3: Add Custom Validators

1. Create URL accessibility check
2. Add image dimensions check
3. Add email/phone validation

### Step 4: Add Validation Messages

1. Create friendly error messages
2. Add helpful suggestions
3. Add documentation links

### Step 5: Test

- [ ] Cross-field validation works
- [ ] Business rules enforce
- [ ] Custom validators run
- [ ] Messages are helpful

---

## Validation Messages

```typescript
const messages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) => 
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => 
    `${field} must be less than ${max} characters`,
  invalidUrl: (field: string) => `${field} must be a valid URL`,
  invalidEmail: (field: string) => `${field} must be a valid email`,
  dateInPast: (field: string) => `${field} must be in the past`,
  dateAfterStart: (field: string) => 
    `${field} must be after the start date`,
  imageAlt: 'Image must have descriptive alt text (4+ characters)',
}
```

---

## Commit Strategy

```
plan(sanity): add validation plan
feat(sanity): add cross-field validation
feat(sanity): add business rules
feat(sanity): add custom validators
feat(sanity): add validation messages
```
