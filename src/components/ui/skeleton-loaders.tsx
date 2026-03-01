import { Skeleton } from "@heroui/react";

/** Skeleton for experience cards — mimics the card layout with header + body */
export const ExperienceCardSkeleton = () => (
  <div className="border-default space-y-3 rounded-xl border p-5">
    <Skeleton className="h-5 w-3/5 rounded-lg" />
    <Skeleton className="h-4 w-2/5 rounded-lg" />
    <Skeleton className="h-4 w-1/3 rounded-lg" />
    <div className="space-y-2 pt-2">
      <Skeleton className="h-3 w-full rounded-lg" />
      <Skeleton className="h-3 w-4/5 rounded-lg" />
    </div>
    <div className="flex flex-wrap gap-1 pt-1">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-md" />
        ))}
    </div>
  </div>
);

/** Grid of experience card skeletons */
export const ExperiencesSkeleton = ({
  count = 4,
}: {
  count?: number;
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <ExperienceCardSkeleton key={i} />
      ))}
  </div>
);

/** Skeleton for project cards — image left + text right */
export const ProjectCardSkeleton = () => (
  <div className="border-default grid h-[350px] grid-cols-12 overflow-hidden rounded-xl border">
    <div className="col-span-12 sm:col-span-6">
      <Skeleton className="h-full w-full rounded-none" />
    </div>
    <div className="col-span-12 space-y-3 p-6 sm:col-span-6">
      <Skeleton className="h-5 w-3/4 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-3/5 rounded-lg" />
      </div>
      <div className="flex flex-wrap gap-1 pt-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-6 w-14 rounded-md" />
          ))}
      </div>
      <div className="mt-auto flex gap-2 pt-4">
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  </div>
);

/** Grid of project card skeletons */
export const ProjectsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-4">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
  </div>
);

/** Skeleton for certification cards — image thumbnails in a grid */
export const CertificationCardSkeleton = () => (
  <Skeleton className="h-[300px] w-full rounded-xl lg:h-[220px] xl:h-[280px]" />
);

/** Grid of certification card skeletons */
export const CertificationsSkeleton = ({
  count = 4,
}: {
  count?: number;
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <CertificationCardSkeleton key={i} />
      ))}
  </div>
);

/** Skeleton for gallery masonry — varied height cards */
export const GallerySkeleton = ({ count = 8 }: { count?: number }) => {
  const heights = [200, 280, 220, 260, 180, 300, 240, 200];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-lg"
            style={{ height: heights[i % heights.length] }}
          />
        ))}
    </div>
  );
};

/** Skeleton for recommendation cards */
export const RecommendationsSkeleton = ({
  count = 2,
}: {
  count?: number;
}) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="border-default space-y-3 rounded-xl border p-4">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-4/5 rounded-lg" />
          <Skeleton className="h-4 w-3/5 rounded-lg" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-24 rounded-lg" />
              <Skeleton className="h-3 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
  </div>
);

/** Skeleton for the technology marquee */
export const TechStackSkeleton = () => (
  <div className="flex gap-1 overflow-hidden">
    {Array(12)
      .fill(0)
      .map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-lg" />
      ))}
  </div>
);

/** Skeleton for GitHub stats metrics */
export const GithubStatsSkeleton = () => (
  <div className="grid grid-cols-2 gap-2">
    <Skeleton className="h-22 rounded-lg" />
    <Skeleton className="h-22 rounded-lg" />
  </div>
);

/** Skeleton for GitHub activity calendar */
export const GithubCalendarSkeleton = () => (
  <Skeleton className="h-44 w-full rounded-xl" />
);

/** Skeleton for membership badges */
export const MembershipsSkeleton = () => (
  <div className="flex flex-wrap gap-2">
    {Array(4)
      .fill(0)
      .map((_, i) => (
        <Skeleton key={i} className="h-8 w-28 rounded-lg" />
      ))}
  </div>
);

/** Skeleton for the ProfileCard */
export const ProfileCardSkeleton = () => (
  <div className="space-y-3 rounded-xl p-4">
    {/* Top bar */}
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-40 rounded-lg" />
      <div className="ml-auto flex gap-1">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
    </div>
    {/* Avatar */}
    <Skeleton className="aspect-square w-full rounded-xl" />
    {/* Name + title */}
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-lg" />
    </div>
    {/* Badge */}
    <Skeleton className="h-7 w-60 rounded-full" />
    {/* Time + badges */}
    <div className="flex gap-2">
      <Skeleton className="h-5 w-24 rounded-lg" />
      <Skeleton className="h-5 w-16 rounded-lg" />
    </div>
    {/* Bio */}
    <div className="space-y-2">
      <Skeleton className="h-3 w-full rounded-lg" />
      <Skeleton className="h-3 w-4/5 rounded-lg" />
      <Skeleton className="h-3 w-3/5 rounded-lg" />
    </div>
    {/* Social icons */}
    <div className="flex gap-2">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="size-8 rounded-lg" />
        ))}
    </div>
  </div>
);
