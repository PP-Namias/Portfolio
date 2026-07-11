---
name: sanity-data-operations
description: Manage Sanity content -- schema changes, data migrations, debugging queries, batch operations, and revalidation.
---

# Sanity Data Operations

## When to use this skill

- Modifying Sanity schemas or adding new document types
- Debugging missing or incorrect data in the frontend
- Running batch operations on Sanity documents
- Troubleshooting revalidation and ISR issues
- Managing Sanity webhooks and live preview
- Seeding or resetting demo data

## Sanity project reference

| Field | Value |
|---|---|
| Project ID | `namias-cms` (from `NEXT_PUBLIC_SANITY_PROJECT_ID`) |
| Dataset | `production` (from `NEXT_PUBLIC_SANITY_DATASET`) |
| Studio URL | `http://localhost:3333` (local) / `https://namias-cms.sanity.studio` (prod) |
| API version | `2024-01-01` |

## Workflow

### 1. Schema inspection

**List all document types:**

```bash
cd studio && npx sanity schema list
```

**View a specific schema:**

```bash
cd studio && npx sanity schema describe <documentType>
```

**Common document types in this project:**

| Type | Purpose |
|---|---|
| `profile` | Hero section: name, title, role rotator, email, image |
| `project` | Portfolio projects with title, slug, summary, tech, images |
| `experience` | Work history: role, company, dates, highlights |
| `certification` | Credentials: issuer, dates, expiry, credential URL |
| `blogPost` | Blog articles with Portable Text body, categories |
| `socialLink` | Social media links displayed in Connect section |
| `skill` | Skills displayed in the Skills section |
| `siteSettings` | Global site configuration |

### 2. Debugging data issues

**Check if data exists via API:**

```bash
curl "https://namias-cms.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=='profile'][0]{name,email}"
```

**Common query patterns:**

```groovy
// All projects
*[_type == "project"] | order(order asc) { title, slug, summary }

// Single project by slug
*[_type == "project" && slug.current == $slug][0]

// Published documents only (exclude drafts)
*[_type == "project" && !(_id in path("drafts.**"))]

// Count documents
count(*[_type == "blogPost"])
```

**Debug in Sanity Studio:**

1. Open `http://localhost:3333`
2. Go to Vision tab (GROQ playground)
3. Run the query above
4. Check that documents exist and have the expected fields

### 3. Data mutations

**Using Sanity CLI:**

```bash
cd studio && npx sanity document create <type>
cd studio && npx sanity document edit <documentId>
cd studio && npx sanity document delete <documentId>
```

**Using GROQ mutations (via API):**

```bash
curl -X POST "https://namias-cms.api.sanity.io/v2024-01-01/data/mutate/production" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "mutations": [{
      "patch": {
        "id": "<documentId>",
        "set": { "title": "New Title" }
      }
    }]
  }'
```

### 4. Revalidation and ISR

**How revalidation works:**

- The Sanity webhook calls `/api/sanity/revalidate` when content changes
- The route uses `revalidateTag()` to invalidate cached data
- SWR in components refetches on the next client visit

**Trigger manual revalidation:**

```bash
curl -X POST "http://localhost:3000/api/sanity/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret": "<SANITY_REVALIDATE_SECRET>"}'
```

**Check revalidation is working:**

1. Change content in Sanity Studio
2. Open the frontend
3. The change should appear within the `revalidate` period (or on manual trigger)

**Common revalidation issues:**

| Symptom | Cause | Fix |
|---|---|---|
| Changes don't appear | Webhook not configured | Check Sanity webhook settings |
| Stale data persists | Tag not invalidated | Check `revalidateTag()` calls in route handlers |
| 401 on revalidate | Wrong secret | Verify `SANITY_REVALIDATE_SECRET` env var |
| Build shows old data | ISR cache | Redeploy or wait for revalidation period |

### 5. Webhook configuration

**Sanity webhook setup:**

1. Go to Sanity Management → Project → API → Webhooks
2. Create a webhook:
   - URL: `https://<your-domain>/api/sanity/revalidate`
   - Trigger on: `create`, `update`, `delete`
   - Filter: `_type in ["project", "experience", "certification", "blogPost", "profile"]`
   - Secret: match `SANITY_REVALIDATE_SECRET`

### 6. Seeding demo data

```bash
npm run sanity:seed
```

This runs `scripts/sanity/seed-demo.ts` which creates sample documents for development.

### 7. Common tasks

**Add a new field to an existing document:**

1. Edit the schema in `studio/schemas/<documentType>.ts`
2. Add the field definition
3. Run `cd studio && npx sanity typegen generate` (if using typegen)
4. Migrate existing documents if the field is required
5. Test in studio at `localhost:3333`

**Add a new document type:**

1. Create schema in `studio/schemas/<newType>.ts`
2. Register in `studio/schemas/index.ts`
3. Add to `structureDeskTool` in `studio/deskStructure.ts`
4. Create a query in the frontend to fetch it
5. Create a component to display it

## Common mistakes

- Editing documents directly in the production Sanity project without testing locally first
- Forgetting to set `revalidate` on fetch calls (`{ next: { revalidate: 60 } }`)
- Using stale GROQ queries after schema changes
- Not handling `null` responses from Sanity (always use `?? defaultValue`)

## Delivery checks

- [ ] Schema changes work in Sanity Studio locally
- [ ] Frontend renders the new/updated data correctly
- [ ] Revalidation webhook triggers and data refreshes
- [ ] No TypeScript errors after schema changes
- [ ] Draft documents are filtered out in production queries
