import { useCore } from "@/hooks/use-core";
import { LoadingTile } from "@/components/ui/loading-tile";
import { ErrorTile } from "@/components/ui/error-tile";
import { MembershipBadge } from "@/components/features/memberships/membership-badge";

export const Memberships = () => {
  const { queryMemberships } = useCore();
  const { data: memberships, isLoading, error } = queryMemberships();

  if (isLoading) return <LoadingTile className="h-15" />;
  if (error) return <ErrorTile className="h-15" />;
  if (!memberships?.length) return null;

  return (
    <div className="bg-background space-y-2 rounded-xl p-3">
      <p className="text-foreground/50 text-xs font-semibold uppercase tracking-wider">
        A member of
      </p>
      <div className="flex flex-wrap gap-2">
        {memberships.map((membership, index) => (
          <MembershipBadge
            key={membership.name}
            membership={membership}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
