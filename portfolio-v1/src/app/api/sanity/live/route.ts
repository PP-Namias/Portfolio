import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {draftMode} from 'next/headers'
import {getContentVersion, getSanityLivePollMs} from '@/lib/content-version'
import {SITE_URL} from '@/lib/site-config'

export const runtime = 'nodejs'

const REVALIDATE_PATHS = ['/', '/blog', '/blog/[slug]', '/sitemap.xml'] as const

function withCors(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', SITE_URL)
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'content-type')
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

async function isDraftModeEnabled(): Promise<boolean> {
  const dm = await draftMode()
  return dm.isEnabled
}

export async function GET(request: NextRequest) {
  const isEnableProbe = request.nextUrl.searchParams.get('enable') === '1'
  const draft = await isDraftModeEnabled()
  const version = await getContentVersion()
  return withCors(
    NextResponse.json({
      ok: true,
      version,
      draftMode: draft,
      pollIntervalMs: getSanityLivePollMs(),
      revalidatePaths: REVALIDATE_PATHS,
      ...(isEnableProbe ? {enabled: draft} : {}),
    }),
  )
}

export function OPTIONS() {
  return withCors(new NextResponse(null, {status: 204}))
}
