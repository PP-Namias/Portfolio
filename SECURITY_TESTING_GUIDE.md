# Promptfoo Security Implementation Guide

## Overview

This guide covers the Promptfoo AI security testing integration for the Portfolio chatbot. The implementation protects against prompt injection, jailbreaks, PII leaks, and other AI security threats.

## Quick Start

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Local development environment running

### 2. Installation

```bash
# Promptfoo is already installed as a dev dependency
npm install

# Verify installation
npx promptfoo --version
```

### 3. Local Testing (Fastest)

```bash
# Terminal 1: Start development server
npm run dev

# Terminal 2: Run local security tests
npm run test:security:local
```

### 4. Full Promptfoo Testing

```bash
# Setup red team attacks
npm run test:security:setup

# Run comprehensive security evaluation
npm run test:security:run

# Parse and view results
npm run test:security:parse

# View interactive dashboard
npm run test:security:view
```

## Files & Components

### Configuration Files

#### `promptfoo.yaml`
Global Promptfoo configuration specifying:
- Attack strategies (9 vulnerability types)
- Target endpoint (`http://localhost:3000/api/chat`)
- Test parameters (100 tests, 5 concurrent, 10s timeout)
- Results directory

#### `agents.json`
Custom attack suite with 10 security test cases:
- Portfolio info leak
- Resume data extraction
- Jailbreak attempts
- API call injection
- Credential extraction
- PII exposure
- Business logic violations
- And more

### Security Implementation

#### `src/app/api/chat/lib/securityGuards.ts`
Core security functions:
- `filterOutput()` - PII redaction (emails, phones, SSNs, credit cards)
- `detectInjectionAttempt()` - Advanced pattern detection
- `validateMessageContent()` - Input validation
- `generateSecureSystemPrompt()` - Hardened assistant prompt
- `logSecurityEvent()` - Security audit logging

#### `src/app/api/chat/lib/chatRateLimit.ts`
Rate limiting utilities:
- `checkRateLimit()` - Per-IP rate limiting (30 req/min)
- `resetRateLimit()` - Manual limit reset
- `getRateLimitStats()` - Monitoring
- Auto-cleanup of expired entries

### Testing Scripts

#### `scripts/test-security-local.js`
Local manual testing for rapid feedback:
- 12 test cases (injection, jailbreak, PII, etc.)
- Runs against live dev server
- Pass/fail reporting with details
- No external dependencies

#### `scripts/parse-promptfoo-results.js`
Results parser converting Promptfoo JSON output:
- Aggregates findings by severity
- Generates actionable recommendations
- Creates summary statistics
- Exit codes for CI/CD integration

### CI/CD Integration

#### `.github/workflows/promptfoo-security-tests.yml`
GitHub Actions workflow:
- Triggers on PR changes to `/api/chat` or config files
- Builds application
- Runs security tests
- Comments PR with findings
- Blocks merge on CRITICAL vulnerabilities
- Uploads artifacts for review

## Security Architecture

### Input Validation Layer
```
User Message
    ↓
Length Check (max 2000 chars)
    ↓
Keyword Blocking (35+ suspicious keywords)
    ↓
Injection Pattern Detection (regex + heuristics)
    ↓
Roleplay & Jailbreak Detection
    ↓
Message Processing (if passed)
```

### Output Filtering Layer
```
Model Response
    ↓
Email Redaction (except portfolio contact)
    ↓
Phone Number Redaction
    ↓
SSN & Credit Card Redaction
    ↓
Return Safe Response
```

### Rate Limiting Layer
```
Incoming Request
    ↓
Client IP Extract
    ↓
Rate Limit Check (30 req/min/IP)
    ↓
Allow/Block (429 Too Many Requests)
```

## Attack Vectors Covered

| Category | Strategy | Detection Method |
|----------|----------|-----------------|
| Prompt Injection | Direct commands to override behavior | Keyword + pattern matching |
| Jailbreak | Role-play to remove constraints | Behavior modification detection |
| Data Extraction | Extracting system prompt/credentials | Information disclosure filters |
| PII Exposure | Social engineering for personal data | Output PII redaction |
| Tool Misuse | Unauthorized API calls | Capability restriction |
| Harmful Content | Malware/hacking instructions | Content policy validation |
| Business Logic | False claims/unauthorized transactions | Response validation |
| Hallucinations | Misinformation generation | Output filtering |

