---
name: typescript-advanced
description: Advanced TypeScript patterns and type safety as used in this portfolio
---

# Advanced TypeScript Skill

Advanced TypeScript patterns, generics, and type-level programming as applied in the PP Namias portfolio.

## When to use this skill

- Creating complex type definitions for Sanity schemas or API responses
- Implementing type-safe patterns for SWR hooks or context providers
- Building generic utilities for the codebase
- Enhancing type safety in existing code

## Portfolio-specific patterns

### 1. Sanity document types

```typescript
// Typed Sanity query results
const doc = await querySanity<{
  title?: string;
  slug?: string;
  technologies?: string[];
  galleryItems?: Array<{
    url?: string;
    alt?: string;
    caption?: string;
  }>;
}>(`*[_type == "project" && slug.current == "${safeSlug}"][0]{...}`);
```

### 2. SWR hook typing

```typescript
// Typed SWR fetcher
const { data, error } = useSWR<CmsContent>(
  '/api/cms',
  (url) => fetch(url).then(r => r.json())
);
```

### 3. API route request/response types

```typescript
// Typed API response
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Typed request body
interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
}
```

### 4. Component prop types

```typescript
// Discriminated union for component variants
type ProjectTier = 'standard' | 'featured' | 'showcase';

interface ProjectProps {
  tier: ProjectTier;
  title: string;
  slug: string;
}

// Only showcase has galleryItems
interface ShowcaseProject extends ProjectProps {
  tier: 'showcase';
  galleryItems: GalleryItem[];
}

type ProjectCardProps = StandardProject | FeaturedProject | ShowcaseProject;
```

## Common patterns

### Discriminated Unions
```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

### Template Literal Types
```typescript
type SanityField = `${string}Field`;
const title: SanityField = 'titleField'; // Valid
```

### Type Guards
```typescript
function isShowcaseProject(project: ProjectCardProps): project is ShowcaseProject {
  return project.tier === 'showcase';
}
```

### Branded Types
```typescript
type Slug = string & { readonly __brand: 'Slug' };
function createSlug(value: string): Slug {
  return value.replace(/[^a-zA-Z0-9\-_]/g, '') as Slug;
}
```

### Mapped Types
```typescript
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

## Checklist

- [ ] Types match actual data shapes (Sanity schema, API responses)
- [ ] Type guards used for runtime type narrowing
- [ ] No `as any` or `@ts-ignore` unless absolutely necessary
- [ ] Types exported for reuse across files
- [ ] `npx tsc --noEmit` passes
