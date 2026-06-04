# Security Demo Script

> A step-by-step walkthrough demonstrating the portfolio's security posture.
> Total time: ~15 minutes

## Prerequisites

- PentestAgent installed and configured (see [SKILL.md](../../.agents/skills/run-pentestagent/SKILL.md))
- `ANTHROPIC_API_KEY` set in environment
- Node.js 18+ with dependencies installed

## Demo Steps

### 1. Reconnaissance Playbook (2 min)

```bash
pentestagent run -t https://namias.tech --playbook docs/security/pentestagent/playbooks/portfolio_recon.yaml
```

**Show:** Route enumeration, technology stack, third-party connections
**Expected:** All routes discovered, no hidden endpoints

### 2. Security Headers Verification (1 min)

```bash
curl -sI https://namias.tech | grep -iE '^(content-security-policy|strict-transport|X-Content-Type-Options|X-Frame-Options|referrer-policy|permissions-policy|cross-origin)'
```

**Show:** All 9 security headers present and correctly configured
**Expected:** CSP with upgrade-insecure-requests, HSTS with preload, XFO DENY

### 3. Automated API Headers Check (1 min)

```bash
curl -s https://namias.tech/api/security-headers | python -m json.tool
```

**Show:** Real-time security header verification with per-header status
**Expected:** All 8 headers passing (8/8, 100% score)

### 4. Rate Limiting Test (2 min)

```bash
for i in $(seq 1 25); do curl -s -o /dev/null -w "%{http_code} " -X POST https://namias.tech/api/chat -H "Content-Type: application/json" -d '{"message":"test"}'; done
```

**Show:** After ~20 requests, begins returning 429
**Expected:** Rate limiter activates, Retry-After header present

### 5. CI/CD Pipeline Status (2 min)

Navigate to GitHub → Actions → PentestAgent CI
**Show:** Green checkmark on latest run
**Show:** Scheduled workflow schedule (weekly Sundays 02:00 UTC)

### 6. Security Dashboard (2 min)

Open `docs/security/dashboard.md`
**Show:** 98/100 posture score
**Show:** Per-category breakdown with scores
**Show:** Finding counts and fix rate

### 7. Findings Ledger (2 min)

Open `docs/security/pentestagent/findings/ledger.md`
**Show:** All findings tracked with severity, status, fix commit
**Show:** Zero critical, zero high, 1 medium, 2 low, 3 info

### 8. OWASP Coverage (2 min)

Open `docs/security/owasp-coverage.md`
**Show:** Each OWASP Top 10 category mapped to playbook
**Show:** Verification status for each category

## Key Talking Points for Hiring Managers

1. **Defense in depth**: Rate limiting + CSP + input validation + webhook auth + media gateway signing
2. **Continuous testing**: Automated scans on every PR + weekly full suite
3. **Auditability**: Every finding tracked in ledger with fix commit reference
4. **Transparency**: security.txt disclosure policy + real-time header verification endpoint
5. **Framework choice**: AI-driven black-box testing (PentestAgent) + static analysis + CI enforcement
