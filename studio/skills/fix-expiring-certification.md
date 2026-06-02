---
title: Fix Expiring Certification
trigger: "expiring", "cert expiring"
audience: editors
time: 2 min
---

# Fix Expiring Certification

The **Expiring soon** badge appears 90 days before a certification's
`expiresAt`.

## Steps

1. Open the cert from the **Certifications** list (sorted by `expiresAt`).
2. **Renewed**? Update `expiresAt` to the new date and save.
3. **No longer renewing**? Toggle `neverExpires = true` and the
   field hides; the badge disappears.
4. **Expired and not renewing**? Change `status` to `archived` and
   remove from the homepage.
5. Click **Publish**.

## Bulk audit
Use the **Vision tool** → "Expiring certifications" saved query.
