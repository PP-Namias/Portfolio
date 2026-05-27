# AI Agent Prompt - Sanity Full Completion

Use this prompt in a new Copilot chat to execute the migration plan slice by slice.

## Prompt

You are the autonomous coding agent for this repository.

Primary mission:
Execute the Sanity full integration in small slices until the portfolio is fully Sanity-driven for content and media, then remove obsolete local hardcoded/local JSON runtime content sources and archive the migration notes.

Mandatory files to read first:
1. `.github/copilot-instructions.md`
2. `SANITY_COMPLETE_INTEGRATION_PLAN.md`
3. `SANITY_CMS_IMPROVEMENT_PLAN.md`
4. `SANITY_LIVE_UPDATE_PLAN.md`
5. `prd.json`
6. `progress.txt`

Execution rules:
- Work one slice at a time.
- Do not batch unrelated changes.
- For each slice: ANALYZE -> PLAN -> IMPLEMENT -> VALIDATE -> COMMIT -> LOG -> CONTINUE.
- Commit every completed slice locally using conventional commits with a slice ID.
- Never push unless explicitly asked.
- Prefer minimal diff and preserve architecture constraints.

Validation rules:
- Always run `npm run lint`.
- Run targeted tests for changed areas.
- Run `npm run build` on integration/cutover/cleanup slices.
- If validation fails, fix before committing.

Data-source rules:
- Do not remove local runtime content sources until parity checks pass.
- Enforce deterministic migration behavior (idempotent imports, stable IDs, reference integrity).
- Ensure all runtime content/media reads are Sanity-backed before deleting fallback paths.
- Treat the legacy migration fixtures as archived history once the cutover is complete.

Cleanup end-state rules:
- After successful cutover, remove obsolete local data/image runtime dependencies.
- Remove dead code and unused imports/types/files introduced by migration.
- Ensure website still renders correctly from Sanity-only content paths.
- Keep migration docs/prompts accurate by labeling legacy JSON fixtures as archived history.

Git hygiene rules:
- After each slice, confirm commit success.
- At the final slice, ensure no untracked/uncommitted files remain (`git status --short` should be empty).

Progress logging rules:
- Update `progress.txt` with one concise line per completed slice.
- Update plan/checklist status in `SANITY_COMPLETE_INTEGRATION_PLAN.md` or `prd.json` as needed.

Stop conditions:
- Stop only for a real blocker requiring user decision (missing credentials, conflicting product decision, destructive choice without approval).
- If blocked, provide exact blocker, impact, and 1-3 options.

Final report format:
1. Completed slices (with commit hashes and messages)
2. Validation results (lint/build/tests)
3. Deleted legacy sources (exact list)
4. Remaining risks (if any)
5. Confirmation of clean git tree

Now start with the first eligible slice from `SANITY_COMPLETE_INTEGRATION_PLAN.md`.
