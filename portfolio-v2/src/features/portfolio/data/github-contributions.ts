import "server-only"

import { unstable_cache } from "next/cache"

import { GITHUB_USERNAME } from "@/config/site"
import { httpsFetch } from "@/lib/https-fetch"
import type { Activity } from "@/registry/components/contribution-graph"

type GitHubContributionsResponse = {
  contributions: Activity[]
}

export const getGitHubContributions = unstable_cache(
  async () => {
    const url = `${process.env.GITHUB_CONTRIBUTIONS_API_URL || "https://github-contributions-api.jogruber.de"}/v4/${GITHUB_USERNAME}?y=last`
    const data = await httpsFetch<GitHubContributionsResponse>(url)
    return data.contributions
  },
  ["github-contributions"],
  { revalidate: 86400 }
)
