# Sanity Migration Helper

Helps write, validate, and run Sanity data migrations safely.

## Usage

```bash
# Generate migration template
node scripts/sanity-migration-helper.mjs create "add-new-field"

# Validate migration before running
node scripts/sanity-migration-helper.mjs validate migration-name

# Run migration with dry-run
node scripts/sanity-migration-helper.mjs run migration-name --dry-run

# Run migration for real
node scripts/sanity-migration-helper.mjs run migration-name

# Rollback migration
node scripts/sanity-migration-helper.mjs rollback migration-name
```

## Migration Template

```typescript
import { defineMigration } from 'sanity/migrate';

export default defineMigration({
  name: 'add-new-field',
  documentTypes: ['project'],
  
  async migrate(document) {
    // Transform the document
    return {
      ...document,
      newField: 'default value',
    };
  },
  
  // Optional: condition to skip certain documents
  shouldMigrate(document) {
    return !document.newField;
  },
});
```

## Safety Features

1. **Dry-Run Mode**: Preview changes without applying
2. **Rollback Support**: Every migration can be reversed
3. **Idempotent**: Safe to run multiple times
4. **Logging**: Detailed logs of all changes
5. **Validation**: Check migration before running

## Best Practices

1. Always test with `--dry-run` first
2. Create backups before major migrations
3. Use `shouldMigrate` to skip already-migrated documents
4. Keep migrations small and focused
5. Document what each migration does

## Integration

```yaml
- name: Run Sanity migration
  run: |
    node scripts/sanity-migration-helper.mjs validate ${{ github.event.migration }}
    node scripts/sanity-migration-helper.mjs run ${{ github.event.migration }} --dry-run
    node scripts/sanity-migration-helper.mjs run ${{ github.event.migration }}
```
