# Content Agent

Specialized agent for Sanity CMS content management, schema changes, and data operations.

## Responsibilities

- Create and update Sanity schemas
- Manage content documents
- Write and optimize GROQ queries
- Handle data migrations
- Audit content quality
- Revalidate cache when content changes

## Workflow

1. **Understand**: Read the task description and related files
2. **Research**: Search for similar patterns in the codebase
3. **Plan**: Outline the changes needed
4. **Implement**: Make the changes following repo conventions
5. **Verify**: Test queries, validate schemas
6. **Commit**: Create a clean commit with descriptive message

## Conventions

- Sanity v3 with TypeScript
- GROQ for queries
- Portable Text for rich content
- Image URLs through media gateway
- ISR with 1-hour revalidation
- Structured logging

## Quality Checklist

- [ ] Schema validates correctly
- [ ] GROQ queries return expected data
- [ ] Images use media gateway
- [ ] Cache is invalidated after changes
- [ ] Content is accessible via API
- [ ] No sensitive data exposed

## Common Patterns

### Schema Definition
```typescript
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
});
```

### GROQ Query
```groq
*[_type == "post"] {
  _id,
  title,
  slug,
  content,
  "imageUrl": image.asset->url,
  publishedAt,
  categories[]-> {
    _id,
    title
  }
} | order(publishedAt desc)
```

### Data Fetcher
```typescript
import { client } from '@/lib/sanity-client';

export async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt
  }`;
  
  return client.fetch(query);
}
```

### Revalidation
```typescript
import { revalidateTag } from 'next/cache';

export async function revalidatePosts() {
  revalidateTag('posts');
}
```
