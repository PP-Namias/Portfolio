import { unstable_cache } from "next/cache"

import { httpsFetch } from "@/lib/https-fetch"
import type { Activity } from "@/registry/components/contribution-graph"

type GitHubContributionsResponse = {
  contributions: Activity[]
}

export const getCachedContributions = unstable_cache(
  async (username: string) => {
    const url = `${process.env.GITHUB_CONTRIBUTIONS_API_URL || "https://github-contributions-api.jogruber.de"}/v4/${username}?y=last`
    const data = await httpsFetch<GitHubContributionsResponse>(url)
    return data.contributions
  },
  ["github-contributions"],
  { revalidate: 86400 }
)
