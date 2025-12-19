import useGithub from "@/hooks/use-github";
import { Button, Skeleton } from "@heroui/react";
import { Star, GitFork, Eye } from "lucide-react";

type ProjectStarsButtonProps = {
  repositoryURL: string | null;
  className?: string;
};

/**
 * Extracts owner and repo from a GitHub repository URL
 * @param url - The GitHub repository URL (e.g., "https://github.com/owner/repo")
 * @returns {owner, repo} or null if not a valid GitHub URL
 */
const extractGithubRepo = (url: string | null): { owner: string; repo: string } | null => {
  if (!url) return null;
  
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
};

export const ProjectStarsButton = ({
  repositoryURL,
  className = "",
}: ProjectStarsButtonProps) => {
  const repoInfo = extractGithubRepo(repositoryURL);
  const { queryRepository } = useGithub();
  
  // Only call the hook if we have valid repo info
  const { data, isLoading, error } = queryRepository(
    repoInfo?.owner || "",
    repoInfo?.repo || ""
  );

  // Don't render anything if no valid GitHub URL
  if (!repoInfo) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`flex gap-1 ${className}`}>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      <Button
        size="sm"
        variant="flat"
        color="warning"
        className="flex items-center gap-1"
        startContent={<Star className="h-4 w-4 fill-current" />}
        isDisabled
      >
        <span className="font-semibold">{data.stargazers_count}</span>
      </Button>
      <Button
        size="sm"
        variant="flat"
        color="default"
        className="flex items-center gap-1"
        startContent={<GitFork className="h-4 w-4" />}
        isDisabled
      >
        <span className="font-semibold">{data.forks_count}</span>
      </Button>
      <Button
        size="sm"
        variant="flat"
        color="default"
        className="flex items-center gap-1"
        startContent={<Eye className="h-4 w-4" />}
        isDisabled
      >
        <span className="font-semibold">{data.watchers_count}</span>
      </Button>
    </div>
  );
};
