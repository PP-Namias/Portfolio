import {draftMode} from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'

function isAuthorizedPreviewRequest(url: URL): boolean {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET?.trim()

  if (!expectedSecret) {
    return true
  }

  return url.searchParams.get('secret')?.trim() === expectedSecret
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)

  if (!isAuthorizedPreviewRequest(requestUrl)) {
    return NextResponse.json({error: 'Invalid preview secret.'}, {status: 401})
  }

  const draftModeState = await draftMode()
  draftModeState.enable()

  // The Sanity Studio presentation tool passes preview params such as
  // `sanity-preview-pathname`, `sanity-preview-secret`, and
  // `sanity-preview-perspective`. When present, redirect back to the
  // requested preview pathname on this origin and preserve those params so
  // the Studio iframe can open the preview context correctly.
  const sanityPath = requestUrl.searchParams.get('sanity-preview-pathname')?.trim()
  const previewPath = requestUrl.searchParams.get('redirect')?.trim() || sanityPath || '/'

  const redirectUrl = new URL(previewPath, request.url)

  // Forward any sanity-preview-* query params to the final redirect so the
  // Studio presentation tool can carry context (secret, perspective).
  for (const [key, value] of requestUrl.searchParams.entries()) {
    if (key.startsWith('sanity-preview-')) {
      redirectUrl.searchParams.set(key, value ?? '')
    }
  }

  return NextResponse.redirect(redirectUrl)
}