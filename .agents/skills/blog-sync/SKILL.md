---
name: blog-sync
description: Syncs blog posts between local MD files and Sanity CMS. Use when the user wants to push local posts to Sanity, pull from Sanity, or see what would change.
---

# Sync Blog Posts

Use this skill when the user wants to synchronize blog content between local MD files and Sanity CMS.

## When to use this skill

- "sync my blog posts", "push posts to Sanity"
- "pull posts from Sanity", "update local posts"
- "publish my changes", "make my posts live"
- "sync the blog content"

## Commands

### Diff (show what would change)

```bash
npm run blog:diff
```

Shows: new local, new remote, modified, in-sync posts.

### Pull (Sanity → Local)

```bash
npm run blog:pull
```

Downloads all Sanity posts as local MD files. Skips existing files unless `--force`.

### Push (Local → Sanity, dry-run by default)

```bash
npm run blog:push              # dry-run
npm run blog:push --force      # actually push
```

Uploads local MD files to Sanity. Only pushes `published: true` posts unless `--include-drafts`.

## Workflow

1. **Always diff first** — show the user what would change:

   ```bash
   npm run blog:diff
   ```

2. **Confirm direction** — ask the user:
   - "Push local changes to Sanity?"
   - "Pull from Sanity to local?"
   - Or just show the diff if they asked to review

3. **Execute sync** — run the appropriate command

4. **Report results** — show what was created/updated/skipped

## Safety rules

- **Dry-run is the default** for push — never push without explicit confirmation
- **Drafts stay local** unless `--include-drafts` is set
- **Existing files are skipped** unless `--force` is set
- **Always show the diff** before executing a sync

## Conflict resolution

If a post exists both locally and remotely with different content:

- Report the conflict
- Ask the user which version to keep
- Offer `--force` to overwrite

## Example interaction

```
User: "sync my blog"
Agent:
  1. Runs npm run blog:diff
  2. Shows: 2 new local, 1 modified, 9 in-sync
  3. Asks: "Push 3 changed posts to Sanity?"
  4. User confirms
  5. Runs npm run blog:push --force
  6. Reports: 2 created, 1 updated
```
