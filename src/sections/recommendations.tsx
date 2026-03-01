import { useCore } from "@/hooks/use-core";
import { LoadingTile } from "@/components/ui/loading-tile";
import { ErrorTile } from "@/components/ui/error-tile";
import { RecommendationCard } from "@/components/features/recommendations/recommendation-card";

export const Recommendations = () => {
  const { queryRecommendations } = useCore();
  const { data: recommendations, isLoading, error } = queryRecommendations();

  if (isLoading) return <LoadingTile className="h-[280px]" />;
  if (error) return <ErrorTile className="h-[280px]" />;

  return (
    <div className="space-y-3">
      <h2 className="text-foreground text-lg font-bold">Recommendations</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {recommendations?.map((rec, index) => (
          <RecommendationCard
            key={`${rec.name}-${index}`}
            recommendation={rec}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
