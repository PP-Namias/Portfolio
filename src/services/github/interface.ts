import type {
  GithubBaseUserInformation,
  GithubContributionStats,
  GithubRecentCommit,
  GithubRepository,
} from "./types";

export interface IGithubService {
  getContributionStats(): Promise<GithubContributionStats>;
  getBaseUserInformation(): Promise<GithubBaseUserInformation>;
  getRecentCommit(): Promise<GithubRecentCommit | null>;
  getRepository(owner: string, repo: string): Promise<GithubRepository>;
}
