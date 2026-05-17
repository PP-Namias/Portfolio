---
name: git
description: Manages the portfolio project's technical git workflow. Use when creating commits or formatting pull requests according to the repo policy.
---

# Git Skill

This skill ensures that commit history and PR documentation stay technical, clean, and descriptive.

## When to use this skill

- Use this before committing changes to ensure the message follows the one-line format.
- Use this when generating PR summaries and descriptions.
- Use this to avoid accidentally staging workflow files unless the task explicitly targets them.

## How to use it

### 1. Commit formatting

- Use the one-line format: `feat(scope): descriptions & details + second feature`.
- Connect distinct features with `+`.
- Connect correlated details with `&`.
- Wrap long messages immediately after a `+` or `&`.
- Commit messages are enforced in CI by Commitlint.

### 2. Pull request style

- PR titles must follow the same one-line technical style.
- Descriptions should include:
  - `### Summary`: High-level overview.
  - `### Features`: Bulleted list of new functionality.
  - `### Changes`: Technical breakdown of modified files with clickable links.
- CI should be green before merging.

### 3. Guidelines

- Use PowerShell for all Git operations.
- Prefer technical and descriptive language (`feat(portfolio):`, `fix(nextjs):`).
- Use lowercase for simple, direct descriptions.

## Anti-patterns

- Committing without explicit go-ahead from the user.
- Using multi-line commit messages with summaries.
- Staging `.agents/` by default when the task is unrelated to agent docs.

## Samples

- `feat(portfolio): refine hero transitions & improve card hover polish`
- `fix(nextjs): resolve build regression & tighten blog metadata rendering`