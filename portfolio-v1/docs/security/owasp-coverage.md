# OWASP Top 10 2021 Coverage Matrix

> Last updated: 2026-06-04

## Coverage Overview

| OWASP Category | Playbook(s) | Code Hardening | CI Gate | Status |
|---------------|-------------|----------------|---------|--------|
| A01:2021 Broken Access Control | auth_bypass_testing, cloud_config | Middleware rate limiting, webhook secret validation | CI | ✅ Covered |
| A02:2021 Cryptographic Failures | tls_security, cookie_security | HSTS preload, TLS 1.3 | CI | ✅ Covered |
| A03:2021 Injection | xss_testing, injection_testing, prototype_pollution | Chat input validator, Zod schema, CSP | CI | ✅ Covered |
| A04:2021 Insecure Design | threat_modeling, portfolio_recon | API security-playbook-first approach | Scheduled | ✅ Covered |
| A05:2021 Security Misconfiguration | security_misconfig, header_security, csp_analysis | CSP middleware, 9 security headers, COEP | CI | ✅ Covered |
| A06:2021 Vulnerable Components | dependency_check | npm audit tracking, accepted risk docs | PR | ✅ Covered |
| A07:2021 Identification & Auth Failures | auth_bypass_testing, rate_limit_testing | Timing-safe secret comparison, rate limiter | CI | ✅ Covered |
| A08:2021 Software & Data Integrity Failures | cache_poisoning, host_header_injection | Vercel cache key hardening, integrity (SRI not used) | Scheduled | ⚠️ Partial |
| A09:2021 Security Logging & Monitoring | N/A (CI dashboards) | CSP violation reporter, security headers endpoint | CI | ⚠️ Partial |
| A10:2021 Server-Side Request Forgery | ssrf_testing, api_fuzz | Media gateway URL validation, fetch restricted | CI | ✅ Covered |

## Detailed Coverage

### A01: Broken Access Control
- **Playbooks**: auth_bypass_testing (6 endpoints), cloud_config (Vercel/Cloudflare Workers)
- **Code**: Timing-safe webhook secret comparison, middleware rate limiting per route
- **Status**: ✅ All endpoints tested, no bypass found

### A02: Cryptographic Failures
- **Playbooks**: tls_security (TLS 1.2/1.3, cipher suites, cert validity), cookie_security (Secure/HttpOnly/SameSite)
- **Code**: HSTS preload (max-age=63072000), upgrade-insecure-requests in CSP
- **Status**: ✅ TLS 1.3 enforced, HSTS preloaded, all cookies flagged

### A03: Injection
- **Playbooks**: xss_testing (30+ payloads), injection_testing (SQL/NoSQL/command/template), prototype_pollution (14 vectors)
- **Code**: Chat input validator blocks script tags, javascript: URLs, event handlers; CSP upgrade-insecure-requests
- **Status**: ✅ All injection points tested, no exploitable findings

### A04: Insecure Design
- **Playbooks**: threat_modeling (STRIDE analysis, risk matrix), portfolio_recon (full surface mapping)
- **Code**: Security-first design with rate limiting, media gateway, draft-mode auth
- **Status**: ✅ Threat model documented, all risks identified

### A05: Security Misconfiguration
- **Playbooks**: security_misconfig (headers, CORS, debug), header_security (9 headers), csp_analysis (deep CSP eval)
- **Code**: 9 security headers via next.config.js, CSP with report-uri, COEP credentialless
- **Status**: ✅ 8/8 headers passing at /api/security-headers

### A06: Vulnerable Components
- **Playbooks**: dependency_check (npm audit, CVE scan)
- **Code**: 10 moderate vulnerabilities documented as accepted risk
- **Status**: ✅ 0 critical, 0 high, 10 moderate (accepted, tracked)

### A07: Identification & Auth Failures
- **Playbooks**: auth_bypass_testing (6 endpoints), rate_limit_testing (burst/bypass)
- **Code**: Timing-safe comparison, dual-layer rate limiting (in-memory + Upstash Redis)
- **Status**: ✅ No auth bypass found, rate limiting active

### A08: Software & Data Integrity Failures
- **Playbooks**: cache_poisoning (Vercel edge), host_header_injection (cache poisoning)
- **Code**: Vercel cache uses full URL as key, upgrade-insecure-requests in CSP
- **Gap**: Subresource Integrity (SRI) not enabled on external scripts — requires Cal.com and Umami CDN support
- **Status**: ⚠️ Partial — SRI not implemented for third-party scripts

### A09: Security Logging & Monitoring
- **Playbooks**: N/A (covered by CI dashboards)
- **Code**: CSP violation reporter at /api/csp-violation, security headers endpoint at /api/security-headers
- **Gap**: Centralized log aggregation not configured (no SIEM)
- **Status**: ⚠️ Partial — per-endpoint logging exists, no SIEM integration

### A10: Server-Side Request Forgery
- **Playbooks**: ssrf_testing (metadata/localhost/file: payloads), api_fuzz (SSRF variants)
- **Code**: Media gateway validates target URL is Sanity CDN, fetch restricted to known origins
- **Status**: ✅ All SSRF vectors tested, no exploitable findings

## Metrics

| Category | Coverage | Score |
|----------|----------|-------|
| Fully covered (✅) | 8/10 | 10 points each |
| Partially covered (⚠️) | 2/10 | 5 points each |
| Not covered (❌) | 0/10 | 0 points |

**OWASP Coverage Score: 90/100**
