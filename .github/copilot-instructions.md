# Copilot Instructions — PP Namias Portfolio

> **Owner:** PP Namias
> **Domain:** https://namias.tech

## Quick Reference

This is a monorepo with two portfolio sites and a shared Sanity CMS studio.

### Structure

- `portfolio-v1/` — Current production site (Next.js 16, React 18)
- `portfolio-v2/` — Newer site (Next.js 16, React 19, Tailwind v4)
- `studio/` — Shared Sanity CMS studio (serves both v1 and v2)
- `docs/` — Documentation and PRDs

### Key Rules

- TypeScript strict mode
- No comments unless asked
- Follow existing code patterns
- Commit every slice with descriptive messages
- See root `AGENTS.md` for full agent routing and workflows

### Commands

```bash
cd studio && pnpm dev       # Start Sanity studio
cd portfolio-v1 && pnpm dev # Start v1 dev server
cd portfolio-v2 && pnpm dev # Start v2 dev server
```
