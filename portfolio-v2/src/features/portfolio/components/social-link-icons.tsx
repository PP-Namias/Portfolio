import {
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons"
import type { SocialName } from "@/features/portfolio/data/social-links"

export const SOCIAL_ICONS: Record<SocialName, React.JSX.Element> = {
  x: <XIcon />,
  github: <GitHubIcon />,
  linkedin: <LinkedInIcon />,
  discord: <DiscordIcon />,
  youtube: <YouTubeIcon />,
  instagram: <InstagramIcon />,
}
