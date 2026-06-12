# EPIC-F: Inspector Panels Upgrade

## Goal
Upgrade all inspector panels: SEO preview, content health, data consistency, and JSON inspector.

## Current State
- `SeoPreview.tsx` — basic Google SERP preview
- `ContentHealth.tsx` — basic word count and alt text
- No data consistency inspector
- No JSON inspector with syntax highlighting
- No inspector tabs

## Slice 1: Enhanced SEO Preview
**Files:** `studio/inspectors/SeoPreview.tsx`

### Changes
1. Add social card preview (Twitter/Facebook)
2. Add keyword density analysis
3. Add readability score
4. Add internal/external link count

### SEO Preview UI
```
SEO Preview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Google SERP
┌─────────────────────────────┐
│ Project Title | namias.tech │
│ Description text here...    │
│ namias.tech › project       │
└─────────────────────────────┘

Social Card
┌─────────────────────────────┐
│ [Image]                     │
│ Project Title               │
│ Description text here...    │
│ namias.tech                 │
└─────────────────────────────┘

Content Analysis
• Word count: 250
• Reading time: 1 min
• Links: 3 internal, 2 external
• Images: 2 (1 missing alt)
```

### Verification
- Open project with SEO fields
- SEO preview shows Google SERP
- Social card preview shows Twitter card
- Content analysis shows metrics

---

## Slice 2: Data Consistency Inspector
**Files:** `studio/inspectors/DataConsistency.tsx`

### Changes
1. Check for orphaned references
2. Check for missing backlinks
3. Check for inconsistent data across documents
4. Show data consistency score

### Consistency Checks
| Check | Description |
|-------|-------------|
| Orphaned refs | Reference points to deleted document |
| Missing backlinks | Document references another but not vice versa |
| Inconsistent dates | Experience end date before start date |
| Empty arrays | Document has empty required arrays |
| Missing images | Project without image |

### Verification
- Open Data Consistency inspector
- Shows consistency issues
- Clicking issue navigates to affected document

---

## Slice 3: JSON Inspector & Inspector Tabs
**Files:** `studio/inspectors/JsonInspector.tsx`, `studio/inspectors/InspectorTabs.tsx`

### Changes
1. Add JSON inspector with syntax highlighting
2. Add tab navigation between inspectors
3. Add copy-to-clipboard for JSON
4. Add search within JSON

### Inspector Tabs
```
[SEO] [Health] [Consistency] [JSON]
```

### Verification
- Open any document
- Click JSON tab
- Shows formatted JSON with syntax highlighting
- Can copy JSON to clipboard
- Can search within JSON

---

## Execution Order
1. Enhanced SEO preview (Slice 1)
2. Data consistency inspector (Slice 2)
3. JSON inspector & tabs (Slice 3)

## Commit Log
- `feat(sanity): enhance SEO preview with social card and content analysis`
- `feat(sanity): add data consistency inspector`
- `feat(sanity): add JSON inspector with syntax highlighting and tabs`

## Testing Checklist
- [ ] SEO preview shows Google SERP correctly
- [ ] Social card preview renders
- [ ] Content analysis metrics are accurate
- [ ] Data consistency checks work
- [ ] JSON inspector shows formatted JSON
- [ ] Inspector tabs switch correctly
- [ ] Copy-to-clipboard works
