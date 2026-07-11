# Data Backup Strategy

> **Priority:** P0 — Must complete before any schema changes  
> **Status:** Planning

---

## Goal

Export ALL data from Sanity CMS before refactoring. This ensures:
- No data loss during schema changes
- Ability to restore if migration fails
- Historical record of content state

---

## What to Backup

### 1. Documents (Content)

| Schema Type | Count | Priority |
|-------------|-------|----------|
| `profile` | 1 | Critical |
| `aboutSection` | 1 | Critical |
| `techStack` | 1 | Critical |
| `siteSettings` | 1 | Critical |
| `seoSettings` | 1 | Critical |
| `mediaSettings` | 1 | Critical |
| `project` | ~10-20 | Critical |
| `experience` | ~5-10 | Critical |
| `certification` | ~5-15 | High |
| `post` | ~0-10 | High |
| `author` | ~1-3 | High |
| `category` | ~3-5 | High |
| `membership` | ~1-5 | Medium |
| `recommendation` | ~1-5 | Medium |
| `galleryImage` | ~10-30 | Medium |
| `resume` | ~1-2 | Medium |
| `certificationCategory` | ~3-5 | Low |
| `certificationIssuer` | ~5-10 | Low |
| `galleryCategory` | ~3-5 | Low |

### 2. Assets (Images, Files)

- All images uploaded to Sanity
- All files uploaded to Sanity
- Asset metadata (alt text, captions, credits)

### 3. Schema Definitions

- All schema type definitions
- Validation rules
- Preview configurations
- Document actions

---

## Backup Scripts

### Export Script (PowerShell)

```powershell
# scripts/backup-sanity.ps1
# Exports all documents and assets from Sanity

$PROJECT_ID = "nl0qw78w"
$DATASET = "production"
$OUTPUT_DIR = "./data/exports"

# Create output directory
New-Item -ItemType Directory -Force -Path $OUTPUT_DIR

# Export all documents
sanity dataset export $DATASET "$OUTPUT_DIR/documents.ndjson" --project $PROJECT_ID

# Export all assets
sanity dataset export $DATASET "$OUTPUT_DIR/assets.ndjson" --project $PROJECT_ID --type assets

Write-Host "Backup complete: $OUTPUT_DIR"
```

### Export Script (Bash)

```bash
#!/bin/bash
# scripts/backup-sanity.sh
# Exports all documents and assets from Sanity

PROJECT_ID="nl0qw78w"
DATASET="production"
OUTPUT_DIR="./data/exports"

# Create output directory
mkdir -p $OUTPUT_DIR

# Export all documents
sanity dataset export $DATASET "$OUTPUT_DIR/documents.ndjson" --project $PROJECT_ID

# Export all assets
sanity dataset export $DATASET "$OUTPUT_DIR/assets.ndjson" --project $PROJECT_ID --type assets

echo "Backup complete: $OUTPUT_DIR"
```

### Restore Script (PowerShell)

```powershell
# scripts/restore-sanity.ps1
# Restores documents from backup

$PROJECT_ID = "nl0qw78w"
$DATASET = "production"
$BACKUP_FILE = "./data/exports/documents.ndjson"

# Import documents
sanity dataset import $BACKUP_FILE $DATASET --project $PROJECT_ID --replace

Write-Host "Restore complete from: $BACKUP_FILE"
```

---

## Backup Structure

```
studio/
├── data/
│   ├── exports/
│   │   ├── documents.ndjson      # All documents
│   │   ├── assets.ndjson         # All assets
│   │   ├── schema.json           # Schema definitions
│   │   └── metadata.json         # Backup metadata
│   ├── README.md                 # How to use backups
│   ├── backup.ps1                # Windows backup script
│   ├── backup.sh                 # Unix backup script
│   ├── restore.ps1               # Windows restore script
│   └── restore.sh                # Unix restore script
```

---

## Verification Checklist

After backup, verify:

- [ ] `documents.ndjson` exists and is not empty
- [ ] `assets.ndjson` exists and is not empty
- [ ] File sizes are reasonable
- [ ] Can parse NDJSON without errors
- [ ] Document count matches expected
- [ ] All critical documents present

### Verification Script

```powershell
# scripts/verify-backup.ps1
# Verifies backup integrity

$BACKUP_DIR = "./data/exports"

# Check files exist
if (-not (Test-Path "$BACKUP_DIR/documents.ndjson")) {
    Write-Error "documents.ndjson not found!"
    exit 1
}

if (-not (Test-Path "$BACKUP_DIR/assets.ndjson")) {
    Write-Error "assets.ndjson not found!"
    exit 1
}

# Count documents
$docCount = (Get-Content "$BACKUP_DIR/documents.ndjson" | Measure-Object -Line).Lines
Write-Host "Documents exported: $docCount"

# Count assets
$assetCount = (Get-Content "$BACKUP_DIR/assets.ndjson" | Measure-Object -Line).Lines
Write-Host "Assets exported: $assetCount"

# Verify NDJSON is parseable
try {
    Get-Content "$BACKUP_DIR/documents.ndjson" | ForEach-Object { $_ | ConvertFrom-Json } | Out-Null
    Write-Host "NDJSON validation: PASSED"
} catch {
    Write-Error "NDJSON validation: FAILED"
    exit 1
}

Write-Host "Backup verification complete!"
```

---

## Timing

| Step | Duration | Notes |
|------|----------|-------|
| Export documents | ~30s | Depends on document count |
| Export assets | ~1-5min | Depends on asset count |
| Verify backup | ~10s | Quick validation |
| **Total** | **~2-6min** | |

---

## Rollback Plan

If backup fails:
1. Check Sanity API token permissions
2. Verify project ID and dataset
3. Check network connectivity
4. Try manual export via Sanity CLI

---

## Commit Strategy

```
plan(sanity): add data backup strategy
data(sanity): add backup scripts
data(sanity): add restore scripts
data(sanity): add verification script
```
