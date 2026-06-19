# EPIC-G: Onboarding & Welcome Polish

## Goal
Polish the onboarding flow and welcome page: better guidance, progress tracking, and contextual help.

## Current State
- 5-step onboarding in `studio/components/Onboarding.tsx`
- Custom Welcome component in `studio/components/Welcome.tsx`
- Basic quick actions on welcome page
- No progress tracking
- No contextual help

## Slice 1: Enhanced Onboarding Flow
**Files:** `studio/components/Onboarding.tsx`

### Changes
1. Add progress indicator (step 1/5, 2/5, etc.)
2. Add completion checkmarks for completed steps
3. Add "Skip Tour" option
4. Add "Restart Tour" option
5. Show estimated time to complete

### Onboarding Steps
```
Step 1/5: Edit Your Profile          ✓ Completed
Step 2/5: Write About Yourself       ← Current
Step 3/5: Add Your First Project     ○ Pending
Step 4/5: Add a Certification        ○ Pending
Step 5/5: Publish & Go Live          ○ Pending

[Skip Tour] [Restart Tour] [Next →]

Estimated time: 5 minutes
```

### Verification
- Open studio for first time
- Onboarding shows progress indicator
- Can skip or restart tour
- Completion checkmarks work

---

## Slice 2: Welcome Page Content Completion
**Files:** `studio/components/Welcome.tsx`

### Changes
1. Add content completion status for each section
2. Show progress bars for incomplete sections
3. Add "Quick Add" buttons for missing content
4. Show recent activity

### Welcome Page Layout
```
Welcome back, Keneth! 👋
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Completion
• Profile: 100% ✓
• About Section: 85% — Add education image
• Projects: 90% — 2 missing images
• Certifications: 100% ✓
• Blog Posts: 60% — 3 drafts

Quick Actions
[New Project] [New Post] [New Certification]
[Open Presentation] [Saved Queries] [Content Health]

Recent Activity
• Updated "CaseMaster" project (2 hours ago)
• Published "Hello World" blog post (1 day ago)
```

### Verification
- Welcome page shows completion status
- Progress bars reflect actual data
- Quick actions work correctly
- Recent activity shows correct items

---

## Execution Order
1. Enhanced onboarding flow (Slice 1)
2. Welcome page content completion (Slice 2)

## Commit Log
- `feat(sanity): enhance onboarding with progress tracking and skip/restart`
- `feat(sanity): add content completion status to Welcome page`

## Testing Checklist
- [ ] Progress indicator shows correct step
- [ ] Completion checkmarks work
- [ ] Skip/restart tour options work
- [ ] Content completion percentages are accurate
- [ ] Quick actions navigate correctly
- [ ] Recent activity shows correct items
