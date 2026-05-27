# Secure Media Gateway Plan

Last updated: 2026-05-28  
Project: PP Namias Portfolio (`namias.tech`)

## Objective

Design a secure, privacy-preserving media and data delivery layer for the portfolio so the public site can use Sanity-backed images and content without exposing direct backend access, raw tokens, or easily enumerable origin endpoints.

## Important framing

This plan does **not** try to make public assets magically invisible or "untraceable". If an image is public on the web, someone can always request it somehow. The real goal is to:

- hide the Sanity project/API access pattern from the browser,
- keep write/read secrets server-side only,
- avoid exposing raw origin URLs in public markup where possible,
- make media delivery harder to scrape or abuse,
- preserve fast image performance through caching and edge-friendly delivery.

## Recommended approach

### Best-practice architecture: server-side media gateway

Use a **Next.js media gateway** pattern instead of exposing Sanity directly to the browser.

#### Public surface

The frontend should only request:

- `/api/media/*` for images/files
- server-rendered content pages that already contain sanitized, resolved media URLs
- optional signed, short-lived asset URLs when direct delivery is necessary

#### Private surface

Keep these private:

- Sanity project credentials
- Sanity write token
- any webhook secrets
- raw asset-fetch logic that resolves internal origin data
- direct CMS admin endpoints

### Why this is better than a plain reverse proxy

A traditional reverse proxy is useful, but for this portfolio the stronger pattern is a **controlled application gateway**:

- it can validate paths, signatures, and request shape before forwarding,
- it can normalize URLs and hide internal CMS details,
- it can cache aggressively without exposing backend internals,
- it keeps the logic inside the existing Next.js deployment surface.

If an external reverse proxy or CDN is later added, it should sit in front of this gateway rather than replace it.

## Security goals

1. **No client-side secrets**
   - Never expose Sanity read/write tokens in browser bundles.
   - Keep all token-based fetches in server components, route handlers, or server utilities.

2. **No direct origin coupling in public markup**
   - Avoid rendering raw CMS origin URLs everywhere in JSX if a gateway URL can be used instead.
   - Prefer stable gateway paths like `/api/media/<assetId>`.

3. **Strong request validation**
   - Reject unexpected file types, path traversal attempts, and malformed asset IDs.
   - Allow only known Sanity asset patterns or pre-approved source references.

4. **Caching without leakage**
   - Cache media at the gateway/CDN layer.
   - Serve cacheable assets with safe cache headers and immutable fingerprints where possible.

5. **Origin isolation**
   - Treat Sanity as a backend dependency, not a public image host.
   - Limit direct reference of Sanity URLs to server-side code when feasible.

## Proposed implementation phases

### Phase 1 — Define the trust boundary

Clarify which data is public, private, or server-only.

#### Phase 1 tasks

- Classify portfolio content into:
  - public content (blog, projects, certifications, images)
  - private operational content (tokens, secrets, webhook keys)
  - editor-only CMS content
- Decide whether any asset should require authenticated access.
- Document the allowed request flow from browser → Next.js → Sanity.

#### Phase 1 output

- A written trust-boundary diagram
- A list of public vs private asset types
- A policy for what the browser can and cannot request directly

### Phase 2 — Lock down Sanity access

Make Sanity a server-side integration only.

#### Phase 2 tasks

- Ensure read/write tokens remain in `.env` / `.env.local` only.
- Confirm the frontend never imports server secrets into client components.
- Audit all CMS fetch helpers for server-only usage.
- Keep webhook secrets and revalidation logic server-side.

#### Phase 2 output

- A verified server-only CMS access pattern
- No public exposure of sensitive Sanity credentials

### Phase 3 — Add a media gateway route

Create a route handler that resolves and returns images/files through the app.

#### Recommended route shapes

- `/api/media/[...path]`
- `/api/image/[assetId]`
- `/api/asset/[collection]/[id]`

#### Phase 3 tasks

- Validate each request against a strict allowlist.
- Resolve Sanity asset references server-side.
- Forward or stream the media response with safe headers.
- Add `Cache-Control` headers appropriate for immutable assets.
- Normalize all image URLs returned by the data layer so components only consume gateway URLs when possible.

#### Rules

- Do not allow arbitrary external URLs through the gateway.
- Do not create an open proxy.
- Do not forward query strings blindly unless they are explicitly required for image transforms.

### Phase 4 — Add signed or expiring URLs where needed

Use signed URLs only if a content type actually needs controlled access.

#### Phase 4 tasks

- Generate short-lived signatures for gateway URLs if the asset should not be freely enumerable.
- Verify signatures server-side before streaming content.
- Include expiration to reduce link sharing abuse.
- Rotate the signing secret if compromised.

#### Best fit

- useful for private drafts, admin previews, or protected assets
- not necessary for every public portfolio image if performance is the primary goal

### Phase 5 — Introduce caching and performance controls

Protect the backend while keeping the site fast.

#### Phase 5 tasks

- Add CDN-friendly cache headers for immutable image responses.
- Use image dimensions and content hashes to avoid cache poisoning.
- Prefer transformed image variants only when needed.
- Set stale-while-revalidate policies for public media.
- Use server-side image metadata to avoid repeated CMS lookups.

