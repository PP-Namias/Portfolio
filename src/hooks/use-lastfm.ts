/* eslint-disable react-hooks/rules-of-hooks */
import { LastFmService } from "@/services/lastfm/service";
import { useQuery } from "@tanstack/react-query";

export const useLastFm = () => {
  const lastFmService = new LastFmService();

  const queryRecentTrack = () =>
    useQuery({
      queryFn: lastFmService.getRecentTrack,
      queryKey: ["last_fm_recent_track"],
      refetchInterval: 60 * 1000 * 1.5,
    });

  return {
    queryRecentTrack,
  };
};
