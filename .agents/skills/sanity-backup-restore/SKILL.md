# Sanity Backup & Restore

Backup and restore Sanity content and schemas.

## Usage

```bash
# Backup all content
node scripts/sanity-backup.mjs backup

# Backup specific document types
node scripts/sanity-backup.mjs backup --types project,experience

# Restore from backup
node scripts/sanity-backup.mjs restore backup-2024-01-15.json

# List backups
node scripts/sanity-backup.mjs list

# Compare two backups
node scripts/sanity-backup.mjs diff backup1.json backup2.json
```

## Backup Format

```json
{
  "metadata": {
    "projectId": "nl0qw78w",
    "dataset": "production",
    "timestamp": "2024-01-15T10:30:00Z",
    "documentCount": 45
  },
  "documents": [
    {
      "_id": "abc123",
      "_type": "project",
      "title": "My Project",
      ...
    }
  ]
}
```

## Features

1. **Incremental Backups**: Only backup changed documents
2. **Compression**: gzip compression for large datasets
3. **Selective Restore**: Restore specific document types
4. **Conflict Resolution**: Handle duplicate IDs gracefully
5. **Dry-Run Mode**: Preview restore without applying

## Safety Features

1. **Auto-Backup**: Create backup before any migration
2. **Validation**: Check backup integrity before restore
3. **Rollback**: Easy rollback if restore fails
4. **Logging**: Detailed logs of all operations

## Integration

```yaml
- name: Backup Sanity content
  run: |
    node scripts/sanity-backup.mjs backup --types project,experience,certification
    # Upload to cloud storage
    aws s3 cp backup-*.json s3://my-backups/sanity/
```

## Backup Schedule

Recommended backup schedule:
- **Daily**: Backup critical content (projects, experience)
- **Weekly**: Full backup of all content
- **Before Migrations**: Always backup before running migrations
