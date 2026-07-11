# Desk Structure Plan

> **Priority:** P2 — Studio features  
> **Status:** Planning

---

## Goal

Enhance the desk structure for better content organization and navigation.

---

## Current State

### Structure

```
Content
├── Homepage
│   ├── Hero & Profile
│   ├── About Section
│   └── Tech Stack
├── Collections
│   ├── Projects
│   ├── Experience
│   ├── Certifications
│   ├── Gallery
│   └── Resume
├── Blog
│   ├── Posts
│   ├── Authors
│   └── Categories
├── Community
│   ├── Memberships
│   └── Recommendations
Settings
├── Site Settings
├── SEO Settings
└── Media Settings
Reference Data
├── Certification Categories
├── Certification Issuers
└── Gallery Categories
```

### What Exists

- ✅ Icons for each section
- ✅ Filtered views for Projects, Experience, Posts
- ✅ Singletons for Homepage and Settings

---

## Enhancements

### 1. Add Document Counters

```typescript
// structure/components/DocumentCount.tsx
- Show count next to each collection
- Update in real-time
- Color coding based on count
```

### 2. Add Quick Actions

```typescript
// structure/components/QuickActions.tsx
- "New Project" button
- "New Post" button
- "New Certification" button
- Custom actions per section
```

### 3. Add Search

```typescript
// structure/components/SearchBar.tsx
- Search across all documents
- Filter by type
- Recent documents
```

### 4. Add Favorites

```typescript
// structure/components/Favorites.tsx
- Pin frequently accessed documents
- Star/unstar documents
- Persist favorites in localStorage
```

---

## Files to Modify

| File | Action |
|------|--------|
| `studio/structure/deskStructure.ts` | ENHANCE |
| `studio/structure/components/DocumentCount.tsx` | CREATE |
| `studio/structure/components/QuickActions.tsx` | CREATE |
| `studio/structure/components/SearchBar.tsx` | CREATE |
| `studio/structure/components/Favorites.tsx` | CREATE |

---

## Implementation Steps

### Step 1: Add Document Counters

1. Create DocumentCount component
2. Fetch counts via GROQ
3. Display in sidebar

### Step 2: Add Quick Actions

1. Create QuickActions component
2. Add action buttons
3. Link to intent/create

### Step 3: Add Search

1. Create SearchBar component
2. Implement GROQ search
3. Display results

### Step 4: Add Favorites

1. Create Favorites component
2. Implement star/unstar
3. Persist in localStorage

### Step 5: Test

- [ ] Counters update
- [ ] Quick actions work
- [ ] Search returns results
- [ ] Favorites persist

---

## Document Counter Implementation

```typescript
// GROQ query for document count
const countQuery = `count(*[_type == $type])`

// Usage in component
const count = await client.fetch(countQuery, {type: 'project'})
```

---

## Commit Strategy

```
plan(sanity): add desk structure plan
feat(sanity): add document counters
feat(sanity): add quick actions
feat(sanity): add search functionality
feat(sanity): add favorites system
```
