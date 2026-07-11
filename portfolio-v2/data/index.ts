import type { User } from "@/features/portfolio/types/user"
import type { Project } from "@/features/portfolio/types/projects"
import type { Experience } from "@/features/portfolio/types/experiences"
import type { Certification } from "@/features/portfolio/types/certifications"
import type { Education } from "@/features/portfolio/types/education"
import type { SocialProfile } from "@/features/portfolio/types/social-links"
import type { TechStack } from "@/features/portfolio/types/tech-stack"
import type { Testimonial } from "@/features/portfolio/types/testimonials"
import type { Award } from "@/features/portfolio/types/awards"
import type { Bookmark } from "@/features/portfolio/types/bookmarks"

import user from "./user.json"
import projects from "./projects.json"
import experiences from "./experiences.json"
import certifications from "./certifications.json"
import education from "./education.json"
import socialLinks from "./social-links.json"
import techStack from "./tech-stack.json"
import testimonials from "./testimonials.json"
import awards from "./awards.json"
import bookmarks from "./bookmarks.json"
import siteConfig from "./site-config.json"
import components from "./components.json"
import blog from "./blog.json"
import insights from "./insights.json"
import footer from "./footer.json"

export const DATA_USER = user as User
export const DATA_PROJECTS = projects as Project[]
export const DATA_EXPERIENCES = experiences as Experience[]
export const DATA_CERTIFICATIONS = certifications as Certification[]
export const DATA_EDUCATION = education as Education[]
export const DATA_SOCIAL = socialLinks as Record<string, SocialProfile>
export const DATA_TECH_STACK = techStack as TechStack[]
export const DATA_TESTIMONIALS_LONG = testimonials.long as Testimonial[]
export const DATA_TESTIMONIALS_SHORT = testimonials.short as Testimonial[]
export const DATA_AWARDS = awards as Award[]
export const DATA_BOOKMARKS = bookmarks as Bookmark[]
export const DATA_SITE = siteConfig as {
  name: string
  url: string
  ogImage: string
  description: string
  keywords: string[]
  license: { name: string; url: string }
  metaThemeColors: { light: string; dark: string }
  mainNav: { title: string; href: string }[]
  xHandle: string
  githubUsername: string
  sourceCodeRepo: string
  sourceCodeUrl: string
  sponsorshipUrl: string
  utmParams: { utm_source: string }
}
export const DATA_COMPONENTS = components as {
  id: string
  title: string
  description: string
  category: string
  registryDependencies: string[]
  files: string[]
}[]
export const DATA_BLOG = blog as {
  id: string
  title: string
  slug: string
  publishedAt: string
  description: string
  tags: string[]
  readingTime: string
  isFeatured?: boolean
}[]
export const DATA_INSIGHTS = insights as {
  period: string
  uniqueVisitors: number
  sessions: number
  views: number
  sessionDuration: string
  summary: string
}
export const DATA_FOOTER = footer as {
  craftedBy: { name: string; handle: string; url: string }
  inspiredBy: { name: string; url: string }[]
  deployedOn: { name: string; url: string }
  analytics: { name: string; url: string }[]
  sourceCode: { name: string; url: string }
  license: { name: string; url: string }
}
