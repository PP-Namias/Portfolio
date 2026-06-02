---
title: Configure CORS and Tokens
trigger: "cors", "token", "api token", "permissions"
audience: devs
time: 5 min
---

# Configure CORS and Tokens

## Where tokens live
- `SANITY_API_READ_TOKEN` — read-only, used by the marketing site
  during build.
- `SANITY_API_WRITE_TOKEN` — read/write, used by Sanity Functions
  and the seed script.
- `SANITY_STUDIO_DEPLOY_TOKEN` — admin, used by `sanity deploy`.
- `SANITY_REVALIDATE_SECRET` — shared with the marketing site's
  webhook handler.

## How to add a new CORS origin
```bash
npx sanity@latest cors add https://your-site.com --credentials
```

## How to add a new token
```bash
npx sanity@latest tokens create --name "ci-deploy" --role administrator
```

## How to set a function env var
```bash
cd functions
npx sanity@latest blueprints env add <function-name> SANITY_API_WRITE_TOKEN <token>
```

## Production secrets
- Stored in `studio/.env` (gitignored) and `functions/.env`
  (gitignored).
- In CI, set them in the deploy workflow's environment.
- Never commit a real token to the repo. The README has placeholders
  only.
