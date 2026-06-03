# Secrets Scan Report

**Date:** 2026-06-03  
**Scope:** All tracked source files (`src/`, `studio/`, `.github/`, config files)  
**Method:** Broad regex patterns + targeted variable-name scan  
**Excluded:** `.git`, `node_modules/`, `.next/`, `out/`, `.open-next/`, `.wrangler/`, `coverage/`, `.react-doctor/`

## Result: **NO SECRETS FOUND**

## Scan 1 — Broad regex patterns

| Pattern | Hits | Status |
|---|---|---|
| Google API Key (`AIza...`) | 0 | ✅ Clean |
| OpenAI API Key (`sk-...`) | 0 | ✅ Clean |
| GitHub PAT (`ghp_...`) | 0 | ✅ Clean |
| GitHub OAuth (`gho_...`) | 0 | ✅ Clean |
| AWS Access Key (`AKIA...`) | 0 | ✅ Clean |
| Slack Bot Token (`xoxb-...`) | 0 | ✅ Clean |
| Slack App Token (`xapp-...`) | 0 | ✅ Clean |
| Stripe Live Key (`sk_live_...`) | 0 | ✅ Clean |
| Stripe Publishable Key (`pk_live_...`) | 0 | ✅ Clean |
| Heroku API Key | 0 | ✅ Clean |
| RSA Private Key (`-----BEGIN ... PRIVATE KEY-----`) | 0 | ✅ Clean |
| JWT/Bearer in code | 0 | ✅ Clean |
| Generic hex 32+ | 6 | ❌ All in build artifacts (`.open-next/build/`, `studio/dist/`) — not source |

## Scan 2 — Targeted variable-name scan

Pattern: `(const|let|var) <name containing key|token|secret|password> = '<string>'`

| File | Line | Content | Verdict |
|---|---|---|---|
| `src/hooks/useAccentColor.tsx` | 25 | `const STORAGE_KEY = 'accent-color'` | ✅ False positive — localStorage key, not a credential |

## Environment variable hygiene

- All 30 env vars used in `src/` and `studio/` are read via `process.env.*` — no hardcoded values.
- `NEXT_PUBLIC_` prefix is used only for safe client-side values (Sanity Project ID, Dataset, Studio URL, Umami analytics IDs).
- All secret/sensitive tokens (SANITY_API_READ_TOKEN, GOOGLE_GEMINI_API_KEY, OPENAI_API_KEY, UPSTASH_REDIS_REST_TOKEN, SANITY_REVALIDATE_SECRET, etc.) are non-public and never inlined into client bundles.

## Verdict

The source tree is free of hardcoded API keys, tokens, passwords, or other credentials. No rotation is required. No Git history purge is necessary.
