import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {SITE_URL, SANITY_PROJECT_ID, SANITY_DATASET} from '@/lib/site-config'

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

function isDraftModeEnabled(): boolean {
  const cookie = process.env.SANITY_DRAFT_COOKIE_NAME || 'sanity-preview'
  return Boolean(process.env[cookie])
}

export function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('enable') === '1') {
    return withCors(
      NextResponse.json({
        ok: true,
        enabled: isDraftModeEnabled(),
        revalidatePaths: REVALIDATE_PATHS,
      }),
    )
  }
  return withCors(
    NextResponse.json({
      ok: false,
      error: 'Pass ?enable=1 to test the draft-mode connection.',
    }),
  )
}

export function OPTIONS() {
  return withCors(new NextResponse(null, {status: 204}))
}
