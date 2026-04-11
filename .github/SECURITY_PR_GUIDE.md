# Security PR Guide — `feat/security-hardening`

Use this guide when opening the pull request for the security hardening update based on the Web Check report for `namias.tech`.

## Recommended PR setup

- **Branch (head):** `feat/security-hardening`
- **Base branch:** `main`
- **PR title:** `feat(security): add security headers and security.txt`

## Copy-paste PR description

### Summary

This PR implements missing HTTP/web security controls identified in the latest Web Check audit for `namias.tech`.

### Why this change

The audit reported missing or incomplete security controls, including:

- `security.txt` not found
- HSTS not including all subdomains
- Missing `Content-Security-Policy`
- Missing `X-Content-Type-Options`
- Missing `X-Frame-Options`
- Missing `X-XSS-Protection`

### What changed

#### 1) Global security headers configured

Updated `next.config.js` to apply security headers for all routes (`/:path*`):

- `Content-Security-Policy`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self)`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `X-DNS-Prefetch-Control: off`
- Also disabled `X-Powered-By` via `poweredByHeader: false`

#### 2) Security disclosure files added

- `public/.well-known/security.txt` (standard location)
- `public/security.txt` (compatibility fallback)

### Files changed

- `next.config.js`
- `public/.well-known/security.txt`
- `public/security.txt`

### Validation

- Lint: passed (`next lint`)
- Build: passed (`next build`)

### Security audit mapping (Before → After)

- `Security.txt Present`: ❌ → ✅
- `HSTS includeSubDomains`: ❌ → ✅
- `Content Security Policy`: ❌ → ✅
- `X-Content-Type-Options`: ❌ → ✅
- `X-Frame-Options`: ❌ → ✅
- `X-XSS-Protection`: ❌ → ✅

### Out of scope (infra/DNS-level)

The following findings are not app-code changes and must be configured at DNS/hosting level:

- DNSSEC (`DNSKEY`, `DS`, `RRSIG`)
- WAF/Firewall provider detection

### Risk notes

- CSP is introduced with allowlist directives to avoid breaking existing functionality (e.g., Cal.com embed).
- Any future third-party scripts/iframes may require CSP directive updates.

### Post-merge verification checklist

- [ ] Deploy preview/production
- [ ] Verify `.well-known/security.txt` is publicly reachable
- [ ] Re-run Web Check for `namias.tech`
- [ ] Confirm headers appear on `/` and key routes
- [ ] Confirm booking modal iframe and chatbot still function as expected

## Reviewer checklist

- [ ] Header policy is applied globally
- [ ] `security.txt` content is valid and reachable
- [ ] No regression in core UX (homepage, blog, booking modal, chat API)
- [ ] CI/build/lint pass

---

Prepared for: `namias.tech` security hardening rollout.
