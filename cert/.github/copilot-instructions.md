# Copilot Instructions for Certificate Tracking Project

## Project Overview
This is a personal certificate tracking project for IT training certifications. The goal is to track progress toward obtaining 5 free certificates in: Programming, Database, AI Agent, API, and Cybersecurity.

## Key Files
- `CERTIFICATE_PLAN.md` - Main planning document with course options and progress tracking
- `certificates/` - Folder structure for storing earned certificates (organized by category)

## Document Update Guidelines

### When updating CERTIFICATE_PLAN.md:
1. **Status Updates:** Change `⬜ Not Started` to `🔄 In Progress` or `✅ Completed`
2. **Progress Tracker:** Check off completed steps using `[x]` instead of `[ ]`
3. **Completion Dates:** Fill in dates when certificates are earned
4. **Links:** Verify all course URLs are still active before recommending

### Certificate Requirements:
- All courses must be **FREE** (or free audit option)
- Minimum **8 hours** duration
- Must have **quiz/assessment** for certificate
- Must provide **downloadable certificate**

### Adding New Courses:
When adding courses, include:
```markdown
| Platform | Course Name | Duration | Certificate | Link |
|----------|-------------|----------|-------------|------|
| **[Name]** | Course Title | X hours | ✅ Free | [Link](URL) |
```

## Folder Structure Convention
```
cert/
├── certificates/
│   ├── programming/
│   ├── database/
│   ├── ai-agent/
│   ├── api/
│   └── cybersecurity/
├── CERTIFICATE_PLAN.md
└── .github/copilot-instructions.md
```

## Priority Order for Fast Completion
1. HackerRank (instant skill verification)
2. Kaggle (practical, quick courses)
3. Postman Academy (industry-recognized)
4. Cisco Networking Academy (established provider)
5. Google Cloud Skills Boost (comprehensive paths)
