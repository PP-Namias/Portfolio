import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";
import { Building2 } from "lucide-react";
import { useMemo } from "react";

export const RecentExperienceTile = () => {
  const { queryExperiences } = useCore();
  const { data, isLoading, error } = queryExperiences();

  const recentExperience = useMemo(() => {
    if (!data) return;
    return data[0];
  }, [data]);

  if (isLoading)
    return (
      <div className="bg-background h-[5.2rem] rounded-xl p-[3px]">
        <LoadingTile spinnerSize="sm" />
      </div>
    );

  if (error)
    return (
      <div className="bg-background h-[5.2rem] rounded-xl p-[3px]">
        <ErrorTile />
      </div>
    );

  return (
    <div className="bg-background grid grid-cols-12 rounded-xl p-[3px]">
      <div className="col-span-2 flex items-center justify-center lg:hidden xl:flex">
        <Building2 className="size-8" />
      </div>
      <div className="col-span-10 lg:col-span-full xl:col-span-10">
        <div className="bg-custom-secondary rounded-lg border border-transparent p-4 px-6 dark:border-none">
          <p className="text-primary text-sm font-bold sm:text-lg lg:text-sm xl:text-base">
            {recentExperience?.position}
          </p>
          <p className="text-xs sm:text-base lg:text-xs xl:text-sm">
            {recentExperience?.company}
          </p>
        </div>
      </div>
    </div>
  );
};
