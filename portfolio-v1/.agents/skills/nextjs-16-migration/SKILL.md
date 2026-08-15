---
name: nextjs-16-migration
description: Migrate from Next.js 15 to Next.js 16 and handle breaking changes
---

# Next.js 16 Migration Skill

Migrate from Next.js 15 to Next.js 16 and handle breaking changes in this portfolio.

## When to use this skill

- Upgrading Next.js version
- Fixing Next.js 16 breaking changes
- Migrating from Pages Router to App Router
- Handling React 19 changes

## Current versions

- **Next.js:** 16.2.9
- **React:** 19.2.3
- **React DOM:** 19.2.3
- **@opennextjs/cloudflare:** 1.19.11

## Breaking changes in Next.js 16

### 1. `proxy.ts` → `middleware.ts`
- **Cause:** OpenNext detects `proxy.ts` as Node.js middleware
- **Fix:** Rename `src/proxy.ts` to `src/middleware.ts`

### 2. `--dangerouslyUseUnsupportedNextVersion`
- **Cause:** OpenNext doesn't officially support Next.js 16 yet
- **Fix:** Add flag to build command in CI/CD

### 3. React 19 changes
- `useFormStatus` hook added
- `useOptimistic` hook added
- `use` hook for promises
- Ref as prop (no forwardRef needed)
- Cleanup functions for refs
- `useContext` → `use(Context)`

### 4. App Router changes
- `loading.tsx` → `loading.js` (extension change)
- `error.tsx` → `error.js` (extension change)
- `not-found.tsx` → `not-found.js` (extension change)

### 5. Caching changes
- `fetch` requests are no longer cached by default
- Use `cache: 'force-cache'` for static data
- Use `cache: 'no-store'` for dynamic data

### 6. Metadata API changes
- `openGraph` → `opengraph`
- `twitter` → `x`

## Migration steps

### 1. Update package.json
```json
{
  "dependencies": {
    "next": "16.2.9",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  }
}
```

### 2. Run migration
```bash
npx @next/codemod@latest upgrade
```

### 3. Fix TypeScript errors
```bash
npx tsc --noEmit
```

### 4. Fix ESLint errors
```bash
npm run lint
```

### 5. Test build
```bash
npm run build
```

### 6. Fix runtime errors
```bash
npm run dev
```

## Common issues

### "Invalid hook call"
- **Cause:** Multiple React instances
- **Fix:** Check for duplicate React in `node_modules`

### "Cannot read property 'useState' of null"
- **Cause:** React not imported correctly
- **Fix:** Ensure `import React from 'react'` or `import { useState } from 'react'`

### "Server Components cannot be rendered as Client Components"
- **Cause:** Missing `'use client'` directive
- **Fix:** Add `'use client'` at top of component file

### "Hydration mismatch"
- **Cause:** Server and client render different content
- **Fix:** Use `useEffect` for client-only code, or `suppressHydrationWarning`

## Checklist

- [ ] Next.js version updated to 16.x
- [ ] React version updated to 19.x
- [ ] `proxy.ts` renamed to `middleware.ts`
- [ ] `--dangerouslyUseUnsupportedNextVersion` flag added
- [ ] TypeScript errors fixed
- [ ] ESLint errors fixed
- [ ] Build succeeds
- [ ] Runtime errors fixed
