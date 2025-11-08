/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from "@tanstack/react-query";
import { GithubService } from "@/services/github";

export default function useGithub() {
  const githubService = new GithubService();

  const queryContributionStats = () =>
    useQuery({
      queryFn: githubService.getContributionStats,
      queryKey: ["github_contribution_stats"],
    });

  const queryBaseUserInformation = () =>
    useQuery({
      queryFn: githubService.getBaseUserInformation,
      queryKey: ["github_base_user_information"],
    });

  const queryRecentCommit = () =>
    useQuery({
      queryFn: githubService.getRecentCommit,
      queryKey: ["github_recent_commit"],
      staleTime: 60 * 1000 * 1.5,
    });

  const queryRepository = (owner: string, repo: string) =>
    useQuery({
      queryFn: () => githubService.getRepository(owner, repo),
      queryKey: ["github_repository", owner, repo],
      staleTime: 60 * 1000 * 60, // 1 hour
      enabled: !!owner && !!repo,
    });

  return {
    queryContributionStats,
    queryBaseUserInformation,
    queryRecentCommit,
    queryRepository,
  };
}
