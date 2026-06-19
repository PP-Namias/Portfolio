# Backup Sanity Data (Windows)
# Exports all documents and assets from Sanity CMS

$ErrorActionPreference = "Stop"

$PROJECT_ID = "nl0qw78w"
$DATASET = "production"
$OUTPUT_DIR = ".\data\exports"

# Create output directory
if (-not (Test-Path $OUTPUT_DIR)) {
    New-Item -ItemType Directory -Force -Path $OUTPUT_DIR | Out-Null
}

Write-Host "Starting Sanity backup..." -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID" -ForegroundColor Gray
Write-Host "Dataset: $DATASET" -ForegroundColor Gray
Write-Host "Output: $OUTPUT_DIR" -ForegroundColor Gray

# Export documents
Write-Host "`nExporting documents..." -ForegroundColor Yellow
$docsFile = "$OUTPUT_DIR\documents.ndjson"
npx sanity dataset export $DATASET $docsFile --project $PROJECT_ID 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to export documents"
    exit 1
}
$docCount = (Get-Content $docsFile | Measure-Object -Line).Lines
Write-Host "Exported $docCount documents" -ForegroundColor Green

# Export assets
Write-Host "`nExporting assets..." -ForegroundColor Yellow
$assetsFile = "$OUTPUT_DIR\assets.ndjson"
npx sanity dataset export $DATASET $assetsFile --project $PROJECT_ID --type assets 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to export assets"
    exit 1
}
$assetCount = (Get-Content $assetsFile | Measure-Object -Line).Lines
Write-Host "Exported $assetCount assets" -ForegroundColor Green

# Export schema
Write-Host "`nExporting schema..." -ForegroundColor Yellow
$schemaFile = "$OUTPUT_DIR\schema.json"
npx sanity schema export --project $PROJECT_ID > $schemaFile 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Failed to export schema (non-critical)"
}

# Create metadata
$metadata = @{
    projectId = $PROJECT_ID
    dataset = $DATASET
    exportedAt = (Get-Date).ToString("o")
    documentCount = $docCount
    assetCount = $assetCount
} | ConvertTo-Json
$metadata | Out-File "$OUTPUT_DIR\metadata.json" -Encoding UTF8

Write-Host "`nBackup complete!" -ForegroundColor Green
Write-Host "Documents: $docsFile" -ForegroundColor Gray
Write-Host "Assets: $assetsFile" -ForegroundColor Gray
Write-Host "Schema: $schemaFile" -ForegroundColor Gray
Write-Host "Metadata: $OUTPUT_DIR\metadata.json" -ForegroundColor Gray
