# EPIC-1: Schema Consolidation

## Goal
Merge `heroSection` + `profile` into a single `profile` singleton. Remove `heroSection` schema. Keep all existing data via migration.

## Why

Currently two singletons hold overlapping data:
- `heroSection`: fullName, title, heroRoles, location, availabilityLabel, contactEmail, resumeUrl, profileImage, socialLinks
- `profile`: fullName, title, email, phone, location, github, linkedin, summary, avatar, availabilityLabel, resumeUrl, highlights, education

The frontend reads from **both**:
- `HeroSection.tsx` reads from `heroSection`
- `AboutSection.tsx` reads from `aboutSection`
- `Footer.tsx` reads from `heroSection` (for email)

After consolidation, everything reads from `profile`.

## Schema Changes

### profile (modified)

Add these fields from heroSection:
- `heroRoles` (array of strings) — already exists in heroSection
- `socialLinks` (array of objects with platform, icon, url, whatsappNumber, placements) — already exists in heroSection
- `profileImage` (image with alt) — merge with existing `avatar` field, keep both for backward compat, mark `avatar` as hidden/legacy

Rename for clarity:
- `email` stays as `email`
- `contactEmail` from heroSection is redundant — migrate value to `email` if different

Keep hidden but preserved (for migration safety):
- `avatar` (hidden, use `profileImage` going forward)

### heroSection (removed)

Delete the schema entirely. All its data is migrated to `profile`.

## Field Migration Map

| heroSection Field | profile Field | Action |
|---|---|---|
| `fullName` | `fullName` | Overwrite if profile is empty, skip if both have values |
| `title` | `title` | Overwrite if profile is empty, skip if both have values |
| `heroRoles` | `heroRoles` | Copy (profile doesn't have this) |
| `location` | `location` | Overwrite if profile is empty |
| `availabilityLabel` | `availabilityLabel` | Overwrite if profile is empty |
| `contactEmail` | `email` | Use heroSection value if profile.email is empty |
| `resumeUrl` | `resumeUrl` | Overwrite if profile is empty |
| `profileImage` | `profileImage` | Copy (profile doesn't have this) |
| `socialLinks` | `socialLinks` | Copy (profile doesn't have this) |

## Migration Script: `merge-hero-profile.ts`

```typescript
// Pseudocode
1. Fetch heroSection singleton
2. Fetch profile singleton
3. For each field in migration map:
   - If profile field is empty/undefined AND heroSection field has value -> copy
   - If both have values -> keep profile value, log conflict
4. Write updated profile
5. Delete heroSection document (or mark as archived)
6. Verify: re-fetch profile, confirm all fields present
```

## Desk Structure Changes

Before:
```
Content > Pages > Homepage
  Hero Section (singleton)    <- REMOVE
  About Section (singleton)
  Tech Stack (singleton)
  ...
```

After:
```
Content > Pages > Homepage
  Profile (singleton)         <- RENAMED to "Hero & Profile"
  About Section (singleton)
  Tech Stack (singleton)
  ...
```

The deskStructure.ts file needs:
1. Remove the `heroSection` list item
2. Rename `profile` to "Hero & Profile" or keep as "Profile"
3. Move socialLinks, heroRoles into the profile's field groups

## Preview Location Changes

| Schema | Before URL | After URL |
|---|---|---|
| `heroSection` | `/` | REMOVED |
| `profile` | `/#experience` | `/` (homepage) |

Update `studio/preview/previewLocations.ts`:
- Remove heroSection entry
- Update profile entry to point to `/`

## Frontend Component Changes

### Files that read from heroSection:

1. `src/components/sections/HeroSection.tsx`
   - Change: `useCmsContent('heroSection')` -> `useCmsContent('profile')`
   - Map fields: `data.fullName`, `data.title`, `data.heroRoles`, `data.profileImage`

2. `src/components/layout/Footer.tsx`
   - Change: `useCmsContent('heroSection')` -> `useCmsContent('profile')`
   - Map fields: `data.email` (was `data.contactEmail`)

3. `src/app/layout.tsx`
   - Remove `heroSection` from the GROQ query
   - Add fields to profile query

4. `src/lib/cms-content.server.ts`
   - Remove `heroSection` from `fetchCmsContent()`
   - Remove `heroSection` type from `CmsContent` interface
   - Update profile mapping

5. `src/lib/cms-content.shared.ts`
   - Update fallback data: merge heroSection defaults into profile

## Execution Order

1. Create migration script (EPIC-3 covers this in detail)
2. Run migration in dry-run mode
3. Update profile schema (add heroRoles, socialLinks, profileImage)
4. Run migration for real
5. Update frontend components
6. Update desk structure
7. Update preview locations
8. Remove heroSection schema
9. Test: `tsc --noEmit`, `npm run lint`, `npx vitest run`
10. Verify live site renders correctly

## Rollback Plan

If something breaks:
1. Re-create heroSection schema
2. Re-run migration in reverse (copy profile fields back to heroSection)
3. Revert frontend components
4. Revert desk structure

The migration script will support `--rollback` flag.

## Commit Log
- `feat(sanity): add heroRoles and socialLinks to profile schema`
- `feat(sanity): add migration script for heroSection -> profile merge`
- `feat(sanity): update desk structure to remove heroSection`
- `feat(sanity): remove heroSection schema after successful migration`
