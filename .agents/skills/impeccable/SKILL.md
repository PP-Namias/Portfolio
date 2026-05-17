---
name: impeccable
description: Fast quality audit skill for repo hygiene, plan consistency, and release readiness.
---

# Impeccable Skill

## Intent

Run a lightweight but strict quality audit for agent-driven work.

## When to use

- after planning a new branch
- before or after large documentation updates
- when a workflow needs a quick consistency check
- when a guide or prompt references other agent files

## What to check

- broken or stale file references
- duplicate guidance across nearby docs
- unclear branch scope or task ownership
- missing entry points for future agents
- outdated instructions that conflict with the current repo structure

## Output style

- call out the issue
- point to the affected file
- give the smallest useful fix
- keep the result deterministic and short

## Rules

- do not invent missing repo files
- prefer the closest source of truth
- keep the audit focused on connected work
- preserve existing structure when it already serves the task

## Good use cases

- validating a new `.agents` index file
- checking whether a planning doc should be split
- reviewing task prompts for duplicate instructions
- confirming that branch guidance stays consistent