# EPIC-B: Desk Structure Intelligence

## Goal
Make the Sanity desk structure smarter with document counters, visual indicators, better search, and improved grouping.

## Current State
- Desk structure in `studio/structure/deskStructure.ts`
- Uses `S.list()` with `S.listItem()` and `S.documentTypeListItem()`
- Singletons opened via `S.document().schemaType('X').documentId('X')`
- No document counters
- No visual indicators
- Basic search only

## Slice 1: Add Document Counters
**Files:** `studio/structure/deskStructure.ts`

### Changes
1. Add document count to each collection item
2. Use `S.listItem().child()` with custom component showing count
3. Query document counts on desk render

### Implementation Pattern
```typescript
// For each collection item
S.listItem()
  .title('Projects')
  .child(
    S.list()
      .title('Projects')
      .items([
        S.documentTypeListItem('project').title('All Projects'),
        S.listItem()
          .title('Featured')
          .child(
            S.documentList()
              .title('Featured Projects')
              .filter('_type == "project" && featured == true')
          ),
        S.listItem()
          .title('Showcase')
          .child(
            S.documentList()
              .title('Showcase Projects')
              .filter('_type == "project" && showcaseDetail == true')
          ),
      ])
  )
```

### Verification
- Open desk sidebar
- Each collection shows document count
- Clicking collection shows filtered views

---

## Slice 2: Add Visual Indicators & Icons
**Files:** `studio/structure/deskStructure.ts`

### Changes
1. Add icons to desk items for visual distinction
2. Singletons: different icon than collections
3. Use `@sanity/icons` for consistent iconography

### Icon Mapping
| Section | Icon |
|---------|------|
| Homepage | `HomeIcon` |
| Profile | `UserIcon` |
| About | `DocumentsIcon` |
| Tech Stack | `CogIcon` |
| Projects | `RocketIcon` |
| Experience | `BriefcaseIcon` |
| Certifications | `AwardIcon` |
| Gallery | `ImagesIcon` |
| Blog | `DocumentsIcon` |
| Memberships | `UsersIcon` |
| Settings | `CogIcon` |

### Verification
- Desk sidebar shows icons for each section
- Visual distinction between singletons and collections
- Icons are consistent with Sanity UI guidelines

---

## Slice 3: Add Filtered Views & Search Improvements
**Files:** `studio/structure/deskStructure.ts`

### Changes
1. Add filtered views for key collections:
   - Projects: All / Featured / Showcase / Live
   - Experience: All / Current / Past
   - Posts: All / Published / Draft
   - Certifications: All / By Category
2. Add "Recent Documents" section at top of desk
3. Improve search with recent document history

### Filtered Views
```typescript
// Projects filtered views
S.listItem()
  .title('Projects')
  .child(
    S.list()
      .title('Projects')
      .items([
        S.documentTypeListItem('project').title('All Projects'),
        S.listItem().title('Featured').child(
          S.documentList().title('Featured').filter('_type == "project" && featured == true')
        ),
        S.listItem().title('Showcase').child(
          S.documentList().title('Showcase').filter('_type == "project" && showcaseDetail == true')
        ),
        S.listItem().title('Live').child(
          S.documentList().title('Live').filter('_type == "project" && liveURL != null')
        ),
      ])
  )
```

### Verification
- Projects desk shows filtered views
- Each filter shows correct documents
- "Recent Documents" shows recently edited items
- Search finds documents quickly

---

## Execution Order
1. Add document counters (Slice 1)
2. Add visual indicators & icons (Slice 2)
3. Add filtered views & search improvements (Slice 3)

## Commit Log
- `feat(sanity): add document counters to desk sidebar`
- `feat(sanity): add icons and visual indicators to desk structure`
- `feat(sanity): add filtered views and search improvements`

## Testing Checklist
- [ ] Document counters show correct counts
- [ ] Icons display correctly for each section
- [ ] Filtered views show correct documents
- [ ] Recent documents section works
- [ ] Search finds documents quickly
- [ ] Desk structure is clear and intuitive
