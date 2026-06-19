# EPIC-3: Migration Scripts

## Goal
Create idempotent, dry-runnable, rollback-capable migration scripts for all Sanity schema changes. Each script logs what it does, can be previewed before execution, and can be reversed.

## Directory Structure

```
scripts/sanity-migrate/
  runner.ts              <- Migration runner framework
  merge-hero-profile.ts  <- Merge heroSection into profile
  cleanup-duplicates.ts  <- Case-insensitive project dedup
  enrich-about.ts        <- Enrich about section data
  seed-missing.ts        <- Seed missing singletons
  validate.ts            <- Post-migration validation
  rollback.ts            <- Rollback framework
  README.md              <- How to use
```

## Runner Framework (`runner.ts`)

### Features
- **Dry run mode**: `--dry-run` flag shows what would happen without writing
- **Verbose logging**: `--verbose` flag shows field-level details
- **Idempotent**: Running twice produces the same result
- **Atomic**: Each migration is a single Sanity transaction
- **Rollback**: Each migration records what it changed for reversal

### Usage

```bash
# Preview what would happen
npx tsx scripts/sanity-migrate/runner.ts --dry-run

# Run all migrations
npx tsx scripts/sanity-migrate/runner.ts

# Run specific migration
npx tsx scripts/sanity-migrate/runner.ts --only merge-hero-profile

# Rollback last migration
npx tsx scripts/sanity-migrate/runner.ts --rollback

# Validate after migration
npx tsx scripts/sanity-migrate/runner.ts --validate-only
```

### Migration Interface

```typescript
interface Migration {
  name: string;
  description: string;
  up: (client: SanityClient, dryRun: boolean) => Promise<MigrationResult>;
  down: (client: SanityClient, dryRun: boolean) => Promise<MigrationResult>;
}

interface MigrationResult {
  success: boolean;
  documentsAffected: number;
  changes: Array<{
    documentId: string;
    action: 'create' | 'update' | 'delete';
    field?: string;
    oldValue?: any;
    newValue?: any;
  }>;
  errors: string[];
}
```

## Migration 1: `merge-hero-profile.ts`

### What it does
1. Fetches `heroSection` singleton
2. Fetches `profile` singleton
3. For each overlapping field, copies heroSection value to profile if profile field is empty
4. Copies heroRoles, socialLinks, profileImage from heroSection to profile
5. Deletes heroSection document (or archives it)
6. Returns list of all changes

### Field mapping

| heroSection | profile | Strategy |
|---|---|---|
| `fullName` | `fullName` | Copy if profile empty |
| `title` | `title` | Copy if profile empty |
| `heroRoles` | `heroRoles` | Copy (new field in profile) |
| `location` | `location` | Copy if profile empty |
| `availabilityLabel` | `availabilityLabel` | Copy if profile empty |
| `contactEmail` | `email` | Copy if profile.email empty |
| `resumeUrl` | `resumeUrl` | Copy if profile empty |
| `profileImage` | `profileImage` | Copy (new field in profile) |
| `socialLinks` | `socialLinks` | Copy (new field in profile) |

### Dry run output example

```
[MERGE-HERO-PROFILE] Dry Run Mode
─────────────────────────────────
Fetching heroSection... found
Fetching profile... found

Field conflicts (profile wins):
  - fullName: heroSection="Namias" profile="Namias" -> KEEP profile
  - title: heroSection="Software Engineer" profile="Software Engineer" -> KEEP profile

Fields to copy from heroSection:
  - heroRoles: ["Full-Stack Developer", "AI Specialist"] -> profile.heroRoles
  - socialLinks: [3 items] -> profile.socialLinks
  - profileImage: image -> profile.profileImage

英雄Section document will be DELETED after migration.

Summary: 3 fields copied, 2 conflicts (profile wins), 1 document deleted
```

## Migration 2: `cleanup-duplicates.ts`

### What it does
1. Fetches all project documents
2. Groups by normalized slug (lowercase, trimmed)
3. For duplicates, keeps the one with more data (more fields populated)
4. Deletes or archives the less-complete duplicate
5. Updates the kept document's slug to the canonical form

### Duplicate detection

```typescript
function normalizeSlug(slug: string): string {
  return (slug || '').trim().toLowerCase()
}

// Current dedup in cms-content.server.ts handles this at read time
// This migration makes it permanent at the data level
```

### Dry run output example

