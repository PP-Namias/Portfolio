import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 */
export const SOCIAL = {
  x: {
    title: "X",
    handle: "@PP_Namias",
    href: "https://x.com/PP_Namias",
    sameAs: true,
  },
  github: {
    title: "GitHub",
    handle: "PP-Namias",
    href: "https://github.com/PP-Namias",
    sameAs: true,
  },
  linkedin: {
    title: "LinkedIn",
    handle: "pp-namias",
    href: "https://linkedin.com/in/pp-namias/",
    sameAs: true,
  },
  discord: {
    title: "Discord",
    handle: "pp-namias",
    href: "https://discord.com/users/683914336376455200",
  },
  youtube: {
    title: "YouTube",
    handle: "@pp_namias",
    href: "https://www.youtube.com/@pp_namias",
    sameAs: true,
  },
  instagram: {
    title: "Instagram",
    handle: "@pp_namias",
    href: "https://www.instagram.com/pp_namias/",
    sameAs: true,
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
