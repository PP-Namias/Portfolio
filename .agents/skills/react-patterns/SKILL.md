---
name: react-patterns
description: Advanced React patterns and best practices used in this portfolio
---

# React Patterns Skill

Advanced React patterns, hooks, and best practices as applied in the PP Namias portfolio.

## When to use this skill

- Creating complex React components (modals, sections, interactive widgets)
- Implementing advanced patterns (compound components, context splitting)
- Optimizing React performance (memoization, derived state)
- Building reusable components following repo conventions

## Portfolio-specific patterns

### 1. Modal system (compound components + context)

The portfolio uses a modal system built with compound components:

```tsx
// src/components/ui/Modal.tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>Actions</ModalFooter>
</Modal>
```

**Registration:** All modals are registered in `src/hooks/useModal.tsx` with typed keys.

### 2. SWR data fetching

```tsx
// Always isolate SWR in tests
<SWRConfig value={{ provider: () => new Map() }}>
  <Component />
</SWRConfig>
```

### 3. Section components

All sections follow the same pattern:
```tsx
// src/components/sections/SectionName.tsx
'use client';
import { motion } from 'framer-motion';

export default function SectionName({ data }: Props) {
  return (
    <section>
      <motion.div whileInView={{ opacity: 1 }} />
    </section>
  );
}
```

### 4. Image optimization

```tsx
// Always use OptimizedImage, not raw <img>
<OptimizedImage
  src={url}
  alt={alt}
  width={800}
  height={600}
  priority={isAboveFold}
/>
```

## Common patterns

### Compound Components
```tsx
const TabsContext = createContext(null);

function Tabs({ children, defaultValue }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}
```

### Custom Hooks
```tsx
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}
```

### Context with Performance
```tsx
// Split value and dispatch to prevent unnecessary re-renders
const StateContext = createContext(null);
const DispatchContext = createContext(null);
```

## Checklist

- [ ] Patterns match existing repo conventions
- [ ] SWR isolation in tests (`provider: () => new Map()`)
- [ ] Modals registered in `useModal.tsx`
- [ ] Images use `OptimizedImage` component
- [ ] Accessibility (ARIA, keyboard, focus)
- [ ] Performance (useMemo, useCallback where needed)
