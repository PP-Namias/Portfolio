# Presentation Tool Plan

> **Priority:** P2 — Studio features  
> **Status:** Planning

---

## Goal

Enhance the Presentation tool for better visual editing experience.

---

## Current State

### What Exists

- Presentation tool configured in `sanity.config.ts`
- Preview URL: `https://namias.tech`
- Draft mode endpoint: `/api/draft-mode/enable`
- Custom navigator: `PresentationNavigator`
- Preview locations defined

### What's Working

- ✅ Basic presentation mode
- ✅ Draft mode toggle
- ✅ Preview locations
- ✅ Custom navigator

---

## Enhancements

### 1. Improve Navigator

**Current:** Basic list with links  
**Proposed:** Rich navigator with thumbnails and status

```typescript
// presentation/PresentationNavigator.tsx
- Show document thumbnails
- Show publish status (draft/published)
- Show last updated time
- Filter by type
- Search functionality
```

### 2. Add Visual Indicators

```typescript
// presentation/VisualIndicators.tsx
- Field highlights on hover
- Click-to-edit indicators
- Missing field warnings
- SEO score badges
```

### 3. Improve Preview URL Handling

```typescript
// presentation/PreviewUrlHandler.tsx
- Dynamic preview URLs per document type
- Handle different content types
- Support for draft/published views
```

### 4. Add Keyboard Shortcuts

```typescript
// presentation/KeyboardShortcuts.tsx
- Cmd+P: Toggle presentation mode
- Cmd+D: Toggle draft mode
- Cmd+S: Save document
- Escape: Exit presentation
```

---

## Files to Modify

| File | Action |
|------|--------|
| `studio/presentation/PresentationNavigator.tsx` | ENHANCE |
| `studio/presentation/VisualIndicators.tsx` | CREATE |
| `studio/presentation/PreviewUrlHandler.tsx` | CREATE |
| `studio/presentation/KeyboardShortcuts.tsx` | CREATE |
| `studio/sanity.config.ts` | UPDATE config |

---

## Implementation Steps

### Step 1: Enhance Navigator

1. Add document thumbnails
2. Add status indicators
3. Add search/filter

### Step 2: Add Visual Indicators

1. Create VisualIndicators component
2. Add field highlighting
3. Add click-to-edit support

### Step 3: Add Keyboard Shortcuts

1. Create KeyboardShortcuts component
2. Register shortcuts
3. Add help modal

### Step 4: Test

- [ ] Navigator works
- [ ] Visual indicators appear
- [ ] Keyboard shortcuts work
- [ ] Draft mode toggles
- [ ] Preview updates live

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+P` | Toggle presentation mode |
| `Cmd+D` | Toggle draft mode |
| `Cmd+S` | Save document |
| `Cmd+Shift+S` | Publish document |
| `Escape` | Exit presentation |
| `?` | Show shortcuts help |

---

## Commit Strategy

```
plan(sanity): add presentation tool plan
feat(sanity): enhance presentation navigator
feat(sanity): add visual indicators
feat(sanity): add keyboard shortcuts
```
