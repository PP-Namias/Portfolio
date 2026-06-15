---
name: graphql-api
description: Design and implement GraphQL schemas, resolvers, and clients.
---

# GraphQL API Skill

Design and implement GraphQL APIs with proper schema design, resolvers, and client integration.

## When to use this skill

- Creating GraphQL schemas
- Implementing resolvers
- Setting up GraphQL clients
- Optimizing query performance
- Integrating with Sanity or other data sources

## Workflow

1. **Design schema** — Define types, queries, mutations
2. **Implement resolvers** — Connect schema to data sources
3. **Add authentication** — Secure mutations and queries
4. **Optimize performance** — Add caching and batching
5. **Test thoroughly** — Validate queries and mutations

## Schema Definition

```graphql
# schema.graphql
type Query {
  posts(limit: Int, offset: Int): [Post!]!
  post(slug: String!): Post
  projects: [Project!]!
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
}

type Post {
  id: ID!
  title: String!
  slug: String!
  content: String!
  author: User!
  publishedAt: DateTime
  tags: [String!]!
}

input CreatePostInput {
  title: String!
  content: String!
  tags: [String!]
}
```

## Apollo Client Setup

```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});
```

## React Hook Usage

```tsx
// components/Posts.tsx
import { useQuery, gql } from '@apollo/client';

const GET_POSTS = gql`
  query GetPosts($limit: Int) {
    posts(limit: $limit) {
      id
      title
      slug
      publishedAt
    }
  }
`;

export function Posts() {
  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { limit: 10 },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## Checklist

- [ ] Schema designed and validated
- [ ] Resolvers implemented
- [ ] Authentication configured
- [ ] Caching strategy in place
- [ ] Error handling implemented
- [ ] Client integration tested
