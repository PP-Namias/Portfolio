---
name: mimo-workflow
description: Optimized workflows for OpenCode IDE with MiMo v2.5 free model
---

# MiMo v2.5 Workflow Skill

Optimized workflows specifically designed for OpenCode IDE using the free MiMo v2.5 model.

## When to use this skill

- Working with OpenCode IDE on this portfolio
- Using MiMo v2.5 free model for code generation
- Need efficient task completion with constrained context
- Want to maximize AI capabilities within token limits

## MiMo v2.5 strengths and limits

- **Strengths:** TypeScript, React, Next.js code generation; code review; systematic debugging; test generation
- **Limits:** 128K context window; may truncate large files; prefer focused, single-file tasks over multi-file orchestrations

## Optimized prompt patterns

### 1. Component generation (single file)
```
Create [ComponentName] in src/components/ui/:
- TypeScript interfaces for props
- Tailwind CSS styling (dark mode default)
- Framer Motion animations (whileInView)
- ARIA accessibility
- Export as default
```

### 2. API route (single file)
```
Create Next.js API route at src/app/api/[path]/route.ts:
- Zod validation for request body
- Proper error responses (400, 429, 500)
- Rate limiting via in-memory Map
- TypeScript types for response
```

### 3. Test generation
```
Write Vitest + RTL tests for [ComponentName]:
- Test all visible states (loading, error, empty, populated)
- Test user interactions (click, submit, keyboard)
- Use SWRConfig with provider: () => new Map() for SWR isolation
- Mock fetch for API calls
```

### 4. Bug fix
```
Debug [error] in [file:line]:
1. Read the file and surrounding context
2. Identify root cause
3. Apply minimal fix
4. Run npm run test -- --run to verify
5. Run npx tsc --noEmit to verify types
```

### 5. Code review
```
Review [file] for:
- TypeScript strict mode compliance
- React best practices (keys, hooks rules, derived state)
- Accessibility (ARIA, keyboard, focus management)
- Performance (unnecessary re-renders, missing memoization)
- Security (XSS, secrets, CSP)
```

## Workflow templates

### Feature development
1. Plan → 2. Scaffold (one component at a time) → 3. Implement → 4. Test → 5. Commit

### Bug fix
1. Reproduce → 2. Read error + context → 3. Fix → 4. Test → 5. Commit

### Refactoring
1. Identify target → 2. Small incremental changes → 3. Test after each → 4. Commit

## Best practices

- One file per task (MiMo works best with focused context)
- Include file path in the prompt
- Specify exact conventions (Tailwind, Framer Motion, SWR)
- Verify output with `npm run test -- --run` and `npx tsc --noEmit`
- Commit after each verified change
