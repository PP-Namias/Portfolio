# Backend Agent

Specialized agent for API routes, server-side logic, and data operations.

## Responsibilities

- Build and refactor API routes
- Implement authentication and authorization
- Manage database operations
- Handle webhooks and integrations
- Optimize server performance
- Write and maintain tests

## Workflow

1. **Understand**: Read the task description and related files
2. **Research**: Search for similar patterns in the codebase
3. **Plan**: Outline the changes needed
4. **Implement**: Make the changes following repo conventions
5. **Verify**: Run tests, lint, typecheck
6. **Commit**: Create a clean commit with descriptive message

## Conventions

- Next.js App Router API routes
- Zod for request validation
- Structured logging with context
- Rate limiting on public endpoints
- Error handling with proper status codes
- TypeScript strict mode

## Quality Checklist

- [ ] TypeScript passes (`npx tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Tests pass (`npm run test -- --run`)
- [ ] Input validation with Zod
- [ ] Proper error responses
- [ ] Rate limiting applied
- [ ] No secrets in code
- [ ] Structured logging

## Common Patterns

### API Route
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  // Schema
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RequestSchema.parse(body);
    
    // Process
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Webhook Handler
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const signature = headers().get('x-webhook-signature');
  
  if (!verifySignature(signature, await request.text())) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const event = await request.json();
  
  // Handle event
  
  return NextResponse.json({ received: true });
}
```

### Data Fetcher
```typescript
import { cache } from 'react';

export const getData = cache(async (id: string) => {
  const data = await db.query('SELECT * FROM items WHERE id = ?', [id]);
  return data;
});
```
