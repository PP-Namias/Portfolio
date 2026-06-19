# .agents

This folder is the control center for the portfolio repo's AI-agent workflow.

## Start here

1. Read this file to understand the folder layout.
2. Use the matching rule, skill, or workflow for the task.
3. Keep the work aligned to this single portfolio repo.
4. Validate the touched area before moving to the next slice.

## Folder map

- `README.md` - entrypoint for the agent workflow notes.
- `skills/` - reusable agent behaviors for specialized tasks.

## Related repo guidance

- `.github/copilot-instructions.md` - repository-wide architecture and workflow rules.
- `.agents/skills/design/SKILL.md` - baseline UI implementation guidance.
- `.agents/skills/ui-ux-pro-max/SKILL.md` - extended UI/UX design-system workflow guidance.

## Core operating rules

- Keep feature work connected in a single branch when the tasks depend on each other.
- Prefer the smallest useful slice that can be validated.
- Use the repo's shared rules before making exceptions.
- Keep business logic, validation, and presentation separated where the codebase requires it.
- Do not duplicate guidance across files if one source of truth is enough.

## Recommended reading order

- `.github/copilot-instructions.md`
- `.agents/skills/design/SKILL.md`
- `.agents/skills/ui-ux-pro-max/SKILL.md`
- `.agents/skills/git/SKILL.md`
- `.agents/skills/tests/SKILL.md`
- `.agents/skills/impeccable/SKILL.md`

## Agent routing

- For UI and styling decisions, use `rules/ui-system.md`, `skills/design/SKILL.md`, and `skills/ui-ux-pro-max/SKILL.md`.
- For content and copy review, use `skills/content-review/SKILL.md`.
- For branch and commit formatting, use `rules/git-policy.md` and `skills/git/SKILL.md`.
- For validation and test strategy, use `skills/tests/SKILL.md`.
- For multi-step coordination, use `skills/orchestrator/SKILL.md`.
- For quick repo-hygiene and consistency checks, use `skills/impeccable/SKILL.md`.
- For prompt cleanup and reuse, update or add the relevant rule or workflow before editing multiple guides.
- For API design, use `skills/api-design/SKILL.md`.
- For database operations, use `skills/database-operations/SKILL.md`.
- For webhooks, use `skills/webhook-design/SKILL.md`.
- For GraphQL, use `skills/graphql-api/SKILL.md`.
- For Cloudflare Workers, use `skills/cloudflare-workers/SKILL.md`.
- For performance monitoring, use `skills/performance-monitoring/SKILL.md`.
- For code migration, use `skills/code-migration/SKILL.md`.
- For technical writing, use `skills/technical-writing/SKILL.md`.
- For dependency auditing, use `skills/dependency-audit/SKILL.md`.
- For feature flags, use `skills/feature-flags/SKILL.md`.
- For analytics, use `skills/analytics-integration/SKILL.md`.

## Active improvement target

The current cleanup target focuses on keeping the agent system aligned to the portfolio repo by:

- removing stale monorepo assumptions
- keeping commit and validation guidance consistent with the real scripts
- reducing duplicate instructions across nearby docs
- keeping future slices easier to start and review

## Notes

- Keep the top-level folder lean; move broad task guides into `workflows/` or delete them when stale.
- Long-lived policy should stay in `rules/`.
- If a new prompt or workflow is added, link it from this file so future agents can find it quickly.
- Archived session reports are intentionally not part of the active agent path.