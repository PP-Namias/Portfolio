# EPIC-H: Automation & Smart Workflows

## Goal
Add automated workflows: content scheduling, publish reminders, and smart notifications.

## Current State
- Manual publish workflow
- No content scheduling
- No publish reminders
- No smart notifications
- No bulk actions

## Slice 1: Content Scheduling
**Files:** `studio/schemaTypes/*.ts`, `studio/actions/scheduleAction.tsx`

### Changes
1. Add `scheduledAt` field to project, post, certification schemas
2. Create schedule action that sets publish date
3. Show scheduled date in document badges
4. Add "Scheduled" filter in desk

### Schedule Action
```typescript
// When user clicks "Schedule"
// 1. Open date picker
// 2. Set scheduledAt field
// 3. Document remains draft until scheduled date
// 4. Webhook triggers publish on scheduled date
```

### Verification
- Open project
- Click "Schedule" action
- Pick date and time
- Document shows "Scheduled for Jan 15, 2026"
- Document appears in "Scheduled" filter

---

## Slice 2: Publish Reminders
**Files:** `studio/inspectors/PublishReminder.tsx`

### Changes
1. Show reminder for drafts older than 7 days
2. Show reminder for documents without publish date
3. Show reminder for stale content (not updated in 30+ days)
4. Add "Mark as Reviewed" action

### Reminder Levels
| Age | Reminder | Color |
|-----|----------|-------|
| 0-7 days | None | — |
| 8-14 days | Gentle reminder | Yellow |
| 15-30 days | Strong reminder | Orange |
| 30+ days | Urgent reminder | Red |

### Verification
- Open draft older than 7 days
- Publish reminder shows
- Can dismiss reminder
- Reminder reappears after 24 hours

---

## Slice 3: Bulk Actions
**Files:** `studio/actions/bulkActions.tsx`

### Changes
1. Add "Publish All Drafts" action for collections
2. Add "Archive Old Projects" action
3. Add "Update Category" bulk action
4. Add "Export to JSON" action

### Bulk Actions
```
Bulk Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Publish All Drafts] [Archive Old]
[Update Category] [Export JSON]
```

### Verification
- Open collection list
- Click "Bulk Actions"
- Select action
- Confirm action
- All selected documents updated

---

## Execution Order
1. Content scheduling (Slice 1)
2. Publish reminders (Slice 2)
3. Bulk actions (Slice 3)

## Commit Log
- `feat(sanity): add content scheduling with date picker`
- `feat(sanity): add publish reminders for stale content`
- `feat(sanity): add bulk actions for collections`

## Testing Checklist
- [ ] Content scheduling works
- [ ] Scheduled date shows in badges
- [ ] Publish reminders appear for stale content
- [ ] Bulk actions work correctly
- [ ] Export to JSON works
- [ ] Performance is acceptable for bulk operations
