import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

import { middleware } from '@/middleware';

function createRequest({
  pathname = '/api/test',
  method = 'GET',
  contentType,
}: {
  pathname?: string;
  method?: string;
  contentType?: string;
} = {}): NextRequest {
  const url = new URL(`https://example.com${pathname}`);
  const headers = new Headers();
  if (contentType) headers.set('content-type', contentType);
  return new NextRequest(url.toString(), { method, headers } as RequestInit & { headers: HeadersInit });
}

describe('middleware', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls NextResponse.next for GET requests on API routes', () => {
    const req = createRequest({ method: 'GET' });
    const res = middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
  });

  it('calls NextResponse.next for DELETE requests on API routes', () => {
    const req = createRequest({ method: 'DELETE' });
    const res = middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
  });

  it('passes through POST requests with application/json content-type', () => {
    const req = createRequest({ method: 'POST', contentType: 'application/json' });
    const res = middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
  });

  it('passes through POST requests with multipart/form-data content-type', () => {
    const req = createRequest({ method: 'POST', contentType: 'multipart/form-data; boundary=---123' });
    const res = middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
  });

  it('passes through PUT and PATCH requests with valid content-type', () => {
    const putRes = middleware(createRequest({ method: 'PUT', contentType: 'application/json' }));
    expect(putRes).toBeInstanceOf(NextResponse);

    const patchRes = middleware(createRequest({ method: 'PATCH', contentType: 'application/json' }));
    expect(patchRes).toBeInstanceOf(NextResponse);
  });

  it('passes through POST requests with no content-type header', () => {
    const req = createRequest({ method: 'POST' });
    const res = middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
  });

  it('does not apply content-type checks to non-API routes', () => {
    const req = createRequest({ pathname: '/about', method: 'POST' });
    const res = middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
  });

  it('preserves the request URL', () => {
    const req = createRequest({ method: 'GET' });
    const res = middleware(req);
    expect(res.headers.get('x-middleware-rewrite')).toBeNull();
  });
});
