import useGithub from "@/hooks/use-github";
import { Star, GitFork, Eye } from "lucide-react";
import { Skeleton } from "@heroui/react";

type ProjectGithubMetricsProps = {
  githubRepo: string; // Format: "owner/repo"
  className?: string;
};

export const ProjectGithubMetrics = ({
  githubRepo,
  className = "",
}: ProjectGithubMetricsProps) => {
  const [owner, repo] = githubRepo.split("/");
  const { queryRepository } = useGithub();
  const { data, isLoading, error } = queryRepository(owner, repo);

  if (isLoading) {
    return (
      <div className={`flex gap-3 text-xs ${className}`}>
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  return (
    <div className={`flex gap-3 text-xs ${className}`}>
      <div className="flex items-center gap-1 text-foreground/60">
        <Star className="h-3.5 w-3.5" />
        <span className="font-semibold">{data.stargazers_count}</span>
      </div>
      <div className="flex items-center gap-1 text-foreground/60">
        <GitFork className="h-3.5 w-3.5" />
        <span className="font-semibold">{data.forks_count}</span>
      </div>
      <div className="flex items-center gap-1 text-foreground/60">
        <Eye className="h-3.5 w-3.5" />
        <span className="font-semibold">{data.watchers_count}</span>
      </div>
    </div>
  );
};
