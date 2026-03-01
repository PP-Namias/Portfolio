import { GithubContributionsMetricTile } from "@/components/features/github/github-contributions-metric-tile";
import { GithubRepositoriesMetricTile } from "@/components/features/github/github-repositories-metric-tile";

export const GithubStats = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <GithubRepositoriesMetricTile />
      <GithubContributionsMetricTile />
    </div>
  );
};
