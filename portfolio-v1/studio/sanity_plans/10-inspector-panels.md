# Inspector Panels Plan

> **Priority:** P2 — Studio features  
> **Status:** Planning

---

## Goal

Enhance inspector panels for better document analysis and debugging.

---

## Current State

### What Exists

- ✅ ContentHealth panel
- ✅ SeoPreview panel
- ✅ JsonInspector panel
- ✅ Registered in sanity.config.ts

---

## Enhancements

### 1. Add Tab System

```typescript
// inspector/InspectorTabs.tsx
- Tabbed interface
- Persistent tab selection
- Keyboard navigation
- Tab badges for issues
```

### 2. Add SEO Preview

```typescript
// inspector/EnhancedSeoPreview.tsx
- Google SERP preview
- Social card preview
- Twitter card preview
- LinkedIn preview
```

### 3. Add Data Consistency

```typescript
// inspector/DataConsistency.tsx
- Reference integrity check
- Field consistency check
- Schema compliance check
- Cross-document consistency
```

### 4. Add Raw Data View

```typescript
// inspector/RawDataView.tsx
- JSON tree view
- Collapsible sections
- Copy to clipboard
- Export functionality
```

---

## Panel Types

### 1. Content Health

```typescript
// Already exists
- Field completeness
- Stale content
- Orphaned references
- Content score
```

### 2. SEO Preview

```typescript
// Already exists
- Google SERP preview
- Social card preview
- SEO issues
```

### 3. JSON Inspector

```typescript
// Already exists
- Raw JSON view
- Fields view
- Meta view
- Copy functionality
```

### 4. Data Consistency (NEW)

```typescript
// To be created
- Reference integrity
- Field consistency
- Schema compliance
- Cross-document consistency
```

### 5. Performance (NEW)

```typescript
// To be created
- Document size
- Field complexity
- Image count
- Reference depth
```

---

## Files to Modify

| File | Action |
|------|--------|
| `studio/components/inspector/InspectorTabs.tsx` | CREATE |
| `studio/components/inspector/EnhancedSeoPreview.tsx` | ENHANCE |
| `studio/components/inspector/DataConsistency.tsx` | CREATE |
| `studio/components/inspector/RawDataView.tsx` | ENHANCE |
| `studio/components/inspector/Performance.tsx` | CREATE |
| `studio/sanity.config.ts` | UPDATE config |

---

## Implementation Steps

### Step 1: Add Tab System

1. Create InspectorTabs component
2. Add tab navigation
3. Add persistent selection

### Step 2: Enhance SEO Preview

1. Add Twitter card preview
2. Add LinkedIn preview
3. Add multiple platform previews

### Step 3: Add Data Consistency

1. Create DataConsistency component
2. Add reference integrity check
3. Add field consistency check

### Step 4: Add Performance Panel

1. Create Performance component
2. Add document size calculation
3. Add field complexity analysis

### Step 5: Test

- [ ] Tabs work correctly
- [ ] SEO previews render
- [ ] Data consistency checks
- [ ] Performance metrics display

---

## Data Consistency Checks

```typescript
const consistencyChecks = [
  {
    name: 'Reference Integrity',
    description: 'Check all references resolve to existing documents',
    check: async (doc, client) => {
      const refs = extractReferences(doc)
      for (const ref of refs) {
        const exists = await client.fetch(`*[_id == $id][0]`, {id: ref._ref})
        if (!exists) return {ok: false, message: `Broken reference: ${ref._ref}`}
      }
      return {ok: true, message: 'All references valid'}
    },
  },
  {
    name: 'Field Consistency',
    description: 'Check required fields are present',
    check: (doc, schema) => {
      const required = getRequiredFields(schema)
      const missing = required.filter(f => !doc[f])
      if (missing.length > 0) {
        return {ok: false, message: `Missing fields: ${missing.join(', ')}`}
      }
      return {ok: true, message: 'All required fields present'}
    },
  },
]
```

---

## Commit Strategy

```
plan(sanity): add inspector panels plan
feat(sanity): add tab system
feat(sanity): enhance SEO preview
feat(sanity): add data consistency
feat(sanity): add performance panel
```
