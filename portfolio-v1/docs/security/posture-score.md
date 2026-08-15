# Security Posture Score Model

## Scoring Methodology

The security posture is scored across 10 categories, each worth 10 points, for a maximum of 100 points.

### Categories

| # | Category | Weight | Pass Criteria |
|---|---|---|---|
| 1 | API Security | 10 | All endpoints rate-limited, input-validated, method-restricted |
| 2 | HTTP Headers | 10 | All 10 security headers present with correct values |
| 3 | Content Security Policy | 10 | CSP has restrictive directives; no wildcards |
| 4 | Cookie & Storage | 10 | All cookies have Secure/HttpOnly/SameSite; no sensitive data in storage |
| 5 | TLS Configuration | 10 | TLS 1.2+ only; strong ciphers; HSTS with preload |
| 6 | Reconnaissance Coverage | 10 | Complete route map; all technologies identified; all endpoints documented |
| 7 | Vulnerability Coverage | 10 | XSS, CSRF, SSRF, injection, misconfig, data exposure all tested |
| 8 | Input Validation | 10 | Payload limits, content-type checks, sanitisation, fuzz testing |
| 9 | Authentication | 10 | All protected endpoints require valid credentials; no bypass |
| 10 | CI/CD Integration | 10 | Automated scans run on push, schedule, and PR |

### Scoring

- **10/10:** All pass criteria met; no findings in category
- **8-9/10:** Minor issues found; no exploitable vulnerabilities
- **5-7/10:** Moderate issues found; some exploitable
- **0-4/10:** Critical issues found; immediate action required

### Current Score

| # | Category | Score | Notes |
|---|---|---|---|
| 1 | API Security | 10 | All 6 endpoints rate-limited, input-validated, method-restricted |
| 2 | HTTP Headers | 10 | All 10 headers present |
| 3 | CSP | 9 | Deducted for unsafe-inline (framework requirement) |
| 4 | Cookie & Storage | 10 | All secure flags; no sensitive data |
| 5 | TLS | 10 | TLS 1.2+; HSTS preload; strong ciphers |
| 6 | Recon Coverage | 10 | Full route map and tech stack documented |
| 7 | Vulnerability Coverage | 10 | All OWASP categories tested; zero findings |
| 8 | Input Validation | 10 | Payload limits, sanitisation, validation all in place |
| 9 | Authentication | 10 | Secret-based auth with proper rejection |
| 10 | CI/CD Integration | 9 | Deducted for pending DEPENDABOT_CONFIG |
| **Total** | | **98/100** | |
