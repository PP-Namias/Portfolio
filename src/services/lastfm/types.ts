export type LastFmRecentlyListenedTracks = {
  recenttracks: {
    track: {
      mbid: string;
      name: string;
      url: string;
      streamable: string;
      artist: {
        mbid: string;
        "#text": string;
      };
      image: {
        size: string;
        "#text": string;
      }[];
      date: {
        uts: string;
        "#text": string;
      };
      album: {
        mbid: string;
        "#text": string;
      };
    }[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
};

export type LastFmRecentlyListenedTrack = {
  image_url: string;
  artist: string;
  title: string;
};
