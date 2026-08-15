# EPIC-E: Smart Document Templates

## Goal
Improve document templates with smart defaults, auto-fill, and contextual suggestions.

## Current State
- 7 template groups in `studio/templates/index.ts`
- Basic initial values for each template
- No auto-fill from previous documents
- No template preview
- No bulk creation

## Slice 1: Smart Template Defaults
**Files:** `studio/templates/*.ts`

### Changes
1. Analyze existing documents to generate smart defaults
2. Auto-fill category from most recent document
3. Auto-fill technologies from previous project
4. Auto-fill year from current year
5. Generate slug from title automatically

### Smart Defaults Logic
```typescript
// For project template
const smartDefaults = {
  year: new Date().getFullYear(),
  category: lastProject?.category || 'Web Application',
  technologies: lastProject?.technologies || [],
  status: 'in-progress',
  tier: 'standard',
  showcaseDetail: false,
}
```

### Verification
- Create new project
- Year defaults to current year
- Category matches last project
- Technologies pre-filled

---

## Slice 2: Template Preview
**Files:** `studio/components/TemplatePreview.tsx`

### Changes
1. Show preview of template before creation
2. Display what fields will be pre-filled
3. Allow customization before creating
4. Show estimated completion time

### Template Preview UI
```
Create New Project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Template: Featured Project
Pre-filled:
  • Year: 2026
  • Category: Web Application
  • Status: in-progress
  • Tier: standard

[Customize] [Create with Defaults]
```

### Verification
- Click "New Project"
- Template preview shows pre-filled fields
- Can customize before creating
- Document created with selected template

---

## Execution Order
1. Smart template defaults (Slice 1)
2. Template preview (Slice 2)

## Commit Log
- `feat(sanity): add smart template defaults with auto-fill`
- `feat(sanity): add template preview before document creation`

## Testing Checklist
- [ ] Smart defaults populate correctly
- [ ] Auto-fill works from previous documents
- [ ] Template preview shows correct information
- [ ] Customization works before creation
- [ ] Documents created with correct defaults
