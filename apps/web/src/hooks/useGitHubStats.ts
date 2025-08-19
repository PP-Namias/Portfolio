import { useQuery } from "@tanstack/react-query";

interface GitHubUser {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  bio: string;
}

export function useGitHubStats() {
  return useQuery<GitHubUser>({
    queryKey: ["github-user-Ervhyne"],
    queryFn: async () => {
      const response = await fetch("https://api.github.com/users/Ervhyne");
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub user data");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