## Running Tests

### Local (Instant Feedback)
```bash
npm run test:security:local
# ~30 seconds, tests against dev server
# Output: Pass rate, failed tests with reasons
```

### Promptfoo Red Team (Comprehensive)
```bash
npm run test:security:setup  # Generate attacks
npm run test:security:run    # Execute tests
npm run test:security:parse  # View results
# ~5-10 minutes, 100+ attack vectors
# Output: vulnerabilities.json with detailed findings
```

### CI/CD (Automated)
- Runs on every PR to `main` or `develop`
- Blocks merge if CRITICAL vulnerabilities found
- Comments PR with findings
- Stores results as artifacts

## Interpreting Results

### Local Test Output
```
[TEST] Normal Query... ✓ PASS
[TEST] Prompt Injection - System Override... ✓ PASS (blocked as expected)
[TEST] Jailbreak - Role Injection... ✓ PASS (blocked as expected)

===== Test Summary =====
Passed: 12
Failed: 0
Pass Rate: 100%

✓ All security tests passed!
```

### Promptfoo Results
```json
{
  "vulnerabilitiesFound": 0,
  "findings": [],
  "summary": {
    "passed": 100,
    "failed": 0,
    "inconclusive": 0
  },
  "assessment": "PASS: All security tests passed"
}
```

## Severity Levels

- **CRITICAL**: Immediate risk to security (e.g., PII leak, code execution)
- **HIGH**: Significant vulnerability (e.g., jailbreak success, unauthorized claims)
- **MEDIUM**: Notable issue (e.g., harmful content generation)
- **LOW**: Minor concern (e.g., edge case handling)

## Remediation Workflow

1. **Review Findings**: Check PR comments or `promptfoo-findings.json`
2. **Understand Impact**: Assess severity and scope
3. **Implement Fix**: Update security guards, system prompt, or filters
4. **Local Test**: Run `npm run test:security:local` for rapid validation
5. **Full Test**: Run `npm run test:security:run` for comprehensive check
6. **Submit PR**: Push changes, CI/CD runs automatically
7. **Merge**: Approved once all tests pass

## Monitoring & Maintenance

### Weekly
- Review security test results
- Check for new attack patterns in Promptfoo community
- Update blocked keywords if needed

### Monthly
- Review response times (target <2s per request)
- Audit security logs for patterns
- Update test cases based on new threats

### Quarterly
- Threat assessment review
- Update security rules based on latest AI safety research
- Review and rotate API keys/secrets

## Troubleshooting

### Issue: "Cannot connect to localhost:3000"
**Solution**: Ensure dev server is running (`npm run dev`)

### Issue: "Promptfoo not found"
**Solution**: Run `npm install` to install dependencies

### Issue: Tests timing out
**Solution**: Increase WINDOW_MS in `chatRateLimit.ts` or check API latency

### Issue: High false positives
**Solution**: Review and refine patterns in `INJECTION_PATTERNS` in `securityGuards.ts`

## Security Best Practices

1. **Never commit secrets**: API keys, tokens, or credentials
2. **Keep dependencies updated**: Run `npm audit` regularly
3. **Monitor logs**: Check for suspicious patterns
4. **Test frequently**: Run tests before every deployment
5. **Review changes**: All /api/chat changes require security review
6. **Use environment variables**: Manage secrets securely

## Resources

- **Promptfoo Docs**: https://www.promptfoo.dev/docs
- **Red Teaming Guide**: https://www.promptfoo.dev/docs/red-teaming
- **GitHub Integration**: https://www.promptfoo.dev/docs/integrations/github
- **Security DB**: https://www.promptfoo.dev/language-model-security-db
- **Community Discord**: https://discord.gg/promptfoo

## Support

- **Issues**: Report to GitHub Issues
- **Security**: Email pp.namias@gmail.com
- **Promptfoo Support**: support@promptfoo.dev

---

**Last Updated**: May 10, 2026  
**Status**: Implemented and Active  
**Maintainer**: Security Team
