# PRD: Thinkst Canary Token Integration

> **Status**: Draft  
> **Author**: PP Namias  
> **Created**: 2026-06-16  
> **Version**: 1.0.0

---

## Executive Summary

Integrate Thinkst Canary tokens into the portfolio website to create a **security detection system** that alerts you via email when unauthorized access attempts occur. This transforms your portfolio from a passive website into an **active security monitoring platform**.

---

## Problem Statement

Portfolio websites are **public targets** for:
- Automated vulnerability scanners
- Bot crawlers looking for sensitive files
- Port scanners mapping attack surfaces
- Malicious actors probing for weaknesses

**Without detection**: You have zero visibility into who is probing your infrastructure.

---

## Solution

Deploy **canary tokens** as tripwires throughout the site:
- Decoy admin endpoints
- Fake configuration files
- Hidden triggers in robots.txt
- Fake credentials and SSH keys

**When triggered**: Instant email notification to `jkrbn99@gmail.com`

---

## Why This Matters for Professionalism

| Aspect | What It Shows |
|--------|---------------|
| **Security Awareness** | You think about security, not just features |
| **Detection Capability** | You build systems that detect threats |
| **Monitoring Mindset** | You care about production health |
| **Enterprise Thinking** | You implement defense-in-depth |

---

## Architecture

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    ATTACK FLOW                               │
│                                                              │
│  Scanner/Bot ──► Hits canary endpoint ──► Alert triggered    │
│       │              │                        │              │
│       ▼              ▼                        ▼              │
│  Port scan     /api/canary/admin         Email sent         │
│  Vuln scan     /.env-canary              to jkrbn99@       │
│  Bot crawl     /wp-admin-canary          gmail.com          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM COMPONENTS                         │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Canary     │    │   Canary     │    │   Canary     │  │
│  │   Tokens     │───►│   Routes     │───►│   Notify     │  │
│  │   Config     │    │   (API)      │    │   Service    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                   │           │
│         ▼                   ▼                   ▼           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Token      │    │   Trigger    │    │   Email      │  │
│  │   Manager    │    │   Logger     │    │   Alerts     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Canary Token Inventory

### High Priority (Deploy First)

| Token | Type | Path | Purpose |
|-------|------|------|---------|
| Fake Admin Panel | Web | `/api/canary/admin` | Attract admin scanners |
| Fake Config | Web | `/api/canary/config` | Attract config seekers |
| Fake .env | Web | `/`.env-canary` | Attract credential hunters |
| Fake WordPress | Web | `/wp-admin-canary` | Attract WP scanners |
| Fake phpMyAdmin | Web | `/phpmyadmin-canary` | Attract DB scanners |

### Medium Priority (Phase 2)

| Token | Type | Path | Purpose |
|-------|------|------|---------|
| Fake SSH Key | File | `/.ssh-canary/id_rsa` | Attract SSH scanners |
| Fake AWS Keys | File | `/.aws-canary/credentials` | Attract cloud scanners |
| Fake Database | File | `/backups-canary/database.sql` | Attract data hunters |

---

## Implementation Phases

### Phase 1: Foundation (5 commits)

```
Commit 1: feat(canary): add canary token configuration schema
Commit 2: feat(canary): create canary token manager
Commit 3: feat(canary): add trigger logging service
Commit 4: feat(canary): create email notification service
Commit 5: test(canary): add unit tests for canary system
```

### Phase 2: Decoy Endpoints (5 commits)

```
Commit 6:  feat(canary): add /api/canary/admin endpoint
Commit 7:  feat(canary): add /api/canary/config endpoint
Commit 8:  feat(canary): add /.env-canary file
Commit 9:  feat(canary): add /wp-admin-canary endpoint
Commit 10: feat(canary): add /phpmyadmin-canary endpoint
```

### Phase 3: Monitoring (5 commits)

```
Commit 11: feat(canary): add trigger logging to database
Commit 12: feat(canary): create admin dashboard page
Commit 13: feat(canary): add IP geolocation tracking
Commit 14: feat(canary): add user-agent analysis
Commit 15: feat(canary): create alert summary emails
```

### Phase 4: Advanced (5 commits)

```
Commit 16: feat(canary): add rate limiting to canary endpoints
Commit 17: feat(canary): create token rotation system
Commit 18: feat(canary): add Slack webhook notifications
Commit 19: feat(canary): create health check endpoints
Commit 20: feat(canary): add canary analytics tracking
```

---

## Email Notification Design

### Email Template

```
Subject: 🚨 Canary Token Triggered: Fake Admin Panel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOKEN DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:       Fake Admin Panel
Type:       Web Token
Path:       /api/canary/admin
Triggered:  2026-06-16 14:32:15 UTC

REQUEST DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IP Address: 192.168.1.100
User Agent: Mozilla/5.0 (compatible; Nmap Scripting Engine)
Referer:    http://yoursite.com/
Method:     GET

GEOLOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Country:    United States
City:       New York
ISP:        Cloudflare Inc.

ACTION REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Review the trigger details
□ Check for patterns (multiple triggers?)
□ Block IP if suspicious
□ Update security rules if needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
View Dashboard: https://your-site.com/admin/canary
```

---

## Testing Strategy

### Unit Tests
- Token creation and management
- Notification service
- Trigger logging
- IP geolocation

### Integration Tests
- API route triggers correctly
- Email notification sent
- Dashboard displays triggers
- Rate limiting works

### Manual Tests
- Access canary endpoint → verify email received
- Check dashboard → verify trigger logged
- Test rate limiting → verify blocked after limit

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Canary tokens deployed | 8+ |
| Email notification latency | < 60 seconds |
| Test coverage | > 80% |
| False positive rate | < 5% |
| Dashboard load time | < 2 seconds |

---

## Open Questions

1. **Do you have a Thinkst Canary account?**
   - If no → Create free account at canarytokens.org
   - If yes → Provide API token

2. **Which notification channels?**
   - Email only (recommended to start)
   - Email + Slack (add later)
   - Email + Webhook (for custom integrations)

3. **Dashboard authentication?**
   - Yes, require login (recommended)
   - No, public (not recommended)
   - IP whitelist only

4. **Token rotation frequency?**
   - Monthly (recommended)
   - Quarterly
   - Never

---

## Next Steps

1. **Review this PRD** and answer open questions
2. **Create Thinkst Canary account** if needed
3. **Approve implementation plan**
4. **Begin Phase 1** implementation

---

*This PRD is ready for review. Please answer the open questions and approve to proceed with implementation.*