```
[CLEANUP-DUPLICATES] Dry Run Mode
─────────────────────────────────
Fetching all projects... found 18

Duplicate groups:
  - "klaro" / "Klaro" -> KEEP "Klaro" (12 fields), DELETE "klaro" (8 fields)
  - "nexus-hrms" / "Nexus-HRMS" -> KEEP "nexus-hrms" (15 fields), UPDATE slug

Summary: 2 duplicate groups, 2 documents to delete, 1 slug to normalize
```

## Migration 3: `enrich-about.ts`

### What it does
1. Fetches `aboutSection` singleton
2. Checks if `aboutContent` (Portable Text) has data
3. If empty, migrates from `aboutParagraphs` (legacy text array) to Portable Text
4. Ensures education object has highlights array (not just gpa)
5. Adds missing highlight badges

### Migration path

```
aboutParagraphs (legacy) -> aboutContent (Portable Text)
["Paragraph 1", "Paragraph 2"] -> [{_type: "block", children: [{_type: "span", text: "Paragraph 1"}]}, ...]
```

## Migration 4: `seed-missing.ts`

### What it does
1. Checks for each required singleton (profile, aboutSection, siteSettings, etc.)
2. If any are missing, creates them with sensible defaults
3. Logs what was created

### Default values

```typescript
const defaults = {
  profile: {
    fullName: 'Namias',
    title: 'Software Engineer',
    email: 'contact@namias.tech',
    availabilityLabel: 'Available',
  },
  aboutSection: {
    aboutContent: [],
    education: {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Caloocan City',
      location: 'Caloocan City, Metro Manila',
      period: '2022 – 2026',
      highlights: ['Cum Laude', "Dean's Lister"],
    },
  },
  siteSettings: {
    siteName: 'Namias Portfolio',
    contactEmail: 'contact@namias.tech',
  },
}
```

## Validation Script (`validate.ts`)

### Checks

1. **Singleton count**: Each singleton type should have exactly 1 document
2. **Required fields**: All required fields are populated
3. **Reference integrity**: All referenced documents exist
4. **Slug uniqueness**: All slugs are unique (case-insensitive)
5. **Image alt text**: All images have alt text
6. **URL format**: All URLs use https
7. **Date ordering**: Start dates before end dates

### Output

```
[VALIDATE] Post-Migration Validation
─────────────────────────────────────
✓ Singletons: 8/8 present
✓ Required fields: 45/45 populated
✓ References: 12/12 valid
✓ Slugs: 18/18 unique
✓ Images: 8/8 have alt text
✓ URLs: 15/15 use HTTPS
✓ Dates: 5/5 properly ordered

All checks passed!
```

## Rollback Framework (`rollback.ts`)

### How it works
Each migration records its changes in a `migrationLog` document:

```json
{
  "_type": "migrationLog",
  "_id": "migration-merge-hero-profile-20260612",
  "migration": "merge-hero-profile",
  "executedAt": "2026-06-12T16:00:00Z",
  "changes": [
    {
      "documentId": "profile",
      "action": "update",
      "field": "heroRoles",
      "oldValue": undefined,
      "newValue": ["Full-Stack Developer"]
    }
  ]
}
```

### Rollback execution

```bash
# Rollback the last migration
npx tsx scripts/sanity-migrate/rollback.ts --migration merge-hero-profile
```

The rollback script:
1. Reads the migration log
2. Reverses each change (update restores oldValue, delete re-creates, etc.
3. Deletes the migration log
4. Validates the rollback worked

## Execution Order

1. Create `scripts/sanity-migrate/` directory
2. Write `runner.ts` (framework)
3. Write `merge-hero-profile.ts` (EPIC-1 migration)
4. Write `cleanup-duplicates.ts` (existing dedup made permanent)
5. Write `enrich-about.ts` (about section cleanup)
6. Write `seed-missing.ts` (ensure all singletons exist)
7. Write `validate.ts` (post-migration checks)
8. Write `rollback.ts` (reversal framework)
9. Write `README.md` (usage instructions)
10. Test each migration in dry-run mode
11. Run all migrations
12. Validate

## Commit Log
- `feat(sanity-migrate): add migration runner framework`
- `feat(sanity-migrate): add merge-hero-profile migration`
- `feat(sanity-migrate): add cleanup-duplicates migration`
- `feat(sanity-migrate): add enrich-about migration`
- `feat(sanity-migrate): add seed-missing and validate scripts`
- `feat(sanity-migrate): add rollback framework`
