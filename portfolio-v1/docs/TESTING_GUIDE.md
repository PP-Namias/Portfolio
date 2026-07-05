# Namias CMS - Test Guide

This guide walks you through every feature in the showcase, in the same order the 5-minute demo plays out. Open this on your phone or a second screen while you drive the studio on your laptop.

## Pre-flight (30 seconds)

1. **Open the studio** in a private/incognito window: https://namias-cms.sanity.studio/
   - Sign in with your Sanity account (the one tied to project `nl0qw78w`).
   - First-time only: Sanity will ask for the project name; `namias-cms` is the default.
2. **Open the marketing site** in another tab: https://namias.tech
3. **Open the Vision tool** in a third tab: from the studio sidebar, click `Vision`.
4. (Optional) Open a terminal and run:
   ```bash
   npx wrangler tail namias --format=pretty
   ```
   This will show live webhook invocations when you publish.

You should see the branded welcome screen with four quick-action cards and a "Show me around" button. If you do, the deploy worked.

---

## Test 1 - Branded welcome and onboarding tour (60 s)

**Goal:** Confirm the showcase shell renders, not the default Sanity shell.

1. The welcome screen shows the Namias palette (pink-to-indigo gradient) and four cards: "New project", "New blog post", "New certification", "Open Vision".
2. Click **"Show me around"** (or navigate to Content -> Homepage -> Hero Section).
3. A 4-step tour overlay appears. Walk through it. The tour uses `localStorage` to remember it's been seen; key is `namias:studio:onboarding-v1`.
4. To force it again, run in DevTools: `localStorage.removeItem('namias:studio:onboarding-v1')` and reload.

**What proves it works:** The overlay has the Namias pink-indigo palette, not Sanity red. The "Skip" button is keyboard-accessible (Tab to it, Enter to dismiss).

---

## Test 2 - Real-time edit on the live site (90 s)

**Goal:** Edit a field in the studio and see it appear on `namias.tech` without a refresh.

1. In the studio sidebar, open **Content -> Homepage -> Hero & shell -> Hero Section**.
2. In the `Title` field, change "Full Stack Engineer & AI Automation Specialist" to "Full Stack Engineer (live demo)".
3. Wait 2 seconds. The change appears on the marketing site **without a page refresh**.
4. The change is in the `previewDrafts` perspective. To publish for real visitors, click **Publish** (top-right).

**What proves it works:**
- The `Live` status badge (green) appears next to the document in the studio.
- The marketing site's hero text updates within ~2 seconds of the studio save.
- If `wrangler tail` is running, you see a webhook request to `/api/sanity/webhook` on publish.

**If it does not work:**
- Hard-refresh the marketing site (`Ctrl+Shift+R`). Visual Editing needs Stega in the URL or the `sanity-edit=1` flag.
- Open DevTools on the marketing site and check the network tab. There should be no failed calls to `apicdn.sanity.io`.

---

## Test 3 - Visual editing popover (60 s)

**Goal:** Click any field on the live site and jump to it in the studio.

1. Open https://namias.tech?sanity-edit=1 in a new tab.
2. Click anywhere on the hero text.
3. A small **"Edit in Studio"** popover appears near the field.
4. Click it. The studio opens, scrolled to the right field.
5. Edit the field, click outside, click **Publish**. The change goes live on the marketing site.

**What proves it works:**
- The popover uses the Namias palette, not Sanity defaults.
- The studio URL contains `?sanity-edit=...&path=...` deep-link params.
- The correct field is focused/highlighted when the studio opens.

**If it does not work:**
- Confirm the `data-sanity` attribute is on the rendered text. DevTools -> Inspect -> search for `data-sanity`. If absent, the field needs to be wrapped in `<SanityField>` in the React tree.

---

## Test 4 - Smart authoring (60 s)

**Goal:** See computed fields, validation warnings, and the SEO inspector.

