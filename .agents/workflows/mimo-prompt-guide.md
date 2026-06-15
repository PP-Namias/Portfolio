# MiMo v2.5 Prompt Engineering Guide

Optimized prompt patterns for MiMo v2.5 free model in OpenCode IDE.

## Core Principles

### 1. Be Specific
MiMo v2.5 works best with clear, specific instructions.

**Bad**: "Fix the bug"
**Good**: "Fix the hydration error in BlogSection.tsx caused by using `Date.now()` in the initial render"

### 2. Provide Context
Include relevant file paths, error messages, and code snippets.

**Bad**: "The component is broken"
**Good**: "In `src/components/sections/BlogSection.tsx:174`, the `BlogSection` component throws a hydration error because the date formatting uses `Date.now()` which differs between server and client"

### 3. Break Into Steps
Complex tasks should be broken into smaller, sequential steps.

**Bad**: "Implement the entire blog feature"
**Good**:
1. Create the blog list page at `src/app/blog/page.tsx`
2. Add the BlogListClient component
3. Implement pagination
4. Add SEO metadata
5. Write tests

### 4. Use Templates
Leverage existing patterns and templates in the codebase.

**Bad**: "Create a new API route"
**Good**: "Create a new API route at `src/app/api/comments/route.ts` following the same pattern as `src/app/api/chat/route.ts`"

## Prompt Templates

### Bug Fix
```
Fix the [error type] in [file path]:

Error: [error message]
Context: [what was happening when the error occurred]

Requirements:
1. [requirement 1]
2. [requirement 2]
3. [requirement 3]

Verify by running: [test command]
```

### New Component
```
Create a new [component type] component at [file path]:

Purpose: [what the component does]
Props: [list of props with types]
Behavior: [interaction behavior]

Requirements:
1. Follow repo conventions
2. Add proper TypeScript types
3. Include accessibility attributes
4. Add Framer Motion animations
5. Write tests

Reference: [similar existing component]
```

### API Route
```
Create a new API route at [file path]:

Endpoint: [HTTP method] [path]
Purpose: [what the endpoint does]
Request: [request body schema]
Response: [response schema]

Requirements:
1. Input validation with Zod
2. Error handling
3. Rate limiting
4. Structured logging
5. Write tests

Reference: [similar existing route]
```

### Feature
```
Implement [feature name]:

Requirements:
- [requirement 1]
- [requirement 2]
- [requirement 3]

Technical constraints:
- [constraint 1]
- [constraint 2]

Files to create/modify:
1. [file 1] - [purpose]
2. [file 2] - [purpose]
3. [file 3] - [purpose]

Verify: [verification steps]
```

## MiMo v2.5 Strengths

### Code Generation
- Excellent at TypeScript/React code
- Strong with Next.js patterns
- Good at following conventions
- Handles complex types well

### Code Analysis
- Good at finding bugs
- Understands error messages
- Can trace code flow
- Identifies patterns

### Refactoring
- Suggests improvements
- Maintains consistency
- Handles large changes
- Preserves behavior

## MiMo v2.5 Limitations

### Context Window
- Keep prompts focused
- Reference files by path
- Don't include entire files
- Use grep to find relevant code

### Reasoning
- Break complex logic into steps
- Provide clear constraints
- Use examples when helpful
- Verify assumptions

### creativity
- Be explicit about requirements
- Provide concrete examples
- Don't leave decisions open
- Specify exact behavior

## Tips for OpenCode IDE

### Use Tool Calls
```
Read the file at src/components/sections/BlogSection.tsx
Then grep for "Date.now" in the src directory
Then fix the hydration error
```

### Sequential Tasks
```
First, create the test file
Then, implement the component
Finally, run the tests
```

### Verification
```
After making changes:
1. Run: npx tsc --noEmit
2. Run: npm run lint
3. Run: npm run test -- --run
4. Report any failures
```
