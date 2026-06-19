# Data Backup & Restore

This folder contains scripts to backup and restore Sanity CMS data.

## Quick Start

### Backup (Windows)
```powershell
.\scripts\backup.ps1
```

### Backup (Mac/Linux)
```bash
./scripts/backup.sh
```

### Restore (Windows)
```powershell
.\scripts\restore.ps1
```

### Restore (Mac/Linux)
```bash
./scripts/restore.sh
```

## Files

| File | Description |
|------|-------------|
| `exports/` | Backup files directory |
| `backup.ps1` | Windows backup script |
| `backup.sh` | Unix backup script |
| `restore.ps1` | Windows restore script |
| `restore.sh` | Unix restore script |
| `verify.ps1` | Windows verification script |
| `verify.sh` | Unix verification script |

## Requirements

- Node.js 18+
- Sanity CLI installed
- Sanity API token with read/write access

## Environment Variables

Set these before running scripts:

```powershell
# Windows
$env:SANITY_API_READ_TOKEN="your-token"
$env:SANITY_API_WRITE_TOKEN="your-token"
```

```bash
# Unix
export SANITY_API_READ_TOKEN="your-token"
export SANITY_API_WRITE_TOKEN="your-token"
```

## What Gets Backed Up

1. **Documents** - All content documents
2. **Assets** - All images and files
3. **Schema** - Schema definitions

## Verification

After backup, run verification:

```powershell
.\scripts\verify.ps1
```

This checks:
- Files exist
- Files are not empty
- NDJSON is parseable
- Document count matches expected
