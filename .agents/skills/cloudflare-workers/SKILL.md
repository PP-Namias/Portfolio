---
name: cloudflare-workers
description: Deploy and manage Cloudflare Workers, R2, KV, D1, and edge computing.
---

# Cloudflare Workers Skill

Deploy and optimize Cloudflare Workers, edge functions, and serverless infrastructure for the portfolio.

## When to use this skill

- Deploying to Cloudflare Workers
- Configuring edge functions
- Managing R2 storage
- Setting up KV namespaces
- Configuring D1 databases
- Optimizing edge performance

## Workflow

1. **Configure wrangler.toml** — Set up project configuration
2. **Implement workers** — Write edge-compatible code
3. **Test locally** — Use `wrangler dev` for development
4. **Deploy** — Push to production with `wrangler deploy`
5. **Monitor** — Use Workers Analytics and Logs

## Wrangler Configuration

```toml
name = "portfolio"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "portfolio-production"
routes = [
  { pattern = "namias.tech/api/*", zone_name = "namias.tech" }
]

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-id"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "portfolio-assets"

[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "your-d1-id"
```

## Edge-First Patterns

```typescript
// src/worker.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Route handling
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // KV read
    const cached = await env.CACHE.get(url.pathname);
    if (cached) {
      return new Response(cached, { headers: { 'Content-Type': 'application/json' } });
    }

    // D1 query
    const { results } = await env.DB.prepare(
      'SELECT * FROM posts WHERE slug = ?'
    ).bind(url.pathname.split('/').pop()).all();

    // Cache result
    await env.CACHE.put(url.pathname, JSON.stringify(results), { expirationTtl: 3600 });

    return Response.json(results);
  }
};
```

## Checklist

- [ ] wrangler.toml configured
- [ ] Environment variables set
- [ ] KV namespaces created
- [ ] R2 buckets configured
- [ ] D1 databases initialized
- [ ] Routes configured
- [ ] Custom domain setup
- [ ] Monitoring enabled