1. In the studio, open **Content -> Homepage -> Main column -> About Section**.
2. The `About content` field shows live word count in the inspector (right rail).
3. Type 5 words. A warning appears: "About body length - recommended 60-600".
4. Open the SEO inspector (right rail -> SEO). The Google SERP preview updates as you type.
5. If the description is over 160 chars, a warning fires: "Description exceeds 160 chars and will be truncated."

**Computed fields:**
- **Experience** doc -> `Duration (auto)` shows "2y 4m" when you set `startDate` and `endDate`.
- **Blog Post** doc -> `Reading time (auto)` shows "3 min read (450 words)" when you write body content.

**What proves it works:** The values are read-only and recompute live as you edit other fields.

---

## Test 5 - Status badges and health (45 s)

**Goal:** The studio actively tells you what is wrong, stale, or scheduled.

1. Open any **Project** in the list. The list shows a **Featured** badge and a status pill.
2. Set `status` to `draft` and save. The **Draft** badge appears (gray).
3. Publish. The **Live** badge appears (green).
4. Set `publishAt` to 5 minutes in the future and save. The **Scheduled** badge appears (blue).
5. Open the **Content health** panel (right rail). It shows word count, alt text, references, and last-edited age.

**What proves it works:**
- The list previews have the Namias gradient border when `featured: true`.
- The status pills use the correct color set: gray/blue/green/warning/danger.

---

## Test 6 - Publish-and-revalidate modal (45 s)

**Goal:** Publish with explicit confirmation and a list of paths to revalidate.

1. Open **Content -> Homepage -> Hero & shell -> Hero Section**.
2. Change the title, click **Publish & revalidate** (the action labeled with `↻`).
3. A modal opens listing the exact paths that will be revalidated:
   - `/`
   - `/blog`
   - `/blog/[slug]`
   - `/sitemap.xml`
   - `/projects`
   - `/projects/[slug]`
4. Click **Confirm**. The publish completes. If `wrangler tail` is open, you see the webhook call.
5. The marketing site reflects the change within 2-3 seconds (faster than the default revalidation interval).

**What proves it works:**
- The modal shows the document type and ID (`heroSection#heroSection`).
- Cancel closes the modal without publishing.

---

## Test 7 - Perspective switcher (30 s)

**Goal:** Switch between published / drafts / previewDrafts without leaving the document.

1. In any document, look at the document action bar. The first action is **Perspective: ...**.
2. Click it. The label cycles: "Published only" -> "Preview drafts" -> "Drafts only".
3. The view reloads. The document shows the corresponding data slice.
4. The cookie `sanity-preview-perspective` is set; refresh and the perspective persists.

**What proves it works:**
- The cookie is readable in DevTools -> Application -> Cookies.
- A document with unpublished changes shows differently in "Drafts only" vs "Published only".

---

## Test 8 - Initial-value templates (45 s)

**Goal:** Create documents faster with pre-filled values.

1. In the studio sidebar, click the **+** next to "Projects" (or use the structure).
2. Choose **New project (draft)** vs **New project (featured)**. Each template pre-fills `status`, `year`, and `featured`.
3. Choose **New blog post (draft)**. `published` is false, `publishedAt` is set to now.
4. Choose **New experience (current)**. `endDate` is "Present" (so duration is "2y 4m" as of today).
5. Save. The new document shows the template's defaults in the inspector.

**What proves it works:**
- The "New" menu in the structure shows the template names (not just "New project").
- The new document has the expected defaults already filled in.

---

## Test 9 - Vision tool saved queries (30 s)

**Goal:** Show reviewers the data shape in 5 seconds.

1. In Vision (sidebar), paste this query:
   ```groq
   *[_type in ["heroSection", "aboutSection", "project", "post"]]{_type, _id, _updatedAt}
   ```
2. Run. You see the four most-edited document types with their IDs and last-edited times.
3. Save the query as "Homepage + content" (bookmark icon in Vision).

