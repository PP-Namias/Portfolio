# react-doctor findings by rule

**Source:** [findings.json](./findings.json) (43 findings, 22 affected files, 91/100 score)

**Sort:** error-severity rules first, then warning-severity rules, then by count desc, then rule name asc.

Within each rule, findings are sorted by file path asc, then line asc, then column asc.

---

## no-danger (3x, error)

> **Epic:** EPIC-3  
> **Title:** Replace dangerouslySetInnerHTML with safe rendering  
> **Category:** Security

**Use of dangerouslySetInnerHTML**

> `dangerouslySetInnerHTML` is an XSS hole that runs attacker-controlled HTML in your users' browsers.

_Fix:_ Render trusted content as React children rather than injecting raw HTML.

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-005 | `src/app/blog/[slug]/page.tsx` | 78 | 11 |
| F-006 | `src/app/layout.tsx` | 110 | 13 |
| F-007 | `src/app/layout.tsx` | 141 | 11 |

## iframe-missing-sandbox (2x, error)

> **Epic:** EPIC-3  
> **Title:** Add sandbox attribute to iframes  
> **Category:** Security

**iframe missing sandbox attribute**

> An `<iframe>` with no `sandbox` is a security hole: the embedded page gets full access to your site.

_Fix:_ Add `sandbox=""` (or a curated value) to your iframe.

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-001 | `src/components/ui/BookingModal.tsx` | 116 | 10 |
| F-002 | `src/components/ui/ResumeModal.tsx` | 76 | 10 |

## no-array-index-as-key (2x, error)

> **Epic:** EPIC-4  
> **Title:** Use stable id for list keys  
> **Category:** Bugs

**Array index used as a key**

> Your users can see & submit the wrong data when this list reorders or filters, so use a stable id like `key={item.id}`, not the array index "i".

_Fix:_ Use a stable id from the item, like `key={item.id}` or `key={item.slug}`. Index keys break when the list reorders or filters.

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-003 | `src/components/sections/AboutSection.tsx` | 39 | 15 |
| F-004 | `src/components/sections/RecommendationsCarousel.tsx` | 108 | 15 |

## no-fetch-in-effect (2x, error)

> **Epic:** EPIC-4  
> **Title:** Move fetch() out of useEffect or use SWR/React Query  
> **Category:** Bugs

**Data fetching inside an effect**

> fetch() inside useEffect races, double-fires & leaks for your users.

_Fix:_ Use `useQuery()` from @tanstack/react-query, `useSWR()`, or fetch in a Server Component instead

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-008 | `src/components/ui/ChatPanel.tsx` | 144 | 3 |
| F-009 | `src/components/ui/ResumeModal.tsx` | 17 | 3 |

## button-has-type (26x, warning)

> **Epic:** EPIC-5  
> **Title:** Add explicit type to non-submit buttons  
> **Category:** Bugs

**Button missing explicit type**

> Your users can submit the form by accident because a `<button>` with no `type` defaults to submit.

