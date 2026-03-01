import { useCore } from "@/hooks/use-core";
import { RecommendationsSkeleton } from "@/components/ui/skeleton-loaders";
import { ErrorTile } from "@/components/ui/error-tile";
import { RecommendationCard } from "@/components/features/recommendations/recommendation-card";

export const Recommendations = () => {
  const { queryRecommendations } = useCore();
  const { data: recommendations, isLoading, error } = queryRecommendations();

  if (isLoading) return <RecommendationsSkeleton />;
  if (error) return <ErrorTile className="h-70" />;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {recommendations?.map((rec, index) => (
        <RecommendationCard
          key={`${rec.name}-${index}`}
          recommendation={rec}
          index={index}
        />
      ))}
    </div>
  );
};
