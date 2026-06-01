import {type DocumentActionComponent, type DocumentActionProps} from 'sanity'
import {usePerspective} from 'sanity/lib/perspective'

const PERSPECTIVES = ['published', 'drafts', 'previewDrafts'] as const
type Perspective = (typeof PERSPECTIVES)[number]

const PERSPECTIVE_LABELS: Record<Perspective, string> = {
  published: 'Published only',
  drafts: 'Drafts only',
  previewDrafts: 'Preview drafts',
}

const PERSPECTIVE_DESCRIPTIONS: Record<Perspective, string> = {
  published: 'See what the live marketing site reads.',
  drafts: 'See unpublished changes only.',
  previewDrafts: 'See drafts overlaid on the latest published version.',
}

function getCurrentPerspective(): Perspective {
  if (typeof document === 'undefined') {
    return 'published'
  }
  const cookie = document.cookie.split('; ').find((c) => c.startsWith('sanity-preview-perspective='))
  if (!cookie) {
    return 'published'
  }
  const value = cookie.split('=')[1] as Perspective
  return PERSPECTIVES.includes(value) ? value : 'published'
}

function setPerspectiveCookie(p: Perspective) {
  if (typeof document === 'undefined') {
    return
  }
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `sanity-preview-perspective=${p}; expires=${expires}; path=/; SameSite=Lax`
}

export const perspectiveSwitcherAction: DocumentActionComponent = (props: DocumentActionProps) => {
  void usePerspective

  const current = getCurrentPerspective()
  const next: Perspective = current === 'published' ? 'previewDrafts' : current === 'previewDrafts' ? 'drafts' : 'published'

  return {
    label: `Perspective: ${PERSPECTIVE_LABELS[current]}`,
    icon: () => '◐',
    tooltip: `${PERSPECTIVE_DESCRIPTIONS[current]} (click to switch to ${PERSPECTIVE_LABELS[next]})`,
    onHandle: () => {
      setPerspectiveCookie(next)
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    },
  }
}

export const perspectiveActions: DocumentActionComponent[] = PERSPECTIVES.map((p) => ({
  label: PERSPECTIVE_LABELS[p],
  icon: () => (p === currentSafe() ? '●' : '○'),
  tooltip: PERSPECTIVE_DESCRIPTIONS[p],
  onHandle: () => {
    setPerspectiveCookie(p)
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  },
}))

function currentSafe(): Perspective {
  return getCurrentPerspective()
}

export {PERSPECTIVE_LABELS, PERSPECTIVE_DESCRIPTIONS}
export type {Perspective}