#### Phase 5 goal

- fast first load
- minimal repeat fetches
- reduced Sanity request volume

### Phase 6 — Restrict data exposure

Make sure content data is delivered only in the shape the UI needs.

#### Phase 6 tasks

- Keep CMS query logic in a server-only module.
- Return normalized DTOs instead of raw Sanity documents.
- Remove any unnecessary fields from public responses.
- Strip internal metadata, draft markers, and operational fields from browser-visible payloads.

#### Phase 6 output

- a safer content API surface
- less information available for scraping or inference

### Phase 7 — Harden revalidation and webhook entry points

Keep content refresh secure and predictable.

#### Phase 7 tasks

- Require a strong webhook secret for Sanity revalidation.
- Accept only expected methods and headers.
- Rate-limit or otherwise protect webhook endpoints if exposed publicly.
- Keep CORS narrow unless there is a documented reason to allow broader access.
- Log invalid revalidation attempts for review.

#### Phase 7 reference in this repo

The current webhook route already uses secret checking and path revalidation. This plan extends that idea to media delivery and content read paths.

### Phase 8 — Add monitoring and abuse detection

Make misuse visible.

#### Phase 8 tasks

- Log gateway misses, invalid signatures, and suspicious request spikes.
- Monitor media 4xx/5xx rates.
- Watch for unusual asset enumeration patterns.
- Keep request logs privacy-safe and minimal.

#### Phase 8 useful signals

- repeated invalid asset IDs
- requests with strange path traversal characters
- bursts of image requests from the same client
- failed signature validations

### Phase 9 — Roll out in small slices

Avoid a risky big-bang switch.

#### Suggested rollout order

1. Add the gateway route and keep it behind a feature flag.
2. Switch one media group first, such as blog cover images.
3. Expand to projects, certifications, and gallery assets.
4. Move any non-image media only after image delivery is stable.
5. Remove direct public CMS URL usage where the gateway is working reliably.

## Repository-specific implementation notes

### Likely files to touch

- `src/lib/cms-content.server.ts`
- `src/lib/media-gateway.ts`
- `src/app/api/media/[...path]/route.ts`
- `src/app/api/image/[assetId]/route.ts` or similar
- `src/components/**` image consumers
- `next.config.js` for security and remote image policy
- `.env.example` for any new gateway secrets

### Existing security strengths to preserve

- strict security headers in `next.config.js`
- server-side webhook revalidation
- `poweredByHeader: false`
- CSP already in place
- `cdn.sanity.io` only allowed where explicitly needed

### What to avoid

- a generic open proxy
- exposing the Sanity token to the client
- hardcoding full asset URLs in many components
- bypassing validation for the sake of convenience
- weakening CSP just to make a proxy work

## Recommended architecture decision

### Use this by default

#### Next.js server-side media gateway + Sanity server-only reads + optional signed URLs + cache headers

### Use an external reverse proxy only if needed

Add Cloudflare, Nginx, or a similar layer only if you need:

- stricter edge control,
- geographic caching,
- additional WAF rules,
- or platform-level shielding.

For this portfolio, the Next.js gateway is usually the cleanest first step because it keeps the logic close to the app and avoids unnecessary infrastructure complexity.

## Acceptance criteria

- No Sanity secret appears in client-side code or browser-visible bundles.
- Browser requests go through a controlled media endpoint instead of directly exposing backend URLs where practical.
- Media responses are cacheable and validated.
- Invalid asset/path requests are rejected safely.
- Webhook and revalidation flows remain protected.
- The public portfolio continues to load images quickly.
- The solution stays maintainable for a senior-backend-style security posture.

## Risks and tradeoffs

- **Extra latency:** a gateway can add a small overhead if caching is weak.
- **More code:** you trade direct CDN URLs for better control and auditability.
- **Not perfect secrecy:** public assets can still be discovered if they are intentionally public.
- **Operational overhead:** signed URL and cache logic need careful testing.

## Suggested next implementation slice

1. Add the media gateway route for blog cover images only.
2. Keep the existing Sanity CDN fallback during rollout.
3. Validate headers, caching, and path restrictions.
4. Expand the gateway to other asset groups once stable.

## Current implementation status

The first gateway slice is now implemented:

- shared media URL helpers live in `src/lib/media-gateway.ts`
- Sanity-backed media now resolves through `src/app/api/media/[...path]/route.ts`
- the content loader emits controlled gateway URLs for Sanity assets
- the gateway only accepts expected Sanity CDN asset shapes and sets cache-safe headers
- optional signature support is wired through `SANITY_MEDIA_GATEWAY_SECRET`
- env documentation and targeted tests were added for the new flow

## Bottom line

If your goal is a portfolio that looks like a modern, security-conscious backend system, the best practice is **not** a hacky hidden URL trick. It is a **server-side media gateway** with strict validation, server-only CMS access, optional signed URLs, and cache-aware delivery. That gives you a cleaner security story, better control, and a much more professional architecture.
