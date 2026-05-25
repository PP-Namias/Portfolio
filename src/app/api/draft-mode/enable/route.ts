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

  const redirectTarget = requestUrl.searchParams.get('redirect')?.trim() || '/'

  return NextResponse.redirect(new URL(redirectTarget, request.url))
}