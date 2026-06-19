import {createDataAttribute, type CreateDataAttributeProps} from 'next-sanity'

/**
 * Helper for adding `data-sanity="..."` attributes to elements so the
 * Sanity Presentation tool can offer click-to-edit on the live marketing
 * site. Usage:
 *
 *   <h1 {...sanityField('profile', 'heroRoles', 0)}>{role}</h1>
 *   <h1 {...sanityField({id, type: 'profile'}, 'heroRoles', 0)}>{role}</h1>
 *
 * The attribute is always a non-breaking no-op in production: VisualEditing
 * only attaches behavior when the page is in draft mode (i.e. when the
 * Presentation tool has enabled it via /api/draft-mode/enable).
 */
export function sanityField(
  source: string | Pick<CreateDataAttributeProps, 'id' | 'type'>,
  path: string,
  index?: number,
) {
  const base: Pick<CreateDataAttributeProps, 'id' | 'type'> =
    typeof source === 'string' ? {id: source, type: source} : source

  return {
    'data-sanity': createDataAttribute({
      ...base,
      path: index === undefined ? [path] : [path, {_key: `idx${index}`}, index.toString()],
    }).toString(),
  }
}
