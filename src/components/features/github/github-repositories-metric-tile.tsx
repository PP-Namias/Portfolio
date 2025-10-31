import { MetricCard } from "@/components/ui/metric-card";
import useGithub from "@/hooks/use-github";
import { GithubErrorMetricTile } from "./github-error-metric-tile";
import { GithubLoadingMetricTile } from "./github-loading-metric-tile";

export const GithubRepositoriesMetricTile = () => {
  const { queryBaseUserInformation } = useGithub();
  const { data, isLoading, error } = queryBaseUserInformation();

  if (isLoading) return <GithubLoadingMetricTile />;
  if (error) return <GithubErrorMetricTile />;

  return (
    <MetricCard>
      <MetricCard.Header>
        <MetricCard.Label>Repositories</MetricCard.Label>
      </MetricCard.Header>
      <MetricCard.Value>
        {data?.public_repos?.toLocaleString()}
      </MetricCard.Value>
    </MetricCard>
  );
};
