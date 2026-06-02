# Showcase Runbook

A five-minute, replayable walkthrough of the Namias CMS at `https://namias-cms.sanity.studio`. Designed to be handed to a reviewer (hiring manager, lead, client) and replayed end-to-end with the marketing site at `https://namias.tech` open in a second window.

## Before the demo (60 seconds)

1. Open the studio at `https://namias-cms.sanity.studio` and sign in.
2. Open the marketing site at `https://namias.tech?sanity-edit=1` in a second window. The `sanity-edit=1` flag enables Visual Editing overlays.
3. In a third tab, open the **Presentation** tool from the studio top nav.
4. Optional: open the terminal and run `npx wrangler tail namias --format=pretty` to live-watch the worker logs.

## Top nav (5s)

> "Four built-in tools plus three custom tools, each in the top nav."

- **Content** (structure tool) - page-first IA, max 2 levels deep.
- **Presentation** - live preview with click-to-edit on `https://namias.tech`.
- **Vision** - GROQ query editor.
- **Skills** (custom) - 42 step-by-step recipes for common tasks.
- **Saved Queries** (custom) - 5 curated GROQ queries for audits.
- (Plus: **AI Assist** in every text field.)

## The 5-minute walkthrough

### Beat 1 - Welcome screen (15s)

> "This is not the default Sanity studio. It is branded, role-aware, and ships with 6 quick-action cards plus an onboarding tour."

- Land on `/studio` after sign-in. Show the branded welcome screen.
- 6 cards: New project, New post, New certification, Browse skills, Open Presentation, Saved Queries.
- Click "Show me the demo". The 4-task onboarding tour pops.

### Beat 2 - Edit a field, see it live (45s)

> "Editing the hero in the studio shows up on namias.tech within a second. No refresh, no deploy."

- From the sidebar, open **Pages → Homepage → Hero Section**.
- Change the `title` (primary title) to include a marker, e.g. `Full Stack Engineer (live demo)`.
- Switch to the marketing site tab. The change is visible without a refresh.

### Beat 3 - Visual editing on the live site (60s)

> "Click any field on the live site. It opens in the studio at the right place."

- On the marketing site, click any text in the hero (with `?sanity-edit=1` in the URL).
- The popover shows "Edit in Studio". Click it.
- The studio opens at the same field. The jump-link uses the `data-sanity` attribute we wired in EPIC-1.
- Alternatively, in the studio, click the **Open in Presentation** action in the document action menu.

### Beat 4 - Publish & revalidate (60s)

> "Publish is one click. The site revalidates only the routes that need to, with a confirmation modal."

- Back in the studio on Hero Section, click **Publish & revalidate**.
- The confirmation modal lists the exact paths that will be revalidated.
- Click confirm. Watch `wrangler tail namias` light up with the webhook request.
- Switch to the marketing site. The change is now in the published perspective.

### Beat 5 - Status badges and health (45s)

> "The studio is not just a database with a UI. It actively tells you what is stale, missing, or scheduled."

- From the sidebar, open any **Project** under **Pages → Homepage → Projects**. The list shows a Featured badge, status pill, and a status field on the document.
- Open the right-side inspector and find the **Content health** panel (EPIC-4): word count, alt text, references, last-edited.
- Click the **Saved Queries** tool in the top nav. Show the "Stale content" query. Click **Copy**, paste into Vision, and run.
- Show the **Skills** tool. Open the `use-status-badges.md` skill. Walk through the 6 badge colors.

### Beat 6 - AI assist and scheduled publishing (60s)

> "AI does not auto-save. It suggests. And scheduled publishing runs on a serverless function, not a cron."

- Open the **Quick Start** group in the sidebar. Click **New post (click + to create)**.
- Use the **New blog post (draft)** template.
- Set the `excerpt` to a long paragraph.
- In a long-form field, trigger AI assist (custom action wired in `studio/ai/prompts.ts`). Show the prompt template and the output.
- Set `publishAt` to 5 minutes from now and save. Show that the document is now flagged **Scheduled** in the list view.
- Open the manage console at `sanity.io/manage` → Functions → `scheduled-publish`. Show that it is deployed and runs every 5 minutes.

### Closing

> "The studio is opinionated. It does not hide the schema, it explains it. And every automation has a reason next to it. This is what a CMS looks like when it is built for the editor first."

## Reset

To reset the demo data before a fresh run:

```bash
cd studio
npx sanity exec ../scripts/sanity/seed-demo.ts --with-user-token
```

See `scripts/sanity/seed-demo.ts` for the seed dataset.

## Deep links for the demo

| Action | URL |
|---|---|
| Welcome screen | `/studio` |
| Structure tool | `/studio/structure` |
| Hero Section | `/studio/structure/singleton%3AheroSection;heroSection` |
| Projects list | `/studio/structure/project` |
| Posts list | `/studio/structure/post` |
| Presentation | `/studio/presentation` |
| Skills | `/studio/skills` |
| Saved Queries | `/studio/saved-queries` |
| Vision | `/studio/vision` |

