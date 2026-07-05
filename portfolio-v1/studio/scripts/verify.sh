#!/bin/bash
# Verify Backup (Unix)
# Verifies backup integrity

set -e

BACKUP_DIR="./data/exports"

echo "Verifying backup..."

# Check files exist
DOCS_FILE="$BACKUP_DIR/documents.ndjson"
ASSETS_FILE="$BACKUP_DIR/assets.ndjson"

if [ ! -f "$DOCS_FILE" ]; then
    echo "Error: documents.ndjson not found!"
    exit 1
fi

if [ ! -f "$ASSETS_FILE" ]; then
    echo "Error: assets.ndjson not found!"
    exit 1
fi

# Count documents
DOC_COUNT=$(wc -l < "$DOCS_FILE")
echo "Documents: $DOC_COUNT"

# Count assets
ASSET_COUNT=$(wc -l < "$ASSETS_FILE")
echo "Assets: $ASSET_COUNT"

# Verify NDJSON is parseable
echo ""
echo "Validating NDJSON format..."
head -n 10 "$DOCS_FILE" | while read -r line; do
    echo "$line" | python3 -m json.tool > /dev/null 2>&1 || {
        echo "Error: NDJSON validation failed"
        exit 1
    }
done
echo "NDJSON validation: PASSED"

# Check metadata
METADATA_FILE="$BACKUP_DIR/metadata.json"
if [ -f "$METADATA_FILE" ]; then
    echo ""
    echo "Metadata:"
    cat "$METADATA_FILE"
fi

echo ""
echo "Verification complete!"
