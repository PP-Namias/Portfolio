# Restore Sanity Data (Windows)
# Restores documents from backup

$ErrorActionPreference = "Stop"

$PROJECT_ID = "nl0qw78w"
$DATASET = "production"
$BACKUP_DIR = ".\data\exports"

Write-Host "Starting Sanity restore..." -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID" -ForegroundColor Gray
Write-Host "Dataset: $DATASET" -ForegroundColor Gray

# Check backup exists
$docsFile = "$BACKUP_DIR\documents.ndjson"
if (-not (Test-Path $docsFile)) {
    Write-Error "Backup file not found: $docsFile"
    exit 1
}

$docCount = (Get-Content $docsFile | Measure-Object -Line).Lines
Write-Host "Found $docCount documents to restore" -ForegroundColor Yellow

# Confirm restore
$confirm = Read-Host "This will replace all content in $DATASET. Continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Restore cancelled" -ForegroundColor Red
    exit 0
}

# Import documents
Write-Host "`nImporting documents..." -ForegroundColor Yellow
sanity dataset import $docsFile $DATASET --project $PROJECT_ID --replace 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to import documents"
    exit 1
}

Write-Host "`nRestore complete!" -ForegroundColor Green
Write-Host "Restored $docCount documents" -ForegroundColor Gray
