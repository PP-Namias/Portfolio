#!/bin/bash
# Restore Sanity Data (Unix)
# Restores documents from backup

set -e

PROJECT_ID="nl0qw78w"
DATASET="production"
BACKUP_DIR="./data/exports"

echo "Starting Sanity restore..."
echo "Project: $PROJECT_ID"
echo "Dataset: $DATASET"

# Check backup exists
DOCS_FILE="$BACKUP_DIR/documents.ndjson"
if [ ! -f "$DOCS_FILE" ]; then
    echo "Error: Backup file not found: $DOCS_FILE"
    exit 1
fi

DOC_COUNT=$(wc -l < "$DOCS_FILE")
echo "Found $DOC_COUNT documents to restore"

# Confirm restore
echo ""
read -p "This will replace all content in $DATASET. Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled"
    exit 0
fi

# Import documents
echo ""
echo "Importing documents..."
sanity dataset import "$DOCS_FILE" "$DATASET" --project "$PROJECT_ID" --replace

echo ""
echo "Restore complete!"
echo "Restored $DOC_COUNT documents"
