import { ActivityTile } from "@/components/ui/activity-tile";
import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useLastFm } from "@/hooks/use-lastfm";
import { useMemo } from "react";

export const LastFmRecentTrackTile = () => {
  const { queryRecentTrack } = useLastFm();
  const { data: _data, isLoading, error } = queryRecentTrack();

  const data = useMemo(() => _data, [_data]);

  if (isLoading)
    return (
      <div className="bg-background h-full rounded-xl p-[3px]">
        <LoadingTile />
      </div>
    );

  if (error)
    return (
      <div className="bg-background h-full rounded-xl p-[3px]">
        <ErrorTile />
      </div>
    );

  return (
    <>
      <ActivityTile
        className={`border-default relative overflow-hidden border bg-cover bg-center`}
        style={{ backgroundImage: `url(${data?.image_url})` }}
      >
        <div className="absolute h-full w-full overflow-hidden rounded-xl opacity-90 backdrop-blur-[12px]"></div>
        <ActivityTile.Body>
          <ActivityTile.Icon className="z-[10] h-full overflow-hidden border-transparent object-cover">
            <img
              src={data?.image_url}
              className="h-full w-full object-cover object-center"
              alt=""
            />
          </ActivityTile.Icon>
          <ActivityTile.Content className="text-background dark:text-foreground z-[2]">
            <ActivityTile.ContentHeader>
              {"Last.fm ･ listened to"}
            </ActivityTile.ContentHeader>
            <ActivityTile.ContentBody>{data?.title}</ActivityTile.ContentBody>
            <ActivityTile.ContentFooter>
              {data?.artist}
            </ActivityTile.ContentFooter>
          </ActivityTile.Content>
        </ActivityTile.Body>
      </ActivityTile>
    </>
  );
};
