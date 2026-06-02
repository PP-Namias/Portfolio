---
title: Add a Resume
trigger: "upload resume", "new resume file"
audience: editors
time: 1 min
---

# Add a Resume

## Steps

1. **Content → Pages → Homepage → Resume** → **Create new**.
2. Fields:
   - **Resume file** — required. PDF upload.
   - **Legacy resume URL** — optional fallback string.
   - **Active Resume** — boolean. Only one resume should be active at a time.
3. **Publish** — the marketing site serves the active file from `/api/resume`.
