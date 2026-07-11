# Smart Templates Plan

> **Priority:** P2 — Studio features  
> **Status:** Planning

---

## Goal

Create intelligent document templates with smart defaults and auto-fill.

---

## Current State

### What Exists

- ✅ Basic intent/create with type parameter
- ✅ Smart defaults for project, post, certification
- ✅ Initial values via URL params

---

## Enhancements

### 1. Add Template Selection UI

```typescript
// templates/TemplateSelector.tsx
- Visual template picker
- Template previews
- Recent templates
- Favorite templates
```

### 2. Add Smart Auto-Fill

```typescript
// templates/SmartAutoFill.tsx
- Auto-fill from existing documents
- Clone document functionality
- Import from external sources
- AI-powered suggestions
```

### 3. Add Template Gallery

```typescript
// templates/TemplateGallery.tsx
- Pre-built templates per document type
- Industry-specific templates
- Custom template creation
- Template sharing
```

### 4. Add Template Versioning

```typescript
// templates/TemplateVersioning.tsx
- Version control for templates
- Rollback to previous versions
- Template history
- Template comparison
```

---

## Template Types

### 1. Project Templates

```typescript
const projectTemplates = [
  {
    name: 'Featured Project',
    description: 'High-visibility project with showcase detail',
    defaults: {
      status: 'completed',
      tier: 'featured',
      featured: true,
      showcaseDetail: true,
    },
  },
  {
    name: 'Standard Project',
    description: 'Regular project without showcase',
    defaults: {
      status: 'completed',
      tier: 'standard',
      featured: false,
      showcaseDetail: false,
    },
  },
  {
    name: 'Draft Project',
    description: 'Work in progress',
    defaults: {
      status: 'draft',
      tier: 'standard',
      featured: false,
      showcaseDetail: false,
    },
  },
]
```

### 2. Post Templates

```typescript
const postTemplates = [
  {
    name: 'Blog Post',
    description: 'Standard blog post',
    defaults: {
      publishedAt: new Date().toISOString(),
    },
  },
  {
    name: 'Tutorial',
    description: 'Step-by-step tutorial',
    defaults: {
      publishedAt: new Date().toISOString(),
      category: 'tutorials',
    },
  },
  {
    name: 'Case Study',
    description: 'Project case study',
    defaults: {
      publishedAt: new Date().toISOString(),
      category: 'case-studies',
    },
  },
]
```

### 3. Certification Templates

```typescript
const certificationTemplates = [
  {
    name: 'Professional Certificate',
    description: 'Industry certification',
    defaults: {
      issueDate: new Date().toISOString(),
    },
  },
  {
    name: 'Online Course',
    description: 'Online learning certificate',
    defaults: {
      issueDate: new Date().toISOString(),
    },
  },
]
```

---

## Files to Modify

| File | Action |
|------|--------|
| `studio/templates/TemplateSelector.tsx` | CREATE |
| `studio/templates/SmartAutoFill.tsx` | CREATE |
| `studio/templates/TemplateGallery.tsx` | CREATE |
| `studio/templates/TemplateVersioning.tsx` | CREATE |
| `studio/templates/index.ts` | CREATE |

---

## Implementation Steps

### Step 1: Add Template Selection UI

1. Create TemplateSelector component
2. Add visual template picker
3. Add template previews

### Step 2: Add Smart Auto-Fill

1. Create SmartAutoFill component
2. Add clone document functionality
3. Add AI suggestions

### Step 3: Add Template Gallery

1. Create TemplateGallery component
2. Add pre-built templates
3. Add custom template creation

### Step 4: Add Template Versioning

1. Create TemplateVersioning component
2. Add version control
3. Add rollback functionality

### Step 5: Test

- [ ] Template selector works
- [ ] Auto-fill populates fields
- [ ] Gallery shows templates
- [ ] Versioning tracks changes

---

## Template Storage

```typescript
// templates stored in localStorage
const STORAGE_KEY = 'namias-templates'

interface Template {
  id: string
  name: string
  description: string
  type: string
  defaults: Record<string, any>
  createdAt: string
  updatedAt: string
  version: number
}
```

---

## Commit Strategy

```
plan(sanity): add smart templates plan
feat(sanity): add template selector
feat(sanity): add smart auto-fill
feat(sanity): add template gallery
feat(sanity): add template versioning
```
