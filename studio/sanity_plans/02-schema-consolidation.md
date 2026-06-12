# Schema Consolidation Plan

> **Priority:** P1 — After backup verification  
> **Status:** Planning

---

## Goal

Clean up schema types to reduce complexity while preserving all data.

---

## Current Schema (21 types)

### Singletons (7)
- `profile` — Hero + profile data
- `aboutSection` — About content
- `techStack` — Tech stack data
- `siteSettings` — Site settings
- `seoSettings` — SEO settings
- `mediaSettings` — Media settings
- `resume` — Resume data

### Collections (8)
- `project` — Projects
- `experience` — Work experience
- `certification` — Certifications
- `post` — Blog posts
- `author` — Blog authors
- `category` — Blog categories
- `membership` — Community memberships
- `recommendation` — Recommendations
- `galleryImage` — Gallery images

### References (5)
- `seoImage` — SEO image reference
- `ogImage` — OG image reference
- `twitterImage` — Twitter image reference
- `resume` — Resume reference
- `author` — Author reference

### Arrays (1)
- `socialLink` — Social link items

---

## Proposed Changes

### 1. Remove `heroSection` (DONE)

**Status:** Already completed  
**Data:** Merged into `profile` singleton

```diff
- schemaTypes/heroSection.ts  (DELETED)
- schemaTypes/index.ts        (heroSection removed)
- _registry.ts                (heroSection removed)
```

### 2. Remove `skillsToolPlugin` (PLANNED)

**Status:** Planned  
**Reason:** Skills live in `.agents/skills/`, not Sanity

```diff
- sanity.config.ts            (skillsToolPlugin removed)
- components/Welcome.tsx      (Browse Skills removed)
```

### 3. Consolidate Image Types

**Current:** Multiple image types with similar fields  
**Proposed:** Single `customImage` type

```typescript
// schemaTypes/customImage.ts
export default defineType({
  name: 'customImage',
  title: 'Custom Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({name: 'alt', title: 'Alt text', type: 'string'}),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({name: 'credit', title: 'Credit', type: 'string'}),
    defineField({name: 'source', title: 'Source', type: 'string'}),
    defineField({name: 'license', title: 'License', type: 'string'}),
    defineField({name: 'dominantColor', title: 'Dominant color', type: 'string'}),
  ],
})
```

### 4. Consolidate Reference Types

**Current:** `seoImage`, `ogImage`, `twitterImage`  
**Proposed:** Use `customImage` directly

```diff
- seoImage.ts     (DELETED)
- ogImage.ts      (DELETED)
- twitterImage.ts (DELETED)
+ Use customImage directly in schemas
```

### 5. Keep All Collections

All collection types stay as-is:
- `project`
- `experience`
- `certification`
- `post`
- `author`
- `category`
- `membership`
- `recommendation`
- `galleryImage`

---

## Migration Strategy

### Step 1: Export Current Schema

```powershell
# Export schema definition
sanity schema export > data/exports/schema.json
```

### Step 2: Create New Schema Types

1. Create `customImage.ts`
2. Update schemas to use `customImage`
3. Remove old reference types

### Step 3: Migrate Content

```powershell
# Run migration script
node scripts/migrate-schema.mjs
```

### Step 4: Verify

- [ ] All documents present
- [ ] All images accessible
- [ ] No broken references
- [ ] Preview working

---

## Schema Comparison

| Type | Current | Proposed | Action |
|------|---------|----------|--------|
| `heroSection` | Exists | Removed | DELETE (done) |
| `skillsTool` | Exists | Removed | DELETE (planned) |
| `customImage` | N/A | New | CREATE |
| `seoImage` | Exists | Removed | DELETE |
| `ogImage` | Exists | Removed | DELETE |
| `twitterImage` | Exists | Removed | DELETE |
| All others | Exists | Keep | NO CHANGE |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss during migration | High | Backup before any changes |
| Broken references | Medium | Verify after migration |
| Preview broken | Low | Test preview after changes |

---

## Commit Strategy

```
plan(sanity): add schema consolidation plan
schema(sanity): add customImage type
schema(sanity): remove old reference types
schema(sanity): update schemas to use customImage
```
