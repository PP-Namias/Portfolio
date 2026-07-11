# Contributing Guide

Thanks for your interest in improving this portfolio project.

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies with `npm install`
4. Start development with `npm run dev`

## Branching Strategy

- Base branch: `main`
- Create feature/fix branches from `main`
- Branch naming recommendation:
  - `feat/<short-description>`
  - `fix/<short-description>`
  - `docs/<short-description>`
  - `chore/<short-description>`

## Commit Convention

Use conventional commit prefixes:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` code structure changes without behavior change
- `test:` tests added/updated
- `chore:` maintenance/config

## Quality Gates (Required)

Before opening a pull request, run:

- `npm run lint`
- `npm run build`
- `npm run test`

If your changes affect behavior, include or update tests.

## Pull Request Expectations

- Keep PRs focused and small when possible
- Explain **what changed** and **why**
- Add screenshots/GIFs for UI changes
- Link related issue(s)
- Confirm all checks pass in CI

## Coding Expectations

- Keep changes minimal and scoped to the task
- Follow existing style and component patterns
- Avoid introducing dead code
- Keep accessibility and responsive behavior in mind

## Documentation Updates

If behavior, architecture, or workflow changes, update relevant docs in:

- `README.md`
- `docs/`
- `.github/`

---

By contributing, you agree to collaborate respectfully and follow repository review standards.
