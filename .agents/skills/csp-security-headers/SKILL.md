---
name: csp-security-headers
description: Configure Content Security Policy and security headers for the portfolio
---

# CSP Security Headers Skill

Configure Content Security Policy (CSP) and security headers for the portfolio.

## When to use this skill

- Adding new external scripts or styles
- Adding new iframes or embeds
- Troubleshooting CSP violations
- Updating security headers

## Current CSP

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://4bg9jxr4.apicdn.sanity.io https://api.sanity.io https://challenges.cloudflare.com;
frame-src https://challenges.cloudflare.com;
object-src 'none';
base-uri 'self';
form-action 'self';
```

## Adding new external resources

### New script domain
1. Add domain to `script-src` in `next.config.ts` security headers
2. Test that the script loads
3. Check browser console for CSP violations

### New image domain
1. Add domain to `img-src` in `next.config.ts`
2. Test that images load
3. Check for mixed content warnings

### New iframe domain
1. Add domain to `frame-src` in `next.config.ts`
2. Test that the iframe loads
3. Check for CSP violations

## Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Security headers configuration |
| `src/middleware.ts` | Middleware that applies headers |
| `public/.well-known/security.txt` | Security.txt with contact info |

## Common CSP violations

### "Refused to load the script"
- Domain not in `script-src`
- Check for typos in domain name

### "Refused to load the image"
- Domain not in `img-src`
- Check if image is data: URL (needs `data:` in CSP)

### "Refused to connect to"
- Domain not in `connect-src`
- Check if API endpoint is correct

### "Refused to frame"
- Domain not in `frame-src`
- Check iframe src attribute

## Testing CSP

1. Open browser DevTools
2. Go to Console tab
3. Look for CSP violation messages
4. Add missing domains to CSP

## Checklist

- [ ] New external resources have matching CSP entries
- [ ] No `unsafe-inline` for scripts unless necessary
- [ ] No `unsafe-eval` unless necessary
- [ ] `object-src 'none'` maintained
- [ ] `base-uri 'self'` maintained
- [ ] `form-action 'self'` maintained
