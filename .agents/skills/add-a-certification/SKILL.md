---
name: add-a-certification
description: Creates a new certification document in the Sanity studio. Use when the user wants to add a credential, certificate, or professional accreditation to the Certifications collection.
---

# Add a Certification

Use this skill when the user wants to add a new `certification`
document. It appears in the homepage's Certifications section (and
`/`).

## When to use this skill

- Use this when the user says "add a cert", "new certification",
  "I just got certified", or "add a credential".
- Use this when the user wants to track a professional accreditation.

## Workflow

1. Direct the user to **Content → Pages → Homepage → Certifications**
   → **Create new**.
2. Fill the form with the following fields:
   - **Title** — required (e.g. "AWS Solutions Architect
     Associate").
   - **Issuer** — reference to a `certificationIssuer` doc. Add a new
     one if it doesn't exist.
   - **Issued at** — date the cert was issued.
   - **Never expires** — toggle on for lifetime certs. Hides the
     expiry fields.
   - **Expires at** — only shown if `neverExpires = false`. Validated:
     must be after `issuedAt`.
   - **Credential URL** — link to verify the cert. Hidden if
     `neverExpires`.
   - **Category** — reference to `certificationCategory`.
   - **Tags** — array of strings.
   - **Order** — display order (lower = first).
   - **Image** — optional. Certificate image with alt text.
3. The **Expiring soon** badge (red) will appear within 90 days of
   `expiresAt`.

## Common mistakes

- Setting `neverExpires = true` for a cert you know expires — the
  expiry is just hidden, not waived.
- Skipping the `Issuer` reference — the cert won't group properly on
  the homepage.

## Related

- `fix-expiring-certification`
- `add-a-reference-data-type` (for Issuers)
- `use-status-badges`
