import { NextRequest } from 'next/server';

export function isAdminRequest(request: NextRequest): boolean {
  const apiKey = process.env.ADMIN_API_KEY?.trim();
  if (!apiKey) return false;
  return request.headers.get('x-api-key') === apiKey;
}
