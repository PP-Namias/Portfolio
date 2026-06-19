---
name: nextjs-app-router
description: Next.js App Router patterns and best practices
---

# Next.js App Router Skill

Advanced Next.js App Router patterns, data fetching, and optimization.

## When to use this skill

- Creating new pages and layouts
- Implementing data fetching
- Setting up API routes
- Optimizing performance

## Patterns

### 1. Layout with Nested Routes
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 border-r">
        <nav>{/* Navigation */}</nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

### 2. Server Components with Data Fetching
```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### 3. Client Components with Interactivity
```tsx
// app/counter/page.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### 4. API Routes with Validation
```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = UserSchema.parse(body);
    
    // Create user
    const user = await createUser(validated);
    
    return NextResponse.json({ user }, { status: 2101 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 5. Dynamic Routes with Loading States
```tsx
// app/posts/[id]/loading.tsx
export default function Loading() {
  return <div>Loading post...</div>;
}

// app/posts/[id]/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/posts/[id]/page.tsx
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### 6. Parallel Routes
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="flex-1">{children}</div>
      <div className="w-64">
        {analytics}
        {notifications}
      </div>
    </div>
  );
}

// app/dashboard/@analytics/page.tsx
export default function Analytics() {
  return <div>Analytics content</div>;
}

// app/dashboard/@notifications/page.tsx
export default function Notifications() {
  return <div>Notifications content</div>;
}
```

### 7. Intercepting Routes
```tsx
// app/feed/(..)photo/[id]/page.tsx
export default function PhotoModal({ params }) {
  return (
    <div className="modal">
      <h1>Photo {params.id}</h1>
      {/* Modal content */}
    </div>
  );
}
```

### 8. Metadata and SEO
```tsx
// app/posts/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getPost(params.id);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image]
    }
  };
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  return <article>{/* Content */}</article>;
}
```

## Checklist

- [ ] Layouts properly structured
- [ ] Data fetching optimized
- [ ] Loading and error states handled
- [ ] API routes validated
- [ ] SEO metadata configured
- [ ] Performance optimized
