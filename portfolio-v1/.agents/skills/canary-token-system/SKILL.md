---
name: canary-token-system
description: Manage the canary token honeypot system for detecting security scanning
---

# Canary Token System Skill

Manage the canary token honeypot system that detects automated security scanners and penetration testing tools.

## When to use this skill

- Adding new canary tokens
- Changing canary token paths or secrets
- Investigating canary token alerts
- Modifying notification channels

## How it works

The canary system plants fake secrets in predictable locations that scanners will find and try to use. When a scanner uses a token, it triggers a notification.

## Architecture

```
public/.well-known/security.txt → contains canary token
API route → validates token → sends notification
src/lib/canary/notify.ts → notification logic (Slack, Discord, Email)
```

## Files

| File | Purpose |
|------|---------|
| `public/.well-known/security.txt` | Canary token location |
| `src/lib/canary/notify.ts` | Notification dispatch (escapeHtml for XSS prevention) |
| `src/app/api/canary/route.ts` | API endpoint for token validation |
| `.github/codeql/codeql-config.yml` | CodeQL exclusions for intentional honeypot code |

## Adding a new canary token

1. Choose a location scanners will find (e.g., `public/robots.txt`, `public/.env.example`)
2. Add the token string to the file
3. Add a route handler to validate the token
4. Add CodeQL exclusion for the path
5. Test by using the token yourself

## Changing notification channels

Edit `src/lib/canary/notify.ts`. Current channels:

- **Slack:** Uses `CANARY_SLACK_WEBHOOK` env var
- **Discord:** Uses `CANARY_DISCORD_WEBHOOK` env var
- **Email:** Uses `CANARY_EMAIL` env var (via Resend)

## Security notes

- All user-controlled HTML is escaped with `escapeHtml()` before rendering
- CodeQL exclusions are in `.github/codeql/codeql-config.yml`
- Never log real secrets in CI output
- Tokens should be long, random strings (32+ chars)

## Checklist

- [ ] Token is in a predictable scanner location
- [ ] Notification channel is configured (env vars)
- [ ] CodeQL exclusion added for the path
- [ ] HTML escaping in notification logic
- [ ] Token validated correctly