**What proves it works:** Vision returns JSON; the IDs match what the marketing site reads.

---

## Test 10 - Sanity Functions (advanced, requires deploy)

**Goal:** Confirm the three server-side functions fire on their triggers.

**Pre-conditions:** You must have run `cd functions && npm install && npm run deploy` (see `functions/DEPLOY.md`). The deploy uses the Blueprint manifest in `functions/sanity.blueprint.ts`.

### scheduled-publish
1. Open any **Blog Post** that has `published: false`.
2. Set `publishAt` to a time 1 minute in the past.
3. Wait for the next 5-minute tick (or click **Invoke now** in the manage UI).
4. The function promotes the post: `published: true`, `publishedAt: <now>`.
5. Check the manage UI -> Functions -> `scheduled-publish` -> Invocations tab. The latest run should show `{promoted: 1, ids: [...], ranAt: "..."}`.

### broken-refs
1. Open any **Project** in the studio. Note the value of `brokenRefsCount` (likely absent).
2. Go to **Sanity manage -> Content -> Projects**. Delete the project that another project references (or break a reference manually).
3. Trigger the function (every 6h, or click **Invoke now**).
4. Open the original Project. `brokenRefsCount` is now `1` and the **Content health** panel in the inspector shows "1 reference cannot be resolved."

### auto-tag-images
1. Upload any image via the studio (e.g., edit a project, drag an image to the cover image field).
2. Within 1-2 seconds, the function fires.
3. Open the manage UI -> Assets -> click the image. The `metadata.labels.en` field has `["demo-label"]`.

---

## Test 11 - Demo seed reset (optional)

**Goal:** Reset the dataset to a known-good state before a demo.

```bash
cd studio
npx sanity exec ../scripts/sanity/seed-demo.ts --with-user-token
```

Expected output:
```
Seeded: { hero: 1, projects: 2, certifications: 2, at: '2026-...' }
```

This is idempotent (`createOrReplace`), so running it twice is safe.

---

## Acceptance checklist

Before you record a demo or send the link to a reviewer, confirm:

- [ ] Studio loads at https://namias-cms.sanity.studio/ with the Namias palette.
- [ ] The 4-step tour runs once.
- [ ] Editing a hero field updates the live marketing site in <3 s.
- [ ] Click-to-edit on `?sanity-edit=1` opens the right field in the studio.
- [ ] Publish & revalidate modal lists the expected paths and fires the webhook.
- [ ] Status badges appear correctly: Draft / Live / Scheduled / Stale / Expiring / Featured.
- [ ] Initial-value templates pre-fill the right values.
- [ ] Vision tool returns the homepage and content data.
- [ ] (If functions are deployed) `scheduled-publish` promotes a back-dated post within 5 min.
- [ ] (If functions are deployed) `auto-tag-images` patches `metadata.labels` on upload.

If all boxes check, the showcase is ready.

---

## Where to look if something is broken

| Symptom | Where to look |
|---|---|
| Studio shows default Sanity shell | `studio/sanity.config.ts` -> `theme` and `components.welcome`. Re-run `npm run deploy` from `studio/`. |
| Visual Editing popover missing | Marketing site needs `?sanity-edit=1`. The `<SanityField>` wrapper must be on the rendered text. |
| Real-time lag > 5 s | Check the Live Content API token (`NEXT_PUBLIC_SANITY_API_VERSION=2025-10-21`). The marketing site reads from `nl0qw78w` / `production`. |
| Functions not running | `npx sanity@latest blueprints info` from `functions/`. Check that triggers are set: scheduled (cron) for the first two, image-asset/create for the third. |
| Publish webhook 401 | The webhook at `/api/sanity/webhook` requires `SANITY_REVALIDATE_SECRET` in the request body. The studio reads it from `SANITY_STUDIO_REVALIDATE_SECRET`. |
