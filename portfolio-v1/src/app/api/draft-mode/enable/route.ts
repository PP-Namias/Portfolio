import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {getReadClient} from '@/sanity/lib/client'

/**
 * Draft mode enable endpoint.
 *
 * The Sanity Studio Presentation tool calls this URL inside its iframe with
 * the preview secret, perspective, and target pathname. We:
 *   1. Use `defineEnableDraftMode` from `next-sanity/draft-mode` to validate
 *      the secret against Sanity's own perspective-aware client (the only
 *      source of truth — matches the secret stored in the Sanity project
 *      settings for the Presentation tool).
 *   2. Forward the `sanity-preview-*` params to the final pathname so the
 *      studio's perspective and click-to-edit context survive the
 *      redirect.
 *   3. Return a JSON response when the request was made from the studio's
 *      status probe (it polls the enable endpoint with `?probe=1`).
 */
export const {GET} = defineEnableDraftMode({
  client: getReadClient().withConfig({
    perspective: 'previewDrafts',
    useCdn: false,
  }),
})
