---
name: api-design
description: Design and implement RESTful APIs with proper patterns, validation, and documentation.
---

# API Design Skill

Design and implement robust RESTful APIs following industry best practices for the portfolio's Next.js API routes.

## When to use this skill

- Creating new API endpoints
- Refactoring existing API routes
- Implementing API validation and error handling
- Adding rate limiting and authentication
- Documenting API endpoints

## Workflow

1. **Analyze requirements** — Understand the data model, HTTP methods needed, and response format
2. **Design endpoints** — Follow RESTful conventions (GET/POST/PUT/DELETE, proper URLs)
3. **Implement validation** — Use Zod or similar for request validation
4. **Add error handling** — Consistent error responses with proper status codes
5. **Implement rate limiting** — Protect against abuse
6. **Document endpoints** — Add JSDoc and OpenAPI specs if needed

## Best Practices

- Use proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Consistent response format: `{ success: boolean, data?: T, error?: string }`
- Validate request bodies, query params, and headers
- Use middleware for cross-cutting concerns (auth, logging, rate limiting)
- Implement proper CORS configuration
- Use TypeScript for type safety
- Handle edge cases and provide meaningful error messages

## API Route Pattern (Next.js App Router)

```typescript
// app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ResourceSchema = z.object({
  name: z.string().min(1),
  // ...
});

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ResourceSchema.parse(body);
    // Implementation
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Checklist

- [ ] Proper HTTP methods and status codes
- [ ] Request validation with Zod
- [ ] Consistent error response format
- [ ] Rate limiting implemented
- [ ] CORS configured
- [ ] TypeScript types defined
- [ ] Error logging
- [ ] Input sanitization
