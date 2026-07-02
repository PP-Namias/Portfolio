import { NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export function isAdminRequest(request: NextRequest): boolean {
  const apiKey = process.env.ADMIN_API_KEY?.trim()
  if (!apiKey) return false
  const providedKey = request.headers.get('x-api-key')
  if (!providedKey) return false
  return safeCompare(providedKey, apiKey)
}
