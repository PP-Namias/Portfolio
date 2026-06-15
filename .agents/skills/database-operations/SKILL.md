---
name: database-operations
description: Manage database schemas, queries, migrations, and data operations.
---

# Database Operations Skill

Handle database design, queries, migrations, and optimization for SQLite, PostgreSQL, and Sanity CMS.

## When to use this skill

- Designing database schemas
- Writing complex queries
- Performing data migrations
- Optimizing query performance
- Debugging database issues

## Workflow

1. **Understand the data model** — Identify entities, relationships, and constraints
2. **Design schema** — Create normalized, efficient schemas
3. **Write queries** — Use proper indexing and optimization
4. **Test migrations** — Validate in development first
5. **Monitor performance** — Profile slow queries

## SQLite Operations

```sql
-- Create table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Query with joins
SELECT u.name, p.title
FROM users u
JOIN posts p ON u.id = p.author_id
WHERE u.id = ?;
```

## Sanity GROQ Queries

```groq
// Fetch all published posts
*[_type == "post" && !(_id in path("drafts.**"))] {
  title,
  slug,
  excerpt,
  "author": author->name,
  publishedAt
} | order(publishedAt desc)

// Fetch single post with related
*[_type == "post" && slug.current == $slug][0] {
  ...,
  "related": *[_type == "post" && category == ^.category && _id != ^._id][0..3] {
    title,
    slug
  }
}
```

## Performance Tips

- Use connection pooling
- Implement query caching (SWR, React cache)
- Add proper indexes for frequently queried fields
- Use `SELECT` specific columns instead of `SELECT *`
- Implement pagination for large datasets
- Use prepared statements for parameterized queries

## Checklist

- [ ] Schema properly normalized
- [ ] Indexes on frequently queried fields
- [ ] Connection pooling configured
- [ ] Query caching implemented
- [ ] Migrations tested in dev
- [ ] Backup strategy in place
