import type {
  GithubBaseUserInformation,
  GithubContributionStats,
  GithubRecentCommit,
} from "./types";

export interface IGithubService {
  getContributionStats(): Promise<GithubContributionStats>;
  getBaseUserInformation(): Promise<GithubBaseUserInformation>;
  getRecentCommit(): Promise<GithubRecentCommit | null>;
}
