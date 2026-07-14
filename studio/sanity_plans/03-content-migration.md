# Content Migration Plan

> **Priority:** P1 — After schema consolidation  
> **Status:** Planning

---

## Goal

Migrate content safely between schema versions without data loss.

---

## Migration Types

### 1. Schema Migration

When schema types change, existing documents need updating.

**Example:** Adding a new required field

```typescript
// Before: no shortDescription
// After: shortDescription required for projects

// Migration: Set default value for existing documents
{
  _type: 'project',
  shortDescription: 'No description provided'
}
```

### 2. Data Migration

When data structure changes.

**Example:** Moving heroSection into profile

```typescript
// Before: heroSection and profile separate
// After: profile contains heroSection fields

// Migration: Merge data
{
  _id: 'profile',
  heroRoles: heroSection.roles,
  // ... other fields
}
```

### 3. Reference Migration

When reference types change.

**Example:** Replacing seoImage with customImage

```typescript
// Before: seoImage reference
// After: customImage inline

// Migration: Convert references
{
  seoImage: {
    _type: 'customImage',
    asset: {_ref: oldSeoImage.asset._ref},
    alt: oldSeoImage.alt,
  }
}
```

---

## Migration Scripts

### Script Structure

```
studio/
├── scripts/
│   ├── migrate/
│   │   ├── 001-hero-to-profile.mjs
│   │   ├── 002-add-short-description.mjs
│   │   ├── 003-convert-image-refs.mjs
│   │   └── migrate-all.mjs
│   ├── migrate-schema.mjs
│   └── rollback/
│       ├── 001-hero-to-profile.mjs
│       └── rollback-all.mjs
```

### Migration Script Template

```javascript
// scripts/migrate/001-hero-to-profile.mjs
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'nl0qw78w',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export default async function migrate() {
  console.log('Starting migration: heroSection → profile')
  
  // 1. Fetch existing data
  const hero = await client.fetch('*[_type == "heroSection"][0]')
  const profile = await client.fetch('*[_type == "profile"][0]')
  
  if (!hero) {
    console.log('No heroSection found, skipping migration')
    return
  }
  
  // 2. Transform data
  const updatedProfile = {
    ...profile,
    heroRoles: hero.roles || profile.heroRoles,
    // ... map other fields
  }
  
  // 3. Update document
  await client
    .patch(profile._id)
    .set(updatedProfile)
    .commit()
  
  console.log('Migration complete: heroSection → profile')
}

// Rollback function
export async function rollback() {
  console.log('Rolling back: heroSection → profile')
  // Restore original data from backup
}
```

### Run Migration

```powershell
# Run single migration
node scripts/migrate/001-hero-to-profile.mjs

# Run all migrations
node scripts/migrate/migrate-all.mjs

# Rollback
node scripts/rollback/rollback-all.mjs
```

---

## Content Inventory

### Critical Content (Must Preserve)

| Type | Fields | Migration Notes |
|------|--------|-----------------|
| `profile` | fullName, title, heroRoles, email, phone, location, education | Keep all fields |
| `aboutSection` | aboutContent, education | Portable Text format |
| `project` | title, slug, summary, technologies, highlights | Keep all fields |
| `experience` | title, company, startDate, endDate | Date format preserved |
| `certification` | title, issuer, issueDate, expiryDate | Date format preserved |

### Medium Priority Content

| Type | Fields | Migration Notes |
|------|--------|-----------------|
| `post` | title, slug, body, publishedAt | Portable Text format |
| `author` | name, slug | Keep references |
| `category` | title, slug | Keep references |

### Low Priority Content

| Type | Fields | Migration Notes |
|------|--------|-----------------|
| `membership` | organization, role | Keep as-is |
| `recommendation` | name, content | Keep as-is |
| `galleryImage` | image, caption | Image references |

---

## Migration Checklist

### Pre-Migration

- [ ] Backup complete (`data/exports/documents.ndjson`)
- [ ] Backup verified
- [ ] Schema changes tested locally
- [ ] Migration scripts tested

### During Migration

- [ ] Run migrations in order
- [ ] Monitor for errors
- [ ] Log all changes

### Post-Migration

- [ ] Verify document count matches
- [ ] Check critical documents
- [ ] Test preview
- [ ] Test Presentation tool
- [ ] Verify no broken references

---

## Error Handling

### If Migration Fails

1. Stop migration
2. Check error logs
3. Fix issue in migration script
4. Rollback if needed
5. Re-run migration

### Rollback Strategy

```powershell
# Restore from backup
node scripts/restore.mjs

# Or rollback specific migration
node scripts/rollback/001-hero-to-profile.mjs
```

---

## Timing

| Step | Duration | Notes |
|------|----------|-------|
| Pre-migration checks | ~5min | Verify backup |
| Run migrations | ~1-5min | Depends on data |
| Post-migration verification | ~5min | Manual checks |
| **Total** | **~10-15min** | |

---

## Commit Strategy

```
plan(sanity): add content migration plan
migrate(sanity): add migration script templates
migrate(sanity): add rollback scripts
```
