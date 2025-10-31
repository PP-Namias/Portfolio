import axios from "axios";
import type { IGithubService } from "./interface";
import type {
  GithubBaseUserInformation,
  GithubContributionStats,
  GithubEvent,
  GithubRecentCommit,
} from "./types";

export class GithubService implements IGithubService {
  private githubUsername: string;

  constructor() {
    this.githubUsername = "PP-Namias";
    this.getBaseUserInformation = this.getBaseUserInformation.bind(this);
    this.getContributionStats = this.getContributionStats.bind(this);
    this.getRecentCommit = this.getRecentCommit.bind(this);
  }

  async getContributionStats(): ReturnType<
    IGithubService["getContributionStats"]
  > {
    const url = `https://github-contributions-api.jogruber.de/v4/${this.githubUsername}`;
    return await axios
      .get<GithubContributionStats>(url)
      .then((response) => response.data)
      .then((contributionStats) => {
        contributionStats.totalContribution = Object.values(
          contributionStats.total,
        ).reduce((total: number, value: number) => total + value, 0);

        return contributionStats;
      });
  }

  async getRecentCommit(): ReturnType<IGithubService["getRecentCommit"]> {
    const url = `https://api.github.com/users/${this.githubUsername}/events`;
    return await axios
      .get<GithubEvent>(url)
      .then((response) => response.data)
      .then((events) => {
        const pushEvents = events.filter((event) => event.type === "PushEvent");
        const recentPushEvent = pushEvents?.[0];
        if (!recentPushEvent) {
          return null;
        }
        return recentPushEvent;
      })
      .then((recentPushEvent) => {
        if (!recentPushEvent) {
          return null;
        }
        const commits = recentPushEvent.payload.commits;
        const data: GithubRecentCommit = {
          repository_name: recentPushEvent.repo.name,
          commit_message: commits?.[commits.length - 1]?.message,
          created_at: recentPushEvent.created_at,
        };
        return data;
      });
  }

  async getBaseUserInformation(): ReturnType<
    IGithubService["getBaseUserInformation"]
  > {
    const url = `https://api.github.com/users/${this.githubUsername}`;
    return await axios
      .get<GithubBaseUserInformation>(url)
      .then((response) => response.data);
  }
}
