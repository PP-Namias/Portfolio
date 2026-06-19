---
name: component-api-scaffolding
description: Create new React components, API routes, SWR hooks, and context providers following repo patterns.
---

# Component & API Scaffolding

## When to use this skill

- Creating a new UI component
- Adding a new API route
- Creating a custom SWR hook
- Adding a new context provider
- Creating a new page or section
- Adding a new modal

## Patterns to follow

### 1. UI component template

**Location:** `src/components/ui/`

```tsx
'use client';

import { useState } from 'react';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: Readonly<MyComponentProps>) {
  const [state, setState] = useState('');

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-bg-dark p-5">
      <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
        {title}
      </h3>
      <button
        type="button"
        onClick={onAction}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-accent-pink px-4 py-2 text-sm font-medium text-white hover:bg-accent-pink-hover dark:hover:bg-accent-pink-hover-dark transition-colors"
      >
        Action
      </button>
    </div>
  );
}
```

**Component conventions:**

- File name: `PascalCase.tsx` (e.g., `MyComponent.tsx`)
- Export: Named export (`export function MyComponent`)
- Props: `interface` with `Readonly<>` wrapper
- Styling: Tailwind utility classes with theme tokens
- Dark mode: Always include `-light` / `-dark` suffix pairs
- Accessibility: `aria-label`, `role`, semantic HTML
- Client components: Add `'use client'` at top

### 2. Section component template

**Location:** `src/components/sections/`

```tsx
'use client';

import { useCmsContent } from '@/hooks/useCmsContent';

export function MySection() {
  const { profile } = useCmsContent();

  return (
    <section className="py-16 sm:py-20" id="my-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Section Title
        </h2>
        {/* Content */}
      </div>
    </section>
  );
}
```

**Section conventions:**

- Location: `src/components/sections/`
- Always has `id` for navigation
- Uses `max-w-6xl mx-auto px-4 sm:px-6` container
- Vertical padding: `py-16 sm:py-20`
- Data from `useCmsContent()` hook

### 3. API route template

**Location:** `src/app/api/<route>/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Logic here
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate body
    // Process
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**API route conventions:**

- File: `route.ts` (not `page.ts`)
- Methods: Named exports (`GET`, `POST`, `PUT`, `DELETE`)
- Error handling: try/catch with console.error
- Logging prefix: `[API Name]` for easy filtering
- Response: Always `NextResponse.json()`
- Validation: Validate before processing

### 4. SWR hook template

**Location:** `src/hooks/`

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useMyData() {
  const { data, error, isLoading } = useSWR('/api/my-data', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  return {
    data: data ?? null,
    error: error ?? null,
    isLoading,
  };
}
```

**SWR conventions:**

- File: `use<Name>.ts` (e.g., `useProjects.ts`)
- Always provide default values (`?? null`)
- Set `dedupingInterval` to prevent excessive requests
- Use with `SWRConfig` in tests for isolation

### 5. Context provider template

**Location:** `src/hooks/` (for small state) or `src/contexts/` (for complex state)

```tsx
'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type MyContextValue = {
  value: string;
  setValue: (v: string) => void;
};

const MyContext = createContext<MyContextValue | null>(null);

export function MyProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState('');

  const contextValue = useMemo(() => ({ value, setValue }), [value]);

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('useMyContext must be used within MyProvider');
  return context;
}
```

### 6. Modal template

**Location:** `src/components/ui/`

Modals use the base `<Modal>` component:

```tsx
'use client';

import { Modal } from './Modal';

interface MyModalProps {
  open: boolean;
  onClose: () => void;
}

export function MyModal({ open, onClose }: Readonly<MyModalProps>) {
  return (
    <Modal open={open} onClose={onClose} title="My Modal">
      <div className="px-5 py-6">
        {/* Modal content */}
      </div>
    </Modal>
  );
}
```

**Modal conventions:**

- Register in `src/hooks/useModal.tsx` (add to `ModalName` type)
- Add to `ModalProvider` component
- Use `fullScreen` prop for content-heavy modals
- Always include `title` for accessibility

### 7. Page template

**Location:** `src/app/<route>/page.tsx`

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | PP Namias',
  description: 'Page description',
};

export default function MyPage() {
  return (
    <main>
      {/* Page content */}
    </main>
  );
}
```

**Page conventions:**

- Export `metadata` for SEO
- Use `<main>` as root element
- Pages are server components by default
- Client components: wrap with `'use client'` or use dynamic import

## File organization

```
src/
  components/
    ui/           # Reusable UI components (Button, Modal, Card)
    sections/     # Page sections (Hero, Projects, Contact)
    layout/       # Layout components (Header, Footer, Navigation)
  hooks/          # Custom React hooks
  contexts/       # React context providers
  lib/            # Utilities, constants, helpers
  app/            # Next.js App Router pages and API routes
  __tests__/      # Test files (mirrors src/ structure)
```

## Naming conventions

| Type | Convention | Example |
|---|---|---|
| Component file | PascalCase | `ContactModal.tsx` |
| Hook file | camelCase, `use` prefix | `useCmsContent.ts` |
| Utility file | camelCase | `buildEmailLinks.ts` |
| Constant file | camelCase | `constants.ts` |
| Type file | camelCase | `types.ts` |
| Test file | `*.test.tsx` | `ContactModal.test.tsx` |
| API route | `route.ts` | `src/app/api/chat/route.ts` |

## Common mistakes

- Creating a component without TypeScript types
- Forgetting `'use client'` on components that use hooks
- Not including dark mode variants in Tailwind classes
- Using `<div onClick>` instead of `<button onClick>` (accessibility)
- Not wrapping props in `Readonly<>`
- Forgetting to register new modals in `useModal.tsx`

## Delivery checks

- [ ] Component has TypeScript types
- [ ] Component works in both light and dark mode
- [ ] Component is keyboard navigable
- [ ] Component has proper ARIA attributes
- [ ] Component follows existing naming conventions
- [ ] No new warnings in console
- [ ] TypeScript passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
