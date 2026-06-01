# Sanity Studio Interview Plan

## Goal

Make the deployed Sanity Studio feel polished, structured, and interview-ready so it clearly demonstrates advanced CMS, presentation, Vision, and real-time workflow capability.

## What Is Already Working

- Studio is deployed online at `https://namias-cms.sanity.studio/`.
- Portfolio preview route exists at `/studio`.
- Draft mode and webhook revalidation are already wired.
- Presentation tool already maps homepage and blog content.
- Vision is already available for content parity checks.

## Studio Story to Present

1. Content is grouped by purpose, not just by schema type.
2. Preview routes show live frontend correspondence.
3. Vision validates the data model and content relationships.
4. Publish refreshes the site immediately.
5. The portfolio and Studio share the same content system in production.

## Step-by-Step Plan

1. Review the structure groups.
   - Keep homepage content, support data, blog, and reference data separated by intent.
   - Make the most important singleton content easy to find first.

2. Tighten the presentation mapping.
   - Keep homepage documents previewing on `/`.
   - Keep blog documents previewing on `/blog`.
   - Ensure any future routes have matching presentation entries.

3. Make Vision the proof layer.
   - Use it to confirm counts, ordering, and relationships.
   - Use it as the evidence that Studio structure matches the frontend.

4. Keep the real-time workflow visible.
   - Edit in Studio.
   - Preview through the portfolio.
   - Publish.
   - Confirm webhook refreshes the deployed site.

5. Polish ordering and labels where needed.
   - Prioritize readable desk names.
   - Add explicit order where lists are ambiguous.
   - Keep the demo flow obvious for interviewers.

6. Keep deployment references in sync.
   - Portfolio `/studio` page points to the hosted Studio.
   - Hosted Studio URL remains the main online editor.

## Validation Checklist

- Studio build passes
- Portfolio build passes
- Hosted Studio URL opens
- `/studio` landing page opens the hosted Studio
- Presentation preview works for homepage and blog
- Publish refresh triggers deployed site update
- Vision queries return the expected content shape

## Best Practice Notes

- Do not store real secrets in the repo.
- Keep the Studio URL in `NEXT_PUBLIC_SANITY_STUDIO_URL`.
- Keep the webhook secret in `SANITY_REVALIDATE_SECRET`.
- Commit changes in small slices.

## AI Agent Prompt

```text
You are working in the PP Namias portfolio repo on the `feature/sanity-cloudflare-deploy` branch.

Objective:
Polish the deployed Sanity Studio so it is interview-ready, clearly structured, and demonstrates real-time CMS workflow against the live portfolio.

Context:
- The Studio is deployed online at `https://namias-cms.sanity.studio/`.
- The portfolio has a `/studio` landing page.
- Presentation and Vision are already enabled.
- Draft mode and webhook refresh are already wired.

Tasks:
1. Improve Studio structure clarity and ordering only where needed.
2. Keep presentation routes aligned with the frontend.
3. Use Vision as the verification layer for content relationships and counts.
4. Preserve the live publish/refresh workflow.
5. Work in small slices and commit each completed slice separately.

Deliverables:
- Step-by-step changes made.
- Exact files changed.
- Validation results.
- Any remaining dashboard or deployment notes.
```
