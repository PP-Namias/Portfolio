# Security Review Checklist

> Pre-merge checklist for all code changes to the Namias portfolio.
> Every PR must pass all applicable checks before merging.

## Pre-Commit Checklist

### Input Validation
- [ ] All user-facing inputs validated server-side (not just client-side)
- [ ] Message/comment length limits enforced
- [ ] XSS patterns blocked (script tags, event handlers, javascript: URLs)
- [ ] Content-Type validated for POST/PUT/PATCH requests
- [ ] Body size limits enforced (100KB default for API)

### Authentication & Authorization
- [ ] Webhook secrets use timing-safe comparison
- [ ] API tokens never exposed in client bundles
- [ ] Draft-mode endpoints verify preview secret
- [ ] Rate limiting configured for new API routes

### Output Encoding
- [ ] User-controlled data properly escaped in responses
- [ ] JSON responses use application/json content-type
- [ ] Error messages don't leak stack traces in production
- [ ] HTML responses set correct charset

### HTTP Headers
- [ ] New pages include all 9 security headers (via next.config.js)
- [ ] CSP updated if adding new third-party resources
- [ ] Custom headers use correct casing and values

### Dependencies
- [ ] `npm audit` shows no new critical/high vulnerabilities
- [ ] Dependency changes documented in PR description
- [ ] Dev dependencies separated from production dependencies

### State Changes
- [ ] POST/PUT/PATCH/PATCH endpoints validate CSRF or webhook secret
- [ ] Idempotency keys considered for write operations
- [ ] Database/CMS writes validated on the server

## CI Gate Checklist

### Required Gates (blocking)
- [ ] ESLint passes (0 errors)
- [ ] TypeScript compiles (0 errors)
- [ ] All tests pass (266+ tests)
- [ ] Production build succeeds
- [ ] react-doctor 100/100 (0 findings)

### Security Gates (non-blocking, monitored)
- [ ] PentestAgent PR check passes (no critical/high findings)
- [ ] Dependency audit shows no critical vulnerabilities
- [ ] Security headers verification passes

## Post-Merge Checklist

- [ ] `security.json` updated if posture changed
- [ ] Findings ledger updated if new issues discovered
- [ ] Dashboard score reflects current state
- [ ] Incident response doc updated for new attack vectors

## New Feature Checklist

When adding a new feature, consider:

1. **New API route?**
   - Add to middleware rate limiter config
   - Add input validation
   - Add to API security playbook (EPIC-3)
   - Update CORS if needed

2. **New third-party integration?**
   - Add origin to CSP connect-src/script-src
   - Update technology_fingerprint playbook
   - Document in recon findings
   - Verify SSRF impact

3. **New client-side data storage?**
   - Document in cookie_security playbook
   - Verify localStorage values sanitized on read
   - Add to client_side_bypass playbook

4. **New form or input?**
   - Add server-side validation
   - Add to XSS testing playbook
   - Add to client_side_bypass playbook
   - Verify rate limiting covers the new endpoint
