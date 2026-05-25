let environmentLoaded = false
const processEnv = typeof process !== 'undefined' ? process.env : undefined
const defaultEnvValues: Record<string, string> = {
  SANITY_STUDIO_PROJECT_ID: 'nl0qw78w',
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'nl0qw78w',
  SANITY_STUDIO_DATASET: 'production',
  NEXT_PUBLIC_SANITY_DATASET: 'production',
}

function getEnvValue(name: string): string | undefined {
  const value = processEnv?.[name]

  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function setProcessEnvValue(name: string, value?: string) {
  if (!processEnv || !value) {
    return
  }

  if (!processEnv[name] || processEnv[name]?.trim() === '') {
    processEnv[name] = value
  }
}

export function loadStudioEnvironment() {
  if (environmentLoaded) {
    return
  }

  setProcessEnvValue(
    'SANITY_STUDIO_PROJECT_ID',
    getEnvValue('SANITY_STUDIO_PROJECT_ID') ?? getEnvValue('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  )
  setProcessEnvValue(
    'SANITY_STUDIO_DATASET',
    getEnvValue('SANITY_STUDIO_DATASET') ?? getEnvValue('NEXT_PUBLIC_SANITY_DATASET'),
  )

  environmentLoaded = true
}

export function requireStudioEnv(...names: string[]): string {
  const candidates = names.length > 0 ? names : []
  const value = candidates.map((name) => getEnvValue(name)).find(Boolean)

  if (!value) {
    const fallback = candidates.map((name) => defaultEnvValues[name]).find(Boolean)

    if (fallback) {
      return fallback
    }
  }

  if (!value) {
    const label = candidates.length > 0 ? candidates.join(' or ') : 'unknown'
    throw new Error(
      `Missing required Sanity Studio env var: ${label}. Load the root .env/.env.local files or set it in the shell.`,
    )
  }

  return value
}

export function getStudioPreviewOrigin(): string {
  return getEnvValue('NEXT_PUBLIC_SITE_URL') || 'http://localhost:3000'
}

export function getDraftModeEnablePath(): string {
  const secret = getEnvValue('SANITY_REVALIDATE_SECRET')

  if (!secret) {
    return '/api/draft-mode/enable'
  }

  return `/api/draft-mode/enable?secret=${encodeURIComponent(secret)}`
}