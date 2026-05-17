---
name: content-review
description: >
  Content reviewer agent for the portfolio. Audits PR copy, UI text, and data-driven content for clarity, tone,
  privacy, and consistency with the portfolio brand.
---

# Content Review Skill

## Intent

Provide fast, deterministic checks focused on user-facing copy, privacy, and correctness for the portfolio site.
Flag anything that sounds generic, inconsistent, or unsafe for public presentation.

## Capabilities

- Scan PR descriptions and changed UI strings for privacy risks and accidental disclosure.
- Check UI copy for clarity, reading level, and brand tone.
- Validate that calls to action, labels, and helper text are concise and unambiguous.
- Suggest concise rewrites for confusing sentences or mismatched terminology.

## Invocation

- Example prompt: "content-review: audit PR draft + changed UI strings for clarity + rewrite unclear copy"

## Output format

- JSON with keys: `flags` (array of {severity, location, note, suggestedFix}), `summary` (short paragraph), `rewrites` (map of original -> suggested).

## Safety

- If content includes secrets, personal data, or private URLs, mark it as requiring human review before publishing.