_Fix:_ Always set a `type` on a `<button>`: `type="button"`, `"submit"`, or `"reset"`.

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-010 | `src/app/error.tsx` | 58 | 10 |
| F-011 | `src/components/sections/CertificationsSection.tsx` | 63 | 12 |
| F-012 | `src/components/sections/CertificationsSection.tsx` | 119 | 10 |
| F-013 | `src/components/sections/CertificationsSection.tsx` | 151 | 16 |
| F-014 | `src/components/sections/GallerySection.tsx` | 129 | 12 |
| F-015 | `src/components/sections/GallerySection.tsx` | 194 | 12 |
| F-016 | `src/components/sections/GallerySection.tsx` | 222 | 14 |
| F-017 | `src/components/sections/GallerySection.tsx` | 236 | 14 |
| F-018 | `src/components/sections/GallerySection.tsx` | 245 | 14 |
| F-019 | `src/components/sections/TechStackSection.tsx` | 61 | 10 |
| F-020 | `src/components/ui/BookingModal.tsx` | 68 | 16 |
| F-021 | `src/components/ui/BookingModal.tsx` | 92 | 12 |
| F-022 | `src/components/ui/Button.tsx` | 61 | 6 |
| F-023 | `src/components/ui/ChatMessage.tsx` | 88 | 18 |
| F-024 | `src/components/ui/ChatPanel.tsx` | 313 | 12 |
| F-025 | `src/components/ui/ChatPanel.tsx` | 359 | 14 |
| F-026 | `src/components/ui/ChatPanel.tsx` | 369 | 12 |
| F-027 | `src/components/ui/ChatPanel.tsx` | 425 | 22 |
| F-028 | `src/components/ui/ChatPanel.tsx` | 457 | 16 |
| F-029 | `src/components/ui/ChatPanel.tsx` | 478 | 16 |
| F-030 | `src/components/ui/HubMenu.tsx` | 278 | 10 |
| F-031 | `src/components/ui/Modal.tsx` | 109 | 18 |
| F-032 | `src/components/ui/Modal.tsx` | 121 | 16 |
| F-033 | `src/components/ui/ResumeModal.tsx` | 64 | 12 |
| F-034 | `src/components/ui/ThemeToggle.tsx` | 13 | 8 |
| F-035 | `src/components/ui/ThemeToggle.tsx` | 23 | 6 |

## only-export-components (4x, warning)

> **Epic:** EPIC-7  
> **Title:** Move non-component exports to a separate file  
> **Category:** Maintainability

**Non-component export in component file**

> Fast Refresh stops working when a file exports non-components.

_Fix:_ Move non-component exports out of files that export components.

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-038 | `src/app/opengraph-image.tsx` | 4 | 14 |
| F-039 | `src/app/twitter-image.tsx` | 4 | 14 |
| F-040 | `src/components/cms/SanityField.tsx` | 25 | 17 |
| F-041 | `src/components/cms/SanityField.tsx` | 37 | 17 |

## control-has-associated-label (1x, warning)

> **Epic:** EPIC-5  
> **Title:** Associate input with a label  
> **Category:** Accessibility

**Control missing accessible label**

> Blind users can't tell what this control does because screen readers find no label, so add visible text, `aria-label`, or `aria-labelledby`.

_Fix:_ Give every interactive control a label screen readers can read.

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-036 | `src/components/ui/ChatPanel.tsx` | 506 | 11 |

## jsx-no-constructed-context-values (1x, warning)

> **Epic:** EPIC-4  
> **Title:** Memoize the value passed to Context.Provider  
> **Category:** Performance

**Unstable context provider value**

> Every reader of this context redraws on each render because you build its `value` inline.

_Fix:_ Wrap the context value in `useMemo`, or move it outside the component.

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-037 | `src/hooks/useAccentColor.tsx` | 70 | 34 |

## prefer-tag-over-role (1x, warning)

> **Epic:** EPIC-5  
> **Title:** Use semantic button or a instead of role override  
> **Category:** Accessibility

**Role used instead of HTML tag**

> Screen reader users get more reliable semantics from `<datalist>` than `role="listbox"`, so use `<datalist>` instead.

_Fix:_ Replace `role` with the matching HTML element when one exists.

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-042 | `src/components/ui/ColorSchemePicker.tsx` | 73 | 11 |

## rendering-hydration-mismatch-time (1x, warning)

> **Epic:** EPIC-8  
> **Title:** Avoid Date.now or Math.random in render  
> **Category:** Bugs

**Time or random value in JSX**

> This breaks hydration because new Date() reached from JSX gives a different value on the server than in the browser, so move it into useEffect+useState to run only in the browser, or add suppressHydrationWarning to the parent if it's on purpose

_Fix:_ Move time or random values into useEffect+useState so they only run in the browser, or add suppressHydrationWarning to the parent if it's intentional

| ID | File | Line | Col |
|----|------|-----:|----:|
| F-043 | `src/components/layout/Footer.tsx` | 62 | 19 |

---

_Total: 43 findings across 10 rules, 22 files, score 91/100._
