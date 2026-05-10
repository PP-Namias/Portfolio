# AI Chatbot Complete Implementation Plan (Security + Personality + Backup Mode)

## Date

- May 10, 2026

## Goal

Deliver a production-grade portfolio chatbot that is secure-by-default, personality-consistent, and resilient with clear user-facing status during provider outages.

## Scope

- Harden `/api/chat` request handling and model orchestration
- Enforce secure + personality-aware prompt strategy
- Add explicit UI state for temporary AI outage and backup mode
- Keep Promptfoo red-team pipeline integrated
- Add/extend tests for API and chat UI behavior

## Success Criteria

- Security checks continue to block injections, unsafe requests, and suspicious content
- AI responses retain Keneth-brand personality while following strict guardrails
- When AI provider fails/rate-limits, UI clearly shows temporary offline + backup mode
- Local fallback remains functional, fast, and safe
- Lint + build + tests pass

## Architecture Decisions

1. **Dual prompt layering**

   - Security policy prompt remains mandatory
   - Portfolio/personality prompt remains data-grounded
   - Final provider prompt = `security prompt + profile prompt`

2. **Contracted API response modes**

   - `mode: "ai"` for normal model/preset responses
   - `mode: "backup"` for local fallback responses after provider failure
   - Include backup metadata (`backupActive`, `providerStatus`, `backupReason`) for UI indicator control

3. **UI resilience states**

   - `checking`, `active`, `inactive`, `backup`
   - Backup mode banner + header status text when fallback is active

4. **Security posture**

   - Keep input validation, injection detection, unsafe request detection, output PII filtering, and rate limiting
   - Keep Promptfoo-driven CI and local test scripts

## Implementation Steps

1. Update API route to:

   - merge secure + personality prompts for provider calls
   - return explicit mode/backup metadata
   - preserve fallback behavior and security filters

2. Update `ChatPanel` to:

   - consume API mode/fallback metadata
   - show backup mode status and indicator message

3. Extend tests:

   - API tests validate backup mode contract
   - UI tests validate backup mode indicator behavior

4. Validate:

   - run lint, build, unit tests, and security validation script(s)

## Risk Controls

- Keep fallback message content stable to avoid UX regressions
- Keep changes additive and backward compatible where possible
- Use deterministic tests for backup mode status to avoid flaky assertions

## Rollout Plan

- Deploy to staging first
- Run Promptfoo suite and local security checks
- Monitor `/api/chat` fallback frequency and errors after release

## Operator Runbook (Outage Scenario)

- If AI provider is rate-limited/unavailable:

  - users automatically receive backup responses from verified local portfolio data
  - UI displays temporary AI offline/backup status

- Recovery is automatic when provider health returns

## Ready-to-use AI Agent Prompt (for full secure implementation)

Use this prompt in Copilot Chat for autonomous execution:

Read `.github/copilot-instructions.md` and this plan file fully.

Implement complete secure chatbot hardening for `src/app/api/chat` and `src/components/ui/ChatPanel.tsx` with these requirements:

1) Preserve strict security guards (injection/unsafe request blocking, output filtering, rate limiting).

2) Enforce personality + portfolio grounding while keeping security prompt immutable.

3) Add explicit API contract fields for mode and backup state.

4) Add user-facing UI indicator when AI is temporarily offline and backup mode is active.

5) Add/update tests for API fallback mode metadata and UI backup indicators.

6) Run `npm run lint`, `npm run build`, and relevant tests; fix all breakages.

7) Summarize changed files and verification results.

## Notes

- This plan intentionally avoids route proliferation (modal-first architecture preserved).
- No new secrets required beyond existing `.env.example` placeholders.
