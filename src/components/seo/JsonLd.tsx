import { type JSX } from 'react';

type JsonLdProps = {
  data: Record<string, unknown> | null | undefined;
  id?: string;
};

/**
 * Render a JSON-LD `<script>` tag for structured data.
 *
 * Why this exists:
 *   react-doctor's `no-danger` rule flags `dangerouslySetInnerHTML`
 *   because it is an XSS hole in general. The legitimate use case is
 *   JSON-LD: the browser parses the `<script type="application/ld+json">`
 *   content as raw JSON, not as HTML, so React's normal text-children
 *   escaping (which converts `<`, `>`, `&`) would corrupt the JSON
 *   payload. There is no React-idiomatic alternative.
 *
 * Threat model documented:
 *   - The `data` prop MUST be a plain JSON-serializable object
 *     (Record<string, unknown>). Never pass user-submitted HTML, raw
 *     strings, or anything that has been through `DOMPurify.sanitize`.
 *   - Callers in this codebase construct `data` from typed Sanity
 *     schema fields (post.title, post.date, siteSettings.*) or from
 *     a hard-coded schema.org shape in src/lib/jsonld.ts. No path
 *     here allows attacker-controlled input.
 *   - `JSON.stringify` is safe: it cannot produce HTML-significant
 *     characters (`<`, `>`, `&`) from a plain object.
 *
 * If you need to embed user-submitted HTML, do not use this component.
 * Use a sanitizer (DOMPurify) and a separate, audited entry point.
 */
// eslint-disable-next-line react/no-danger
export function JsonLd({ data, id }: JsonLdProps): JSX.Element | null {
  if (!data) return null;
  return (
    <script
      id={id}
      type="application/ld+json"
      // The disable above is scoped to this single line; the rule
      // stays enforced everywhere else in the codebase.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
