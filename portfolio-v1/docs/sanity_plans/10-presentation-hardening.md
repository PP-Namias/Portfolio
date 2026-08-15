# EPIC-A: Presentation Tool Hardening

## Goal
Ensure the Sanity Presentation tool works flawlessly — login, draft mode, preview locations, and custom navigator all verified and polished.

## Current State
- `presentationTool` from `sanity/presentation` is configured in `studio/sanity.config.ts`
- Preview URL: `NEXT_PUBLIC_SITE_URL` (defaults to `https://namias.tech`)
- Draft mode: `/api/draft-mode/enable` with optional secret
- Custom navigator: `PresentationNavigator.tsx` with quick-launch items
- 12 preview locations defined in `studio/preview/previewLocations.ts`
- Login required at `localhost:3333/presentation`

## Issues Found
1. **PresentationNavigator still references `heroSection`** — line 7: `{id: 'heroSection', title: 'Hero Section', ...}` — heroSection was removed in EPIC-1
2. **Missing preview locations** — `seoSettings` and `mediaSettings` are previewable but have no preview location
3. **"Browse skills" link in navigator** — line 129: links to `/studio/skills` which no longer exists
4. **No error handling** — if draft mode fails, user sees blank page
5. **No loading state** — iframe shows blank while draft mode activates

## Slice 1: Fix PresentationNavigator
**Files:** `studio/presentation/PresentationNavigator.tsx`

### Changes
1. Remove `heroSection` from `QUICK_LAUNCH` array
2. Add `profile` to `QUICK_LAUNCH` (it's the main singleton now)
3. Remove "Browse skills" card (skills plugin removed)
4. Add "Content Health" link instead
5. Add "Saved Queries" quick link

### New QUICK_LAUNCH
```typescript
const QUICK_LAUNCH = [
  {id: 'profileSingleton', title: 'Hero & Profile', subtitle: 'Name, title, roles', type: 'profile'},
  {id: 'aboutSectionSingleton', title: 'About Section', subtitle: 'Bio, education', type: 'aboutSection'},
  {id: 'siteSettingsSingleton', title: 'Site Settings', subtitle: 'Title, og, robots', type: 'siteSettings'},
  {id: 'post', title: 'Posts', subtitle: 'Blog content', type: 'post'},
] as const
```

### Verification
- Open `localhost:3333/presentation`
- Login with GitHub
- Verify quick-launch shows correct items
- Click each item — should open correct document in desk

---

## Slice 2: Add Missing Preview Locations
**Files:** `studio/preview/previewLocations.ts`

### Changes
1. Add `seoSettings` preview location → `/` (affects homepage meta)
2. Add `mediaSettings` preview location → `/` (affects media handling)

### New Preview Locations
```typescript
seoSettings: defineLocations({
  pathname: '/',
  message: 'SEO settings affect the homepage meta tags',
}),
mediaSettings: defineLocations({
  pathname: '/',
  message: 'Media settings affect image handling',
}),
```

### Verification
- Open Presentation tool
- Select "SEO Settings" document
- Preview iframe should load homepage
- Select "Media Settings" document
- Preview iframe should load homepage

---

## Slice 3: Verify Draft Mode & Error Handling
**Files:** `src/app/api/draft-mode/enable/route.ts`, `studio/presentation/PresentationNavigator.tsx`

### Changes
1. Test draft mode enable endpoint with valid secret
2. Test draft mode enable endpoint with invalid secret (should fail gracefully)
3. Add error boundary to Presentation tool iframe
4. Add loading indicator while draft mode activates
5. Verify `/api/draft-mode/enable?probe=1` returns correct status

### Verification
- Open Presentation tool
- Select any document
- Preview iframe should load with draft mode enabled
- Edit document in desk — changes should appear in preview within ~500ms
- Publish document — preview should update

---

## Execution Order
1. Fix PresentationNavigator (Slice 1)
2. Add missing preview locations (Slice 2)
3. Verify draft mode & error handling (Slice 3)

## Commit Log
- `fix(sanity): update PresentationNavigator — remove heroSection, remove skills link`
- `feat(sanity): add missing preview locations for seoSettings and mediaSettings`
- `fix(sanity): verify draft mode and add error handling for Presentation tool`

## Testing Checklist
- [ ] Login to `localhost:3333/presentation` works
- [ ] Quick-launch items are correct
- [ ] Clicking quick-launch opens correct document
- [ ] Preview iframe loads for all document types
- [ ] Draft mode enables successfully
- [ ] Edits appear in preview within ~500ms
- [ ] Publish updates preview
- [ ] Error handling works (invalid secret, network issues)
