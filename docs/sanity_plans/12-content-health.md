# EPIC-C: Content Health Dashboard

## Goal
Build a comprehensive content health dashboard that shows field completeness, cross-document health, freshness tracking, and actionable recommendations.

## Current State
- `ContentHealth.tsx` inspector exists with basic word count and alt text checks
- `SeoPreview.tsx` inspector shows Google SERP preview
- No cross-document health checking
- No freshness tracking
- No actionable recommendations

## Slice 1: Enhanced Field Completeness Inspector
**Files:** `studio/inspectors/ContentHealth.tsx`

### Changes
1. Add field completeness calculator for current document
2. Show which fields are empty vs populated
3. Calculate completion percentage
4. Show visual progress bar

### UI Layout
```
Content Health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: Project "CaseMaster"
Completion: 85% ████████░░

✓ Title          ✓ Description
✓ Category       ✓ Technologies
✓ Year           ✗ Image
✓ Live URL       ✗ Gallery
✓ Highlights     ✓ Tags
```

### Verification
- Open any document in desk
- Click "Content Health" inspector
- Shows field completeness for that document
- Empty fields shown in red, populated in green

---

## Slice 2: Cross-Document Health Checker
**Files:** `studio/inspectors/ContentHealth.tsx`

### Changes
1. Check for orphaned references (experience with no related projects)
2. Check for missing required cross-references
3. Check for duplicate content across documents
4. Show health score per document type

### Checks
| Check | Severity | Description |
|-------|----------|-------------|
| Missing image | warning | Project has no image |
| Missing alt text | warning | Image has no alt text |
| Empty technologies | warning | Experience has no technologies |
| Duplicate title | error | Two projects have same title |
| Missing slug | error | Blog post has no slug |
| Broken reference | error | Reference points to deleted document |

### Verification
- Open Content Health inspector
- Shows cross-document health issues
- Each issue has severity level
- Clicking issue navigates to affected document

---

## Slice 3: Freshness Timeline
**Files:** `studio/inspectors/ContentHealth.tsx`

### Changes
1. Show when document was last edited
2. Show when document was last published
3. Calculate "freshness" score (days since last edit)
4. Show visual timeline indicator

### Freshness Levels
| Days Since Edit | Level | Color |
|-----------------|-------|-------|
| 0-7 | Fresh | Green |
| 8-30 | Recent | Yellow |
| 31-90 | Aging | Orange |
| 90+ | Stale | Red |

### Verification
- Open Content Health inspector
- Shows last edited date
- Shows freshness level with color
- Stale documents highlighted

---

## Slice 4: Quick-Fix Actions
**Files:** `studio/inspectors/ContentHealth.tsx`

### Changes
1. Add one-click fix for common issues
2. "Add alt text" button for images without alt
3. "Add image" button for projects without images
4. "Fill required fields" button for incomplete documents
5. "Fix duplicate" button for duplicate titles

### Quick-Fix Buttons
```
Quick Fixes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Add Image] [Add Alt Text] [Fix Slug]
[Fill Description] [Add Technologies]
```

### Verification
- Open Content Health inspector
- Shows quick-fix buttons for issues
- Clicking button opens appropriate editor
- Fix is applied and inspector updates

---

## Execution Order
1. Enhanced field completeness inspector (Slice 1)
2. Cross-document health checker (Slice 2)
3. Freshness timeline (Slice 3)
4. Quick-fix actions (Slice 4)

## Commit Log
- `feat(sanity): add field completeness inspector with progress bar`
- `feat(sanity): add cross-document health checker`
- `feat(sanity): add freshness timeline to Content Health inspector`
- `feat(sanity): add quick-fix actions for common content issues`

## Testing Checklist
- [ ] Field completeness shows correct percentages
- [ ] Empty fields highlighted in red
- [ ] Cross-document health issues detected
- [ ] Freshness timeline shows correct dates
- [ ] Quick-fix buttons work correctly
- [ ] Inspector updates after fixes
- [ ] Performance is acceptable (no lag)
