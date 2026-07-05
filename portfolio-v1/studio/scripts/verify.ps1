# Verify Backup (Windows)
# Verifies backup integrity

$ErrorActionPreference = "Stop"

$BACKUP_DIR = ".\data\exports"

Write-Host "Verifying backup..." -ForegroundColor Cyan

# Check files exist
$docsFile = "$BACKUP_DIR\documents.ndjson"
$assetsFile = "$BACKUP_DIR\assets.ndjson"

if (-not (Test-Path $docsFile)) {
    Write-Error "documents.ndjson not found!"
    exit 1
}

if (-not (Test-Path $assetsFile)) {
    Write-Error "assets.ndjson not found!"
    exit 1
}

# Count documents
$docCount = (Get-Content $docsFile | Measure-Object -Line).Lines
Write-Host "Documents: $docCount" -ForegroundColor Green

# Count assets
$assetCount = (Get-Content $assetsFile | Measure-Object -Line).Lines
Write-Host "Assets: $assetCount" -ForegroundColor Green

# Verify NDJSON is parseable
Write-Host "`nValidating NDJSON format..." -ForegroundColor Yellow
try {
    Get-Content $docsFile | Select-Object -First 10 | ForEach-Object { $_ | ConvertFrom-Json } | Out-Null
    Write-Host "NDJSON validation: PASSED" -ForegroundColor Green
} catch {
    Write-Error "NDJSON validation: FAILED"
    exit 1
}

# Check metadata
$metadataFile = "$BACKUP_DIR\metadata.json"
if (Test-Path $metadataFile) {
    $metadata = Get-Content $metadataFile | ConvertFrom-Json
    Write-Host "`nMetadata:" -ForegroundColor Gray
    Write-Host "  Project: $($metadata.projectId)" -ForegroundColor Gray
    Write-Host "  Dataset: $($metadata.dataset)" -ForegroundColor Gray
    Write-Host "  Exported: $($metadata.exportedAt)" -ForegroundColor Gray
}

Write-Host "`nVerification complete!" -ForegroundColor Green
