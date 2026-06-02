---
title: Use Templates
trigger: "template", "initial values"
audience: editors
time: 2 min
---

# Use Templates

## What it does
Templates pre-fill a new document with smart defaults. We ship
templates for: project (featured/draft), experience (current),
certification (new), post (draft), membership, recommendation,
galleryImage, aboutSection.

## Steps

1. **Click Create new** in any list view.
2. **Pick a template** from the dropdown. Each template has a short
   description.
3. The form opens pre-filled. **Edit the fields you need** and publish.

## Templates are defined in
- `studio/templates/index.ts` — registry
- `studio/templates/<name>.ts` — each template

## Adding a new template
See `add-a-validation-rule.md` and `add-an-initial-value-template.md`
in the extending guide.
