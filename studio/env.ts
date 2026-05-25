let environmentLoaded = false

export function loadStudioEnvironment() {
  if (environmentLoaded) {
    return
  }

  environmentLoaded = true
}

export function requireStudioEnv(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(
      `Missing required Sanity Studio env var: ${name}. Load the root .env/.env.local files or set it in the shell.`,
    )
  }

  return value
}

export function getStudioPreviewOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000'
}

export function getDraftModeEnablePath(): string {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim()

  if (!secret) {
    return '/api/draft-mode/enable'
  }

  return `/api/draft-mode/enable?secret=${encodeURIComponent(secret)}`
}