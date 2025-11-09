export type ProjectLikes = {
  [projectId: string]: {
    count: number;
    likedByUser: boolean;
    lastUpdated: string;
  };
};

export interface ILikeService {
  getLikes(projectId: string): { count: number; likedByUser: boolean };
  toggleLike(projectId: string): { count: number; likedByUser: boolean };
  getAllLikes(): ProjectLikes;
}
