# Agent guide

This file is the entry point for any agent (opencode, future coding agents, or human contributors) working on the PP Namias portfolio. It captures the repo's working agreements, the available skills, and the most common workflows.

## Skills

- `run-react-doctor` — how to read the react-doctor report, the 12-rule catalog, the score model
- `fix-react-doctor-finding` — step-by-step fix workflow for one finding
- `run-pentestagent` — how to set up, configure, and run PentestAgent AI security scans against the portfolio
- `add-a-new-skill` — how to add another agent skill
- `add-an-experience`, `add-a-project`, `add-a-certification`, `add-a-blog-post` — content workflows
- `update-the-hero` — hero block editing
- `ui-ux-pro-max` — design system intelligence

## React quality gate

- Tool: `react-doctor@0.2.16` (pinned to exact version in `package.json`)
- Config: `doctor.config.json` at the repo root
- Scripts: `npm run doctor`, `npm run doctor:json`, `npm run doctor:check`, `npm run doctor:baseline`, `npm run doctor:diff`
- CI gate: `.github/workflows/react-doctor.yml` (threshold = 0 findings = 100/100)
- Scoreboard: `docs/react-doctor/scoreboard.md`
- Find the canonical fix pattern for each rule in the `run-react-doctor` skill

If you change code in `src/**` and the score drops, follow `fix-react-doctor-finding` and commit the fix in the same PR.

## Security testing (PentestAgent)

- Tool: [PentestAgent](https://github.com/GH05TCREW/pentestagent) — AI agent framework for black-box security testing
- Config: `docs/security/pentestagent/config/`
- Playbooks: `docs/security/pentestagent/playbooks/` (recon, XSS, CSRF, SSRF, injection, API fuzz, rate limiting, and more)
- Setup: `scripts/setup-pentestagent.ps1` (Windows) or `scripts/setup-pentestagent.sh` (Unix)
- CI gate: `.github/workflows/pentestagent-ci.yml`, `.github/workflows/pentestagent-scheduled.yml`, `.github/workflows/pentestagent-pr-check.yml`
- Dashboard: `docs/security/dashboard.md`
- Skill: `run-pentestagent`

Local Python 3.8 is insufficient (3.10+ required). The CI pipeline is the primary execution environment. See the `run-pentestagent` skill for setup and playbook execution instructions.

## Commit hygiene

- One commit per story slice; commit every update
- Message subject: `type(scope): <imperative summary>`
- Body: bullet list of what changed, why, and what was verified (vitest run, doctor run, type check, lint)
- Branch protection on `main` forbids merge commits — rebase and ff
- ASCII-safe PR descriptions; use `--body-file` to avoid PowerShell escape corruption

## Code conventions

- TypeScript strict; `npx tsc --noEmit` must pass
- ESLint 9 flat config (`eslint.config.mjs`); `npm run lint` must pass
- No comments in code unless asked
- Follow the patterns established for: SWR for component-scoped data, `<JsonLd>` for JSON-LD, sandbox attribute on every iframe, stable React keys from data, `useMemo` on Context.Provider values

## Testing

- 29 test files, 266 tests, all green
- Run: `npm run test -- --run`
- Test isolation: use `SWRConfig` with `provider: () => new Map()` for any test that exercises a SWR consumer
- Studios, scripts, and generated code are excluded from both `tsc` and `eslint` config; they have their own lanes
