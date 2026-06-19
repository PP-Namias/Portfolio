# EPIC-4: Presentation & UX Upgrade

## Goal
Improve the Sanity Studio user experience: better desk structure, improved presentation tool integration, polished onboarding, and a content health dashboard.

## 1. Desk Structure Improvements

### Current Structure
```
Content
  Pages
    Homepage
      Hero Section (singleton)     <- will be removed (merged into Profile)
      About Section (singleton)
      Tech Stack (singleton)
      Projects (collection list)
      Experience (collection list)
      Certifications (collection list)
      Gallery (collection list)
      Resume (collection list)
    Blog
      Posts (collection list)
      Authors (collection list)
      Categories (collection list)
    Profile
      Profile (singleton)          <- will be renamed/expanded
      Memberships (collection list)
      Recommendations (collection list)
  Settings
    Site Settings (singleton)
    SEO Settings (singleton)
    Media Settings (singleton)
  Reference Data
    Certification Categories
    Certification Issuers
    Gallery Categories
  Quick Start
    ...
```

### Proposed Structure
```
Content
  Homepage
    Hero & Profile (singleton)     <- merged from heroSection + profile
    About Section (singleton)
    Tech Stack (singleton)
  Collections
    Projects                       <- top-level, not nested under Pages
    Experience
    Certifications
    Gallery
    Resume
  Blog
    Posts
    Authors
    Categories
  Community
    Memberships
    Recommendations
  Settings
    Site Settings
    SEO Settings
    Media Settings
  Reference Data
    Certification Categories
    Certification Issuers
    Gallery Categories
```

### Changes
1. **Remove "Pages" wrapper** — Homepage is now a direct child of Content
2. **Remove "Hero Section"** — merged into Profile
3. **Rename "Profile" to "Hero & Profile"** — or just "Profile" (it's the main identity)
4. **Move Collections to top level** — Projects, Experience, etc. are not "pages", they're collections
5. **Move Memberships/Recommendations under "Community"** — logical grouping
6. **Keep Quick Start** — but update items (remove New Hero Section, add New Gallery Image)

### Implementation

```typescript
// studio/structure/deskStructure.ts

export const deskStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Homepage
      S.listItem()
        .title('Homepage')
        .child(
          S.list()
            .title('Homepage')
            .items([
              S.listItem().title('Hero & Profile').child(S.document().schemaType('profile').documentId('profileSingleton')),
              S.listItem().title('About Section').child(S.document().schemaType('aboutSection').documentId('aboutSectionSingleton')),
              S.listItem().title('Tech Stack').child(S.document().schemaType('techStack').documentId('techStackSingleton')),
            ])
        ),

      // Collections
      S.listItem()
        .title('Collections')
        .child(
          S.list()
            .title('Collections')
            .items([
              S.documentTypeListItem('project').title('Projects'),
              S.documentTypeListItem('experience').title('Experience'),
              S.documentTypeListItem('certification').title('Certifications'),
              S.documentTypeListItem('galleryImage').title('Gallery'),
              S.documentTypeListItem('resume').title('Resume'),
            ])
        ),

      // Blog
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('author').title('Authors'),
              S.documentTypeListItem('category').title('Categories'),
            ])
        ),

      // Community
      S.listItem()
        .title('Community')
        .child(
          S.list()
            .title('Community')
            .items([
              S.documentTypeListItem('membership').title('Memberships'),
              S.documentTypeListItem('recommendation').title('Recommendations'),
            ])
        ),

      // Settings
      S.divider(),
      S.listItem().title('Site Settings').child(S.document().schemaType('siteSettings').documentId('siteSettingsSingleton')),
      S.listItem().title('SEO Settings').child(S.document().schemaType('seoSettings').documentId('seoSettingsSingleton')),
      S.listItem().title('Media Settings').child(S.document().schemaType('mediaSettings').documentId('mediaSettingsSingleton')),

      // Reference Data
      S.divider(),
      S.listItem()
        .title('Reference Data')
        .child(
          S.list()
            .title('Reference Data')
            .items([
              S.documentTypeListItem('certificationCategory').title('Certification Categories'),
              S.documentTypeListItem('certificationIssuer').title('Certification Issuers'),
              S.documentTypeListItem('galleryCategory').title('Gallery Categories'),
            ])
        ),
    ])
```

## 2. Presentation Tool Improvements

### Current Preview Locations

| Schema | URL |
|---|---|
| heroSection | `/` |
| aboutSection | `/` |
| profile | `/#experience` |
| siteSettings | `/` |
| techStack | `/` |
| experience | `/#experience` |
| project | `/projects` + `/projects/[slug]` |
| certification | `/#certifications` |
| galleryImage | `/#gallery` |
| membership | `/#memberships` |
| recommendation | `/#recommendations` |
| resume | `/resume` |
| post | `/blog` + `/blog/[slug]` |

### Proposed Preview Locations (after heroSection removal)

| Schema | URL | Notes |
|---|---|---|
| profile | `/` | Was heroSection |
| aboutSection | `/` | Same |
| siteSettings | `/` | Same |
| techStack | `/` | Same |
| experience | `/#experience` | Same |
| project | `/projects` + `/projects/[slug]` | Same |
| certification | `/#certifications` | Same |
| galleryImage | `/#gallery` | Same |
| membership | `/#memberships` | Same |
| recommendation | `/#recommendations` | Same |
| resume | `/resume` | Same |
| post | `/blog` + `/blog/[slug]` | Same |

### Presentation Navigator Updates

Update `studio/presentation/PresentationNavigator.tsx`:
- Remove "Hero Section" link
- Rename "Profile" to "Hero & Profile"
- Add direct links to key sections

## 3. Onboarding Flow Update

### Current Steps (4)
1. Edit Hero
2. Add Project
3. Add Certification
4. Publish

### Proposed Steps (5)
1. Edit Profile (was "Edit Hero")
2. Write About (new — links to aboutSection)
3. Add Project
4. Add Certification
5. Publish

### Update `studio/components/Onboarding.tsx`
- Step 1: Change title to "Edit Your Profile", link to profile singleton
- Step 2: Add "Write About Yourself" step, link to aboutSection singleton
- Steps 3-5: Keep as-is

## 4. Content Health Dashboard

### Current Inspectors
- `SeoPreview.tsx` — Google SERP preview, social card preview
- `ContentHealth.tsx` — word count, alt text, broken references, last-edited

### Proposed Enhancements

#### ContentHealth.tsx additions
1. **Schema completeness check**: Show which fields are empty vs populated for the current document
2. **Cross-document health**: Show orphaned references, missing backlinks
3. **Freshness timeline**: Visual timeline of when documents were last edited
4. **Quick actions**: One-click to fix common issues (add alt text, fill required fields)

#### New Inspector: Data Consistency
- Check for duplicate project titles (case-insensitive)
- Check for duplicate certification titles
- Check for orphaned gallery images (no category)
- Check for posts without author

## 5. Welcome Page Update

### Current Quick Actions (6)
1. New project
2. New post
3. New certification
4. Browse Skills — REMOVE
5. Open Presentation
6. Saved Queries

### Proposed Quick Actions (5 + new)
1. New project
2. New post
3. New certification
4. Open Presentation
5. Saved Queries
6. Content Health — NEW (links to health inspector)

### Update `studio/components/Welcome.tsx`
- Remove "Browse Skills" card
- Add "Content Health" card with icon and description

## Execution Order

1. Update desk structure (remove heroSection, reorganize)
2. Update preview locations
3. Update Presentation Navigator
4. Update Onboarding steps
5. Update Welcome page
6. Enhance ContentHealth inspector
7. Test studio builds and renders
8. Commit

## Commit Log
- `feat(sanity): restructure desk for clearer information architecture`
- `feat(sanity): update preview locations after heroSection removal`
- `feat(sanity): update onboarding flow with new steps`
- `feat(sanity): update Welcome page with Content Health action`
- `feat(sanity): enhance ContentHealth inspector`
