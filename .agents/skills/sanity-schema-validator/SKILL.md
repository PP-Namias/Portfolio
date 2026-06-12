# Sanity Schema Validator

Validates Sanity schemas against best practices, catches common issues, and ensures consistency.

## Usage

Run the validator against the studio schemas:

```bash
node scripts/sanity-schema-validator.mjs
```

## What It Checks

1. **Required Fields**: Every schema has `title`, `name`, `type`
2. **Field Naming**: camelCase for field names, no reserved words
3. **Type Consistency**: Arrays have `of`, objects have `fields`
4. **Validation Rules**: Required fields have validation rules
5. **Preview Config**: Singleton and document types have preview config
6. **Group Usage**: Fields use groups for better UX
7. **Duplicate Detection**: No duplicate field names or schema names
8. **Deprecated Types**: No usage of deprecated Sanity types

## Output

```
✓ profile.ts - 0 issues
✗ heroSection.ts - 2 issues:
  - Missing 'title' field
  - No preview config
```

## Exit Codes

- `0`: All schemas valid
- `1`: One or more issues found

## Integration

Add to CI pipeline:

```yaml
- name: Validate Sanity schemas
  run: node scripts/sanity-schema-validator.mjs
```
