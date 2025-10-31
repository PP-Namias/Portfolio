import { ActivityTile } from "@/components/ui/activity-tile";
import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import useGithub from "@/hooks/use-github";
import { TimeUtilities } from "@/utilities/time";
import { GithubIcon as Github } from "lucide-react";

export const GithubRecentCommitTile = () => {
  const { queryRecentCommit } = useGithub();
  const { data, isLoading, error } = queryRecentCommit();

  if (isLoading)
    return (
      <div className="bg-background h-full rounded-xl p-[3px]">
        <LoadingTile />
      </div>
    );

  if (error || !data) {
    console.log(error);

    return (
      <div className="bg-background h-full rounded-xl p-[3px]">
        <ErrorTile />
      </div>
    );
  }

  return (
    <>
      <ActivityTile className="border-default bg-primary/5 border">
        <ActivityTile.Body>
          <ActivityTile.Icon className="border-default bg-primary/5 text-primary">
            <Github className="size-10 lg:size-6 xl:size-8" />
          </ActivityTile.Icon>
          <ActivityTile.Content>
            <ActivityTile.ContentHeader>
              {"Github ･ "}
              {TimeUtilities.formatDate({ date: data.created_at })}
            </ActivityTile.ContentHeader>
            <ActivityTile.ContentBody>
              {data?.commit_message}
            </ActivityTile.ContentBody>
            <ActivityTile.ContentFooter>
              {data?.repository_name}
            </ActivityTile.ContentFooter>
          </ActivityTile.Content>
        </ActivityTile.Body>
      </ActivityTile>
    </>
  );
};
