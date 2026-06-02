---
title: Add a Certification
trigger: "add cert", "new certification", "credential"
audience: editors
time: 2 min
---

# Add a Certification

## What this does
Creates a `certification` document. It appears in the homepage's
Certifications section (and `/`).

## Steps

1. **Content → Pages → Homepage → Certifications** → **Create new**.
2. Fill the form:
   - **Title** — required (e.g. "AWS Solutions Architect Associate").
   - **Issuer** — reference to a `certificationIssuer` doc. Add a new one if it doesn't exist.
   - **Issued at** — date the cert was issued.
   - **Never expires** — toggle on for lifetime certs. Hides the expiry fields.
   - **Expires at** — only shown if `neverExpires = false`. Validated: must be after `issuedAt`.
   - **Credential URL** — link to verify the cert. Hidden if `neverExpires`.
   - **Category** — reference to `certificationCategory`.
   - **Tags** — array of strings.
   - **Order** — display order (lower = first).
   - **Image** — optional. Certificate image with alt text.
3. The **Expiring soon** badge (red) will appear within 90 days of `expiresAt`.

## Common mistakes
- ❌ Setting `neverExpires = true` for a cert you know expires — the expiry is just hidden, not waived.
- ❌ Skipping the `Issuer` reference — the cert won't group properly on the homepage.

## Related skills
- `fix-expiring-certification.md`
- `add-a-reference-data-type.md` (for Issuers)
- `use-status-badges.md`
