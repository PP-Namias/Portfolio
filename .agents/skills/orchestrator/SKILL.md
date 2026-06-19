---
name: orchestrator
description: Coordinate multi-step tasks across multiple skills for complex workflows.
---

# Orchestrator Skill

Coordinates multi-step, multi-skill tasks. Use when a single workflow requires sequential or parallel execution of skills like frontend-design, performance-optimization, accessibility-audit, code-review, and testing-workflow.

## When to use this skill

- Implementing a full page section end-to-end
- Performing a complete audit cycle (accessibility + performance + SEO + code review)
- Tasks that span design, code, testing, and documentation
- Any workflow explicitly asking to "run all checks"

## Workflow

1. **Analyze** — Understand the request. Identify which skills are needed and in what order
2. **Plan** — Outline the execution sequence. Note dependencies between steps
3. **Execute sequentially** — Run skills that produce output needed by later steps first (e.g., design before code-review)
4. **Execute in parallel** — Run independent skills concurrently (e.g., accessibility-audit + performance-optimization)
5. **Validate** — After all steps, run `impeccable` checklist
6. **Report** — Summarize what was done, what skills were used, and verification results
