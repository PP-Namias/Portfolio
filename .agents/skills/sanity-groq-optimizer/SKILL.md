# Sanity GROQ Optimizer

Analyzes and optimizes GROQ queries for better performance.

## Usage

```bash
# Analyze a GROQ query
echo '*[_type == "project"]{_id, title, description}' | node scripts/sanity-groq-optimizer.mjs analyze

# Optimize a GROQ query
echo '*[_type == "project"] | order(_createdAt desc) {_id, title}' | node scripts/sanity-groq-optimizer.mjs optimize

# Get optimization suggestions
node scripts/sanity-groq-optimizer.mjs suggest "your-query-here"
```

## What It Checks

1. **Missing Filters**: Queries without type filters scan all documents
2. **Projection Size**: Fetching more fields than needed
3. **Order Without Filter**: Ordering without filtering is expensive
4. **Nested Queries**: Deep nesting can be slow
5. **Array Operations**: Unnecessary array operations
6. **Reference Traversal**: Inefficient reference lookups

## Optimization Tips

### Before
```groq
*[_type == "project"] {
  _id,
  title,
  description,
  image {
    asset->{url},
    alt
  },
  tags[],
  technologies[]->{
    name,
    category
  }
}
```

### After
```groq
*[_type == "project" && !(_id in path("drafts.**"))] {
  _id,
  title,
  shortDescription,
  "imageUrl": image.asset->url,
  "technologies": technologies[]->name
}
```

## Common Optimizations

1. **Filter Drafts**: Add `&& !(_id in path("drafts.**"))` to exclude drafts
2. **Limit Results**: Use `[0...10]` to limit result sets
3. **Project Only Needed Fields**: Don't fetch what you don't use
4. **Use Referenced Fields**: Avoid nested queries when possible
5. **Cache Queries**: Use `useCdn: true` for read-heavy queries

## Integration

```yaml
- name: Optimize GROQ queries
  run: node scripts/sanity-groq-optimizer.mjs check-all
```
