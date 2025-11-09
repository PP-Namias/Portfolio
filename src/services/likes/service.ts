import type { ILikeService, ProjectLikes } from "./interface";

const STORAGE_KEY = "portfolio_project_likes";

export class LikeService implements ILikeService {
  constructor() {
    this.getLikes = this.getLikes.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
    this.getAllLikes = this.getAllLikes.bind(this);
  }

  private getStoredLikes(): ProjectLikes {
    if (typeof window === "undefined") return {};

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error reading likes from localStorage:", error);
      return {};
    }
  }

  private saveLikes(likes: ProjectLikes): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
    } catch (error) {
      console.error("Error saving likes to localStorage:", error);
    }
  }

  getLikes(projectId: string): ReturnType<ILikeService["getLikes"]> {
    const allLikes = this.getStoredLikes();
    const projectLikes = allLikes[projectId];

    if (!projectLikes) {
      return { count: 0, likedByUser: false };
    }

    return {
      count: projectLikes.count,
      likedByUser: projectLikes.likedByUser,
    };
  }

  toggleLike(projectId: string): ReturnType<ILikeService["toggleLike"]> {
    const allLikes = this.getStoredLikes();
    const currentLikes = allLikes[projectId] || {
      count: 0,
      likedByUser: false,
      lastUpdated: new Date().toISOString(),
    };

    // Toggle the like
    const newLikedByUser = !currentLikes.likedByUser;
    const newCount = newLikedByUser
      ? currentLikes.count + 1
      : Math.max(0, currentLikes.count - 1);

    allLikes[projectId] = {
      count: newCount,
      likedByUser: newLikedByUser,
      lastUpdated: new Date().toISOString(),
    };

    this.saveLikes(allLikes);

    return {
      count: newCount,
      likedByUser: newLikedByUser,
    };
  }

  getAllLikes(): ReturnType<ILikeService["getAllLikes"]> {
    return this.getStoredLikes();
  }
}
