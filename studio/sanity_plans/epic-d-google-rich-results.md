# EPIC-D: Google Rich Results Testing

## Overview

Validate structured data passes Google's Rich Results Test and document the testing process for ongoing maintenance.

## Goal

All JSON-LD structured data passes Google's Rich Results Test with no errors.

## Slices

### Slice D-1: Test Person schema

**File**: `docs/seo/google-rich-results-test.md`

**Changes**:
- Document how to test Person JSON-LD
- Include screenshots of passing test
- Document common errors and fixes
- Add to testing checklist

**Acceptance Criteria**:
- [ ] Documentation exists for testing Person schema
- [ ] Screenshots of passing test included
- [ ] Common errors documented

---

### Slice D-2: Test Article schema

**File**: `docs/seo/google-rich-results-test.md`

**Changes**:
- Document how to test Article JSON-LD
- Include screenshots of passing test
- Document common errors and fixes
- Add to testing checklist

**Acceptance Criteria**:
- [ ] Documentation exists for testing Article schema
- [ ] Screenshots of passing test included
- [ ] Common errors documented

---

### Slice D-3: Document image requirements

**File**: `docs/seo/image-requirements.md`

**Changes**:
- Document Google's image requirements for rich snippets
- Include minimum dimensions (1200x630)
- Include recommended formats (WebP, JPEG, PNG)
- Include file size limits
- Include accessibility requirements (alt text)

**Acceptance Criteria**:
- [ ] Image requirements documented
- [ ] Minimum dimensions listed
- [ ] Formats listed
- [ ] Accessibility requirements listed

---

## Testing

- Run each JSON-LD component through Google's Rich Results Test
- Document any errors and how to fix them
- Create testing checklist for future use

## Commit Strategy

Each slice will be committed separately:
1. `docs(seo): add Person schema testing documentation`
2. `docs(seo): add Article schema testing documentation`
3. `docs(seo): add image requirements documentation`
