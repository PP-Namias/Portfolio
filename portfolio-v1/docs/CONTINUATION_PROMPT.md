# Continuation Prompt - Namias CMS Showcase Studio

Copy and paste the block below into a new chat to continue this work.

---

You are continuing a multi-slice implementation of a Sanity Studio "showcase" build on the repo at `C:\Users\ADMIN\Desktop\PP Namias\MASH\Portfolio`. The plan lives in `prd.json` and is fully implemented across 6 epics on branch `feature/sanity-showcase-studio`. Read the existing context files in this order before doing anything else:

1. `prd.json` - source of truth for what the showcase must do (7 epics, 29 stories, 4 phases, demo code name `atlas`).
2. `docs/STUDIO_ARCHITECTURE.md` - folder map, style rules, and extension recipes.
3. `docs/SHOWCASE_RUNBOOK.md` - the 5-minute demo walkthrough reviewers will see.
4. `docs/EXTENDING_STUDIO.md` - copy-paste recipes for fields, validations, actions, and Sanity Functions.
5. `studio/README.md` - plugin stack, badges, validations, functions, and real-time wiring.
6. `CMS_NAMIAS_TECH_DOMAIN_PLAN.md` - subdomain plan for `cms.namias.tech` (separate from showcase work).

## What is already done (do not redo)

- `a02c255` EPIC-0: env registry (`studio/env.ts`) and type registry (`studio/schemaTypes/_registry.ts`).
- `77f04f6` EPIC-1: real-time clients, SanityField, perspective switcher, preview locations.
- `1a3f45a` EPIC-2: computed fields, SEO inspector, validation rules, initial-value templates.
- `23a7f97` EPIC-3: 6 status badges, publish-and-revalidate action with modal, 4 starter tasks.
- `3e54999` EPIC-4: AI action prompts, content-health inspector, 3 Sanity Functions.
- `a7c4d22` EPIC-5: branded welcome, 4-step onboarding tour, list previews, studio theme.
- `5f3e712` EPIC-6: showcase runbook, architecture docs, extending-studio docs, demo seed.

Branch is `feature/sanity-showcase-studio` based on `main` (post-PR #248, worker `ce4f72fd` is live on `namias.tech`). Sanity project: `nl0qw78w`. Studio: `https://namias-cms.sanity.studio/`. Marketing: `https://namias.tech?sanity-edit=1`.

## Open work to pick from

Choose the next slice based on what the user is asking for. If they say "improve" or "continue", work in this priority order:

1. **Open the implementation PR.** Branch is not yet pushed. Use `git push -u origin feature/sanity-showcase-studio` and open a PR titled `feat(studio): showcase studio (EPIC-0..6) - real-time, smart authoring, branded UX`. Do not push or open the PR unless asked.
2. **Fix the pre-existing typecheck warnings** in `studio/`:
   - `studio/preview/previewLocations.ts` is fine now but the rest of the studio has drift between Sanity 4.22 types and our usage. Specifically: `publishAndRefreshAction.tsx` (disabled type), `statusBadges.tsx` (color set is "gray"/"green" but the new type allows "warning"|"success"|"primary"|"danger"|undefined), `perspectiveSwitcher.tsx` (imports `sanity/lib/perspective` which is not exported - it should be from `sanity`). Run `cd studio && npx tsc --noEmit` to see all of them.
3. **Wire AI assist** to a real provider. `studio/ai/prompts.ts` is a registry only. Add `sanity-plugin-ai-assist` and bind the `AI_ACTIONS` map to document types.
4. **Add the Tasks plugin** (`sanity-plugin-dashboard-widget-tasks` or `sanity-plugin-tasks`) and wire `studio/seed/tasks.ts` into the Tasks configuration.
5. **Deploy the Sanity Functions** (EPIC-4). They are stubbed in `functions/`. The user must add `SANITY_API_WRITE_TOKEN` to a `.env` and run `cd functions && npm install && npm run deploy:all`. Make the deploys one-command for the user.
6. **Add a Vision tool example book** (saved GROQ queries) so reviewers can see the marketing site's data shape in 5 seconds.
7. **Add a custom Vision tool panel** that shows "Last published" and "Pending in drafts" per type.
8. **Add a CSP-friendly iframe** for the presentation tool, configurable in `sanity.config.ts`.
9. **Add accessibility** to all custom components: ARIA labels on buttons, keyboard nav on the tour, focus trap on the publish modal.
10. **Add Storybook** for the custom components (`Welcome`, `Onboarding`, list previews, status badges). Use the existing React 19 + Sanity 4.22 stack.

## House rules

- Working dir: `C:\Users\ADMIN\Desktop\PP Namias\MASH\Portfolio`. Platform: win32 PowerShell 5.1.
- One commit per epic or per logical slice. PR descriptions are ASCII-safe (no em-dash, no emoji) because of an opencode -> GitHub pipe that mangles them.
- ESLint 9 flat config; scope lint to source tree, exclude `.open-next/**`, `.next/**`, `studio/dist/**`.
- TypeScript strict. No `.js` in `studio/` except for `eslint.config.mjs` and `scripts/`.
- Do not push, force-push, or open PRs unless explicitly asked.
- If a request is ambiguous, ask one focused question with three options (or "Other").
- When you finish a slice, run `cd studio && npx tsc --noEmit` and `cd studio && npm run lint` if a lint script exists, then report.
- For Cloudflare deploys: `npm run cloudflare:deploy` builds with `--dangerouslyUseUnsupportedNextVersion`; the patch in `patches/@opennextjs+aws+4.0.2.patch` short-circuits the version guard. Do not remove this patch.
- For Sanity, the project id and dataset are `nl0qw78w` / `production`. The studio is deployed as a Sanity-hosted studio (Studio v3, embedded). The marketing site reads from the same dataset.

## Style

- One file per document type in `studio/schemaTypes/`.
- Computed fields are `readOnly: true` with a `components: {input: ...}` custom input.
- Validations are pure functions in `studio/validation/rules.ts`; no inline closures longer than 5 lines.
- Custom UI components are stateless and accept only the props Sanity provides.
- No new dependencies without first checking the existing `package.json` (root and `studio/`) to see if the package is already there.
- No comments unless they are JSDoc for a public API.

## Reporting

When you finish a slice, output a 4-line summary in this exact format:

```
<commit-sha> <type>(<scope>): <subject>
  files: <count> changed, <insertions>(+), <deletions>(-)
  build: OK (or ERROR with the relevant tsc line)
  next: <one-line description of the next slice>
```

If the user is mid-conversation and asks a question, answer concisely (<4 lines) and only expand when asked. If the user says "stop", stop and produce a one-paragraph "what was done, what is left" summary.

## Things to remember across sessions

- The studio's old publish webhook (`publishAndRefreshAction.tsx`) and the new publish-and-revalidate modal (`publishAndRevalidateAction.tsx`) coexist intentionally. Do not delete the old one - it is the demo's existing path.
- `publishAndRevalidateModalAction.tsx` is wired through `studioBadges` documentation but not yet registered in `sanity.config.ts`. If you wire it, register it in the `document.actions` array, not in badges.
- `studio/env.ts` has both `getStudioEnvSnapshot` (new) and `requireStudioEnv` (legacy). Keep both; new code uses snapshot.
- The Onboarding tour uses `localStorage` for the "seen" flag. The key is `namias:studio:onboarding-v1`. If you bump the tour, bump the key suffix.
- The `Onboarding` component is named `OnboardingTour` (the file is `Onboarding.tsx`). Do not rename.

Now ask me which slice to work on next, or say "continue with #1" to push the branch and open the PR.
