---
name: secure-media-gateway-complete-autopilot
description: "Autonomously complete the secure media gateway plan slice by slice with validation, progress updates, and one conventional commit per slice."
---

You are an autonomous coding agent working inside this repository.

Your mission is to complete `SECURE_MEDIA_GATEWAY_PLAN.md` end-to-end so the portfolio has a secure, server-controlled media delivery approach for Sanity-backed images and related assets.

## Mandatory first reads

1. `.github/copilot-instructions.md`
2. `SECURE_MEDIA_GATEWAY_PLAN.md`
3. `progress.txt`
4. `prd.json`
5. `next.config.js`
6. `src/lib/cms-content.server.ts`
7. `src/app/api/sanity/webhook/route.ts`
8. Any existing image or asset route handlers under `src/app/api/**`
9. Any media consumers under `src/components/**` and `src/app/**`

## Source-of-truth rules

- Treat Sanity as the backend content source, but never expose sensitive Sanity credentials in the browser.
- Keep all secrets server-side only.
- Do not invent hidden-access behavior that bypasses normal web security boundaries.
- Public assets may still be discoverable if they are intentionally public; focus on controlled delivery, validation, and origin isolation.
- Preserve existing fallback behavior unless a slice explicitly replaces it.

## Scope of this completion prompt

This prompt covers the full secure media gateway effort, including:

- trust-boundary documentation
- server-side media gateway routes
- request validation and allowlisting
- optional signed or expiring asset URLs
- cache headers and performance-safe delivery
- content normalization to reduce exposed backend detail
- webhook and revalidation hardening
- rollout notes and implementation documentation

## Slice order to follow

1. Trust boundary and threat model documentation
2. Server-side media gateway route design
3. Request validation, path allowlisting, and response headers
4. Optional signed or expiring asset URL support
5. Cache control and CDN-friendly delivery behavior
6. Data-layer normalization so components consume gateway URLs where appropriate
7. Webhook/revalidation hardening review for adjacent attack surface
8. Rollout notes, usage docs, and maintenance cleanup

## Execution protocol (strict)

For every slice:

1. Read the controlling files for that slice.
2. Make the smallest focused change that satisfies the slice.
3. Run the narrowest relevant validation first.
4. If the slice adds or changes route handlers or server logic, run `npm run lint`.
5. If the slice affects production rendering or headers, run `npm run build`.
6. If the slice touches shared media or content logic, run the most targeted tests available first.
7. Update `progress.txt` with the completed slice and validation results.
8. `git add -A`.
9. Create exactly one conventional commit for that slice.
10. Continue immediately to the next eligible slice.

## Hard constraints

- Do not create an open proxy.
- Do not allow arbitrary external destinations through the media layer.
- Do not expose tokens or secrets in client bundles, route responses, or logs.
- Keep the gateway strict: allowlist known asset shapes, reject traversal attempts, and fail closed.
- Preserve a maintainable Next.js-first implementation unless a later slice explicitly introduces an external reverse proxy.
- Do not weaken CSP or security headers unless a later slice proves a documented need.
- Do not bundle unrelated changes into one commit.
- Do not skip validation or progress logging.

## Security policy

- Server-side fetches only for CMS credentials.
- Validate all asset requests before any upstream fetch or stream.
- Prefer normalized gateway URLs over raw backend URLs in UI-facing code.
- Add safe cache headers for immutable assets and avoid unbounded caching for dynamic responses.
- Keep webhook and revalidation endpoints protected with secrets and strict methods.
- Log only what is needed to debug abuse or failure patterns; avoid leaking sensitive request data.

## Rollout policy

Use a staged rollout instead of a one-shot migration:

1. Start with one asset family, such as blog cover images.
2. Keep a safe fallback to the existing delivery path while proving the gateway.
3. Expand to additional asset families only after validation passes.
4. Document the final route patterns and expected environment variables.

## Documentation policy

- Keep `SECURE_MEDIA_GATEWAY_PLAN.md` updated when the approach changes.
- Keep `progress.txt` updated after every successful slice.
- If a new environment variable or route contract is added, document it in the plan and any setup docs.
- If the rollout shape changes, update this prompt so future runs stay aligned.

## Output expectations for each slice

- Exact files changed
- Validation evidence
- Security impact summary
- Remaining next slice

## Stop conditions

Stop only when one of these is true:

- The secure media gateway approach is implemented, validated, documented, and ready for use.
- A hard blocker occurs such as missing env vars, missing assets, or an upstream dependency failure.

If blocked, report:

- the exact blocker,
- the exact file or command affected,
- the minimal next user action needed.

## Next Step Copy-Paste

Use this in a new chat to continue from the current state:

```prompt
Read .github/copilot-instructions.md, SECURE_MEDIA_GATEWAY_PLAN.md, progress.txt, prd.json, next.config.js, src/lib/cms-content.server.ts, and src/app/api/sanity/webhook/route.ts first.
Continue the secure media gateway work slice by slice.
Start with the next unresolved slice from the prompt order and implement only that slice.
Keep the worktree clean by validating each slice, updating progress.txt, and creating exactly one conventional commit per slice.
After every successful slice, immediately continue to the next eligible slice without waiting for user confirmation.
If you hit a blocker, report the exact file, command, and minimal next user action needed.
```
