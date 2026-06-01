let environmentLoaded = false
const processEnv = typeof process !== 'undefined' ? process.env : undefined
const defaultEnvValues: Record<string, string> = {
  SANITY_STUDIO_PROJECT_ID: 'nl0qw78w',
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'nl0qw78w',
  SANITY_STUDIO_DATASET: 'production',
  NEXT_PUBLIC_SANITY_DATASET: 'production',
}

const ENV_REGISTRY = {
  projectId: ['SANITY_STUDIO_PROJECT_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID'],
  dataset: ['SANITY_STUDIO_DATASET', 'NEXT_PUBLIC_SANITY_DATASET'],
  revalidateSecret: [
    'SANITY_STUDIO_REVALIDATE_SECRET',
    'SANITY_REVALIDATE_SECRET',
    'NEXT_PUBLIC_SANITY_REVALIDATE_SECRET',
  ],
  siteUrl: ['NEXT_PUBLIC_SITE_URL'],
  studioUrl: ['SANITY_STUDIO_URL', 'NEXT_PUBLIC_SANITY_STUDIO_URL'],
  readToken: ['SANITY_API_READ_TOKEN', 'NEXT_PUBLIC_SANITY_READ_TOKEN'],
} as const

export type EnvKey = keyof typeof ENV_REGISTRY

export type StudioEnvSnapshot = {
  projectId: string
  dataset: string
  revalidateSecret?: string
  siteUrl: string
  studioUrl?: string
  readToken?: string
  loaded: boolean
}

let cachedSnapshot: StudioEnvSnapshot | null = null

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
  setProcessEnvValue(
    'SANITY_STUDIO_REVALIDATE_SECRET',
    getEnvValue('SANITY_STUDIO_REVALIDATE_SECRET') ??
      getEnvValue('SANITY_REVALIDATE_SECRET') ??
      getEnvValue('NEXT_PUBLIC_SANITY_REVALIDATE_SECRET'),
  )

  environmentLoaded = true
  cachedSnapshot = null
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
  const secret = getEnvValue('SANITY_STUDIO_REVALIDATE_SECRET') ?? getEnvValue('SANITY_REVALIDATE_SECRET')

  if (!secret) {
    return '/api/draft-mode/enable'
  }

  return `/api/draft-mode/enable?secret=${encodeURIComponent(secret)}`
}

export function getWebhookTriggerUrl(): string {
  const origin = getStudioPreviewOrigin()
  const secret = getEnvValue('SANITY_STUDIO_REVALIDATE_SECRET') ?? getEnvValue('SANITY_REVALIDATE_SECRET')
  const url = new URL('/api/sanity/webhook', origin)

  if (secret) {
    url.searchParams.set('secret', secret)
  }

  return url.toString()
}

function firstDefined(...candidates: (string | undefined)[]): string | undefined {
  for (const candidate of candidates) {
    if (candidate) {
      return candidate
    }
  }
  return undefined
}

export function getStudioEnvSnapshot(): StudioEnvSnapshot {
  if (cachedSnapshot) {
    return cachedSnapshot
  }

  loadStudioEnvironment()

  cachedSnapshot = {
    projectId: requireStudioEnv('SANITY_STUDIO_PROJECT_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: requireStudioEnv('SANITY_STUDIO_DATASET', 'NEXT_PUBLIC_SANITY_DATASET'),
    revalidateSecret: firstDefined(
      getEnvValue('SANITY_STUDIO_REVALIDATE_SECRET'),
      getEnvValue('SANITY_REVALIDATE_SECRET'),
      getEnvValue('NEXT_PUBLIC_SANITY_REVALIDATE_SECRET'),
    ),
    siteUrl: getEnvValue('NEXT_PUBLIC_SITE_URL') || 'http://localhost:3000',
    studioUrl: firstDefined(getEnvValue('SANITY_STUDIO_URL'), getEnvValue('NEXT_PUBLIC_SANITY_STUDIO_URL')),
    readToken: firstDefined(getEnvValue('SANITY_API_READ_TOKEN'), getEnvValue('NEXT_PUBLIC_SANITY_READ_TOKEN')),
    loaded: true,
  }

  return cachedSnapshot
}

export function describeEnvForDebug(): Record<EnvKey, {set: boolean; source?: string}> {
  loadStudioEnvironment()

  return Object.fromEntries(
    Object.entries(ENV_REGISTRY).map(([key, candidates]) => {
      const found = candidates
        .map((name) => ({name, value: getEnvValue(name)}))
        .find((entry) => Boolean(entry.value))
      return [
        key,
        {
          set: Boolean(found),
          source: found?.name,
        },
      ]
    }),
  ) as Record<EnvKey, {set: boolean; source?: string}>
}