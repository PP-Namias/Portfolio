# PR: Dev → Main — Chatbot, Image Fixes, Modal Fix, A11y, Performance & Security

## Summary

This PR brings **28 commits** from `dev` into `main`, covering chatbot personality & UX, production image loading fixes, duplicate modal close button fix, accessibility improvements, performance optimizations, security hardening, and documentation.

---

## Highlights

### 1. AI Chatbot — Tsundere Personality + Welcome Message (#271)

**Files:** `promptBuilder.ts`, `ChatPanel.tsx`, `ChatMessage.tsx`

- Updated system prompt with a tsundere personality (informative + playful, ~20-30% personality ratio)
- AI auto-sends a welcome message when chat opens with 6 clickable topic buttons:
  - About Keneth, Skills & Tech, Experience, Projects, Schedule Call, Certifications
- Added `[WELCOME_TOPICS]` tag parsing in `ChatMessage` for the topic card grid
- Added `profile` and `contact` actions to the action question map
- Removed the old static empty-state action cards (replaced by AI message)

### 2. Chatbot Unit Tests (82 new tests)

**Files:** `promptBuilder.test.ts` (44), `providers.test.ts` (28), `rateLimiter.test.ts` (10)

- Comprehensive coverage for system prompt generation, intent handling, provider config, circuit breaker, and rate limiting
- All 105 API tests passing

### 3. Duplicate Modal Close Button Fix (#271)

**Files:** `Modal.tsx`, `BookingModal.tsx`, `ResumeModal.tsx`, `ContactModal.tsx`

- **Bug:** Schedule Meeting, Resume, and Contact modals each had TWO close buttons — one in their toolbar and one floating from the base `Modal` component
- **Fix:** Added `showCloseButton` prop to `Modal` (defaults to `true`). BookingModal, ResumeModal, and ContactModal now pass `showCloseButton={false}` to suppress the base Modal's close button
- Each modal now has exactly one close button in its own toolbar

### 4. Production Image Loading Fix

**Files:** `route.ts`, `OptimizedImage.tsx`, `HeroSection.tsx`

- Media gateway falls back to unsigned mode when `SANITY_MEDIA_GATEWAY_SECRET` is missing (instead of 500 error)
- `OptimizedImage` uses browser-native `atob()` + `TextDecoder` instead of Node.js `Buffer`
- Added `ImagePlaceholder` component for graceful degradation
- Hero section shows initials fallback when profile image is empty

### 5. Media Gateway Improvements

**Files:** `media-gateway.ts`, `media-constants.ts`

- Extended signature TTL from 15 minutes to 7 days
- Added 1-hour grace period for expired signatures
- Added unsigned passthrough for valid Sanity CDN URLs as fallback
- Aligned cache-control headers with extended TTL
- Added signature expiry and fallback monitoring logs

### 6. Accessibility Improvements

**Files:** Multiple section components, `Footer.tsx`

- Added `aria-labelledby` to all section elements
- Fixed footer icon links
- Added not-found pages for blog and projects routes
- Added loading and error boundaries for blog and projects routes

### 7. Performance Optimizations

**Files:** `useTheme.ts`, `ChatPanel.tsx`, `page.tsx`

- Memoized unstable callback references in `useTheme` and `ChatPanel`
- Extracted homepage into server + client components (`HomeContent.tsx`)

### 8. Security Hardening

**Files:** `middleware.ts`, `getProjectBySlug`

- Removed broken in-memory rate limiter from middleware
- Sanitized GROQ query in `getProjectBySlug`
- Documented CSP unsafe-inline requirement for Next.js

### 9. Documentation

**Files:** `README.md`, 8 language translations, PRD docs

- Rewrote README with screenshots, updated stats, and badge links
- Added 8 language translations (DE, ES, FR, JA, KO, PT, RU, ZH)
- Added media signature fix PRD and resolution docs

---

## Commits (28)

```
1f4026c fix(modal): remove duplicate close button in Booking, Resume, and Contact modals
19c943c feat(chat): add AI welcome message with quick-action topic buttons
c2656b4 feat(chat): add tsundere personality to chatbot and comprehensive unit tests
eb1e258 fix(media): fix production image loading with unsigned fallback and browser-native decoding
091f7e8 fix(test): update HeroSection label test for aria-labelledby
222a417 fix(ux,a11y): add not-found pages, fix footer icons, aria-controls
7742aaf fix(a11y): add aria-labelledby to section elements
276063a fix(typo): correct ErrorBoundary message text
957a8fb fix(perf): memoize unstable callback references in useTheme and ChatPanel
9ccf917 fix(ux): add loading and error boundaries to blog and projects routes
94e919f fix(code quality): remove console.error monkey-patch from providers
1660805 fix(perf): extract homepage into server + client components
acce3f9 fix(security): document CSP unsafe-inline requirement for Next.js
041b427 fix(security): remove broken in-memory rate limiter from middleware
e65f86a fix(security): sanitize GROQ query in getProjectBySlug
d819d48 feat(scripts): unified install, build, and dev for root + studio
2f5ff1a docs(readme): add 8 language translations with hero screenshot
adba00f docs(readme): clean minimal style with badge links
bbdd4a5 docs(readme): rewrite to clean minimal style with screenshots
acc788a docs(readme): rewrite with screenshots, updated stats, and better structure
d192a47 docs(prd): add media signature fix plan and resolution
44181fd docs(media-gateway): document Cloudflare Worker secret setup
af20fda test(media-gateway): update tests for extended TTL, grace period, and fallback
f2f219e feat(media-gateway): add signature expiry and fallback monitoring logs
d427e83 fix(media-gateway): align cache-control headers with extended TTL
eacc3ee feat(media): add client-side image error recovery with raw CDN fallback
6f2a639 fix(media-gateway): allow unsigned passthrough for valid Sanity CDN URLs as fallback
616b6af fix(media-gateway): add 1-hour grace period for expired signatures
8575931 fix(media-gateway): extend signature TTL from 15 minutes to 7 days
```

---

## Testing

- [x] `npx tsc --noEmit` — 0 errors
- [x] `npm run test -- --run` — all tests passing
- [x] `npm run lint` — only pre-existing warnings (unrelated)

## Deployment Notes

### Cloudflare Workers

Set the media gateway secret:

```bash
npx wrangler secret put SANITY_MEDIA_GATEWAY_SECRET
```

### Environment Variables

`.env.example` updated with `SANITY_MEDIA_GATEWAY_SECRET` documentation.

## Impact

- **Chatbot** — more engaging with personality and guided welcome flow
- **Images** — all production images load with graceful fallbacks
- **Modals** — no more duplicate close buttons
- **Accessibility** — WCAG compliance improvements across all sections
- **Performance** — reduced unnecessary re-renders and server/client boundary optimization
- **Security** — removed broken rate limiter, sanitized queries
