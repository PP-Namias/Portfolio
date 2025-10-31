import { MetricCard } from "@/components/ui/metric-card";
import useGithub from "@/hooks/use-github";
import { GithubErrorMetricTile } from "./github-error-metric-tile";
import { GithubLoadingMetricTile } from "./github-loading-metric-tile";

export const GithubContributionsMetricTile = () => {
  const { queryContributionStats } = useGithub();
  const { data, isLoading, error } = queryContributionStats();

  if (isLoading) return <GithubLoadingMetricTile />;
  if (error) return <GithubErrorMetricTile />;

  return (
    <MetricCard>
      <MetricCard.Header>
        <MetricCard.Label>Contributions</MetricCard.Label>
      </MetricCard.Header>
      <MetricCard.Value>
        {data?.totalContribution?.toLocaleString()}
      </MetricCard.Value>
    </MetricCard>
  );
};
