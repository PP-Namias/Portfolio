import { cache } from 'react'
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server'
import { buildMediaGatewayUrl } from '@/lib/media-gateway'
import type { SocialLink } from '@/types'

const maybeCache = <T extends (...args: unknown[]) => Promise<HeroData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn
}

function normalizeSocialName(value: string): string {
  return value.toLowerCase()
}

function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function mapSocialLink(link: {
  platform?: string
  icon?: string
  url?: string
  placements?: string[]
}): SocialLink | null {
  const platform = String(link.platform || '').toLowerCase()
  const icon = String(link.icon || '').toLowerCase()
  const source = platform === 'message' && icon ? icon : platform || icon
  const normalizedName = normalizeSocialName(source)
  const url = String(link.url || '').trim()

  if (!normalizedName || !url) {
    return null
  }

  return {
    name: normalizedName,
    icon: normalizeSocialName(icon || platform || 'message'),
    label: titleCase(source),
    link: url,
    featured: Array.isArray(link.placements) ? link.placements.includes('hero') : false,
  }
}

export type HeroData = {
  profile: {
    name: string
    title: string
    location: string
    email: string
  }
  hero: {
    roles: string[]
    availabilityLabel: string
    profileImageUrl: string
  }
  socialLinks: SocialLink[]
}

async function fetchHeroDataImpl(): Promise<HeroData> {
  const profileDoc = await querySanity<{
    fullName?: string
    title?: string
    email?: string
    location?: string
    avatarUrl?: string
    profileImageUrl?: string
    availabilityLabel?: string
    heroRoles?: string[]
    socialLinks?: Array<{ platform?: string; icon?: string; url?: string; placements?: string[] }>
  }>(
    '*[_type == "profile"][0]{fullName,title,email,location,"avatarUrl":avatar.asset->url,"profileImageUrl":profileImage.asset->url,availabilityLabel,heroRoles,socialLinks[]{platform,icon,url,placements}}',
    { tags: CONTENT_TAGS.profile }
  )

  if (!profileDoc) {
    return {
      profile: { name: '', title: '', location: '', email: '' },
      hero: { roles: [], availabilityLabel: '', profileImageUrl: '' },
      socialLinks: [],
    }
  }

  const socialLinks = (() => {
    const mapped = (profileDoc.socialLinks ?? []).map(mapSocialLink).filter(Boolean) as SocialLink[]
    const seen = new Set<string>()
    return mapped.filter((link) => {
      if (seen.has(link.name)) return false
      seen.add(link.name)
      return true
    })
  })()

  return {
    profile: {
      name: profileDoc.fullName || '',
      title: profileDoc.title || '',
      location: profileDoc.location || '',
      email: profileDoc.email || '',
    },
    hero: {
      roles: (profileDoc.heroRoles ?? []).filter(Boolean),
      availabilityLabel: profileDoc.availabilityLabel || '',
      profileImageUrl:
        buildMediaGatewayUrl(profileDoc.profileImageUrl || profileDoc.avatarUrl || '', {
          width: 320,
          quality: 85,
          sign: true,
          label: profileDoc.fullName,
        }) || '',
    },
    socialLinks,
  }
}

export const fetchHeroData = maybeCache(fetchHeroDataImpl)
