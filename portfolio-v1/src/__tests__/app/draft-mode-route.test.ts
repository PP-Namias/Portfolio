import {NextRequest} from 'next/server'
import {beforeEach, describe, expect, it, vi} from 'vitest'

const enableMock = vi.fn()

vi.mock('next-sanity/draft-mode', () => ({
  defineEnableDraftMode: () => {
    const handler = (request: NextRequest) => {
      const url = new URL(request.url)
      const secret = url.searchParams.get('secret')
      const redirect = url.searchParams.get('redirect') ?? '/'

      if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
        return new Response('Invalid secret', {status: 401})
      }

      enableMock()
      return Response.redirect(new URL(redirect, url.origin), 307)
    }
    return {GET: handler}
  },
}))

import {GET} from '@/app/api/draft-mode/enable/route'

describe('/api/draft-mode/enable route', () => {
  beforeEach(() => {
    enableMock.mockClear()
    process.env.SANITY_REVALIDATE_SECRET = 'unit-test-secret'
  })

  it('rejects requests with an invalid secret', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/draft-mode/enable?secret=wrong&redirect=/blog',
    )

    const response = await GET(request)

    expect(response.status).toBe(401)
    expect(enableMock).not.toHaveBeenCalled()
  })

  it('enables draft mode and redirects to the requested path', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/draft-mode/enable?secret=unit-test-secret&redirect=/blog/hello-world',
    )

    const response = await GET(request)

    expect(enableMock).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/blog/hello-world')
  })
})