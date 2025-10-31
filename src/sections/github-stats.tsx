import { GithubContributionsMetricTile } from "@/components/features/github/github-contributions-metric-tile";
import { GithubRepositoriesMetricTile } from "@/components/features/github/github-repositories-metric-tile";
import { Github } from "lucide-react";

export const GithubStats = () => {
  return (
    <div className="bg-background grid grid-cols-12 rounded-xl p-[3px]">
      <div className="col-span-2 hidden items-center justify-center sm:col-span-2 sm:flex lg:hidden 2xl:flex">
        <Github className="size-8" />
      </div>
      <div className="col-span-full sm:col-span-10 lg:col-span-full 2xl:col-span-10">
        <div className="grid h-full grid-cols-2 gap-1">
          <GithubRepositoriesMetricTile />
          <GithubContributionsMetricTile />
        </div>
      </div>
    </div>
  );
};
