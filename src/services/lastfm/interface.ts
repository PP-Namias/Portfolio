import type { LastFmRecentlyListenedTrack } from "./types";

export interface ILastFmService {
  getRecentTrack(): Promise<LastFmRecentlyListenedTrack>;
}
