#!/bin/bash
# Backup Sanity Data (Unix)
# Exports all documents and assets from Sanity CMS

set -e

PROJECT_ID="nl0qw78w"
DATASET="production"
OUTPUT_DIR="./data/exports"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Starting Sanity backup..."
echo "Project: $PROJECT_ID"
echo "Dataset: $DATASET"
echo "Output: $OUTPUT_DIR"

# Export documents
echo ""
echo "Exporting documents..."
DOCS_FILE="$OUTPUT_DIR/documents.ndjson"
sanity dataset export "$DATASET" "$DOCS_FILE" --project "$PROJECT_ID"
DOC_COUNT=$(wc -l < "$DOCS_FILE")
echo "Exported $DOC_COUNT documents"

# Export assets
echo ""
echo "Exporting assets..."
ASSETS_FILE="$OUTPUT_DIR/assets.ndjson"
sanity dataset export "$DATASET" "$ASSETS_FILE" --project "$PROJECT_ID" --type assets
ASSET_COUNT=$(wc -l < "$ASSETS_FILE")
echo "Exported $ASSET_COUNT assets"

# Export schema
echo ""
echo "Exporting schema..."
SCHEMA_FILE="$OUTPUT_DIR/schema.json"
sanity schema export --project "$PROJECT_ID" > "$SCHEMA_FILE" 2>/dev/null || echo "Warning: Failed to export schema (non-critical)"

# Create metadata
cat > "$OUTPUT_DIR/metadata.json" << EOF
{
  "projectId": "$PROJECT_ID",
  "dataset": "$DATASET",
  "exportedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "documentCount": $DOC_COUNT,
  "assetCount": $ASSET_COUNT
}
EOF

echo ""
echo "Backup complete!"
echo "Documents: $DOCS_FILE"
echo "Assets: $ASSETS_FILE"
echo "Schema: $SCHEMA_FILE"
echo "Metadata: $OUTPUT_DIR/metadata.json"
