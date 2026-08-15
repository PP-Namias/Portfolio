---
name: fullstack-workflow
description: End-to-end full-stack development workflow for Next.js
---

# Full-Stack Workflow Skill

Complete full-stack development workflow for Next.js applications with Sanity CMS.

## When to use this skill

- Building new features end-to-end
- Creating full-stack applications
- Integrating frontend and backend
- Setting up new projects

## Workflow

### 1. Planning Phase
```markdown
## Feature: [Feature Name]

### Requirements
- [ ] Frontend components needed
- [ ] API routes needed
- [ ] Database schema changes
- [ ] Third-party integrations

### Architecture
- Frontend: Next.js App Router
- Backend: Next.js API Routes
- Database: Sanity CMS
- State: SWR + React Context

### Timeline
- Day 1: Schema & API
- Day 2: Frontend components
- Day 3: Integration & testing
- Day 4: Review & deployment
```

### 2. Schema Design (Sanity)
```groq
// Define document type
defineType({
  name: 'feature',
  title: 'Feature',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    // ... more fields
  ]
})
```

### 3. API Development
```typescript
// app/api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const FeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const data = await fetchFeatures();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = FeatureSchema.parse(body);
    const data = await createFeature(validated);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create' },
      { status: 500 }
    );
  }
}
```

### 4. Frontend Components
```tsx
// components/FeatureCard.tsx
'use client';

import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export function FeatureCard({ title, description, onClick }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="p-6 rounded-lg border border-gray-200 dark:border-gray-800"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
    </motion.div>
  );
}
```

### 5. Data Fetching
```typescript
// hooks/useFeatures.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useFeatures() {
  const { data, error, isLoading } = useSWR('/api/features', fetcher);

  return {
    features: data?.data,
    isLoading,
    isError: error
  };
}
```

### 6. Testing
```typescript
// __tests__/FeatureCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureCard } from '@/components/FeatureCard';

describe('FeatureCard', () => {
  it('renders title correctly', () => {
    render(<FeatureCard title="Test Feature" />);
    expect(screen.getByText('Test Feature')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<FeatureCard title="Test" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### 7. Deployment
```bash
# Build
npm run build

# Test
npm run test

# Deploy
npm run deploy
```

## Checklist

- [ ] Schema designed and validated
- [ ] API routes implemented
- [ ] Frontend components created
- [ ] Data fetching hooks added
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Deployment configured
