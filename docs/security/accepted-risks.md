# Accepted Security Risks

> Risks that have been evaluated and accepted with compensating controls.
> Last reviewed: 2026-06-04 | Next review: 2026-09-04

## R-001: CSP 'unsafe-inline' for Scripts

| Field | Value |
|-------|-------|
| **Risk** | `'unsafe-inline'` in script-src weakens XSS protection |
| **Category** | A03:2021 Injection |
| **Severity** | Medium |
| **Compensating Controls** | Chat input validator blocks XSS patterns; middleware rate limiting prevents automated attacks; CSP includes upgrade-insecure-requests and report-uri |
| **Rationale** | Next.js requires `'unsafe-inline'` for client-side hydration. `strict-dynamic` + nonce approach was evaluated but would require modifying every `<Script>` component across the codebase (50+ components). The `unsafe-eval` directive is already restricted to dev mode only. |
| **Owner** | PP Namias |
| **Review Date** | 2026-09-04 |

## R-002: npm Moderate Dependencies

| Field | Value |
|-------|-------|
| **Risk** | 10 moderate vulnerabilities in transitive dependencies (prismjs, uuid) |
| **Category** | A06:2021 Vulnerable Components |
| **Severity** | Low |
| **Compensating Controls** | Both vulnerabilities have low exploitability in this codebase (prismjs only in Sanity Studio, uuid v3/v5/v6 not used); tracked for upstream fix |
| **Rationale** | Fixing requires `--force` which downgrades next-sanity from 9.12.3 to 9.5.6 (breaking change). Accepted until next-sanity updates its dependencies. |
| **Owner** | PP Namias |
| **Review Date** | 2026-09-04 |

## R-003: Missing Subresource Integrity (SRI)

| Field | Value |
|-------|-------|
| **Risk** | Third-party scripts (Cal.com, Umami) loaded without integrity hashes |
| **Category** | A08:2021 Software & Data Integrity |
| **Severity** | Low |
| **Compensating Controls** | Cal.com iframe uses sandbox attribute; Umami loaded over HTTPS; CSP restricts script sources to known origins |
| **Rationale** | Cal.com and Umami CDNs dynamically serve their scripts and don't provide stable SRI hashes. Using SRI would break when they update their script. |
| **Owner** | PP Namias |
| **Review Date** | 2026-09-04 |

## R-004: No SIEM Integration

| Field | Value |
|-------|-------|
| **Risk** | No centralized security log aggregation |
| **Category** | A09:2021 Security Logging & Monitoring |
| **Severity** | Informational |
| **Compensating Controls** | CSP violation reporter endpoint; security headers verification endpoint; CI scan summaries; GitHub Actions logs retained 90+ days |
| **Rationale** | Portfolio site has no user authentication, no payment processing, and no sensitive data storage. SIEM integration would add operational overhead without proportional benefit. |
| **Owner** | PP Namias |
| **Review Date** | 2026-12-04 |

## R-005: CORS Wildcard on Sanity Webhook

| Field | Value |
|-------|-------|
| **Risk** | `Access-Control-Allow-Origin: *` on /api/sanity/webhook |
| **Category** | A05:2021 Security Misconfiguration |
| **Severity** | Low |
| **Compensating Controls** | Webhook secret validation with timing-safe comparison; body size limit; Sanity sends from known IP ranges |
| **Rationale** | Sanity webhooks come from dynamic IPs; restricting Origin would break webhook delivery. Secret auth is the primary control. |
| **Owner** | PP Namias |
| **Review Date** | 2026-09-04 |

## Risk Register Summary

| ID | Risk | Severity | Status | Review |
|----|------|----------|--------|--------|
| R-001 | CSP unsafe-inline | Medium | Accepted | 2026-09-04 |
| R-002 | npm moderate deps | Low | Accepted | 2026-09-04 |
| R-003 | Missing SRI | Low | Accepted | 2026-09-04 |
| R-004 | No SIEM | Info | Accepted | 2026-12-04 |
| R-005 | CORS wildcard | Low | Accepted | 2026-09-04 |
