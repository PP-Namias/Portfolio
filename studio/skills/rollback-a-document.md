---
title: Rollback a Document
trigger: "rollback", "revert", "undo publish"
audience: editors
time: 2 min
---

# Rollback a Document

## Steps

1. Open the document.
2. Click the **History** tab (top of the editor).
3. Find the version you want to restore.
4. Click **Restore** on that version.
5. Click **Publish** to push the restored version.

## Bulk rollback
Use the **Vision tool** to inspect the history endpoint, then write
a transaction:
```groq
*[_id == "project-abc"][0] {
  "draft": *[_id == "drafts.project-abc"][0]
}
```
