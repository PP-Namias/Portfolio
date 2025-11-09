import { LikeService } from "@/services/likes";
import { useState, useCallback, useMemo } from "react";

export const useLikes = () => {
  const likeService = useMemo(() => new LikeService(), []);
  const [, forceUpdate] = useState({});

  const getLikes = useCallback(
    (projectId: string) => {
      return likeService.getLikes(projectId);
    },
    [likeService],
  );

  const toggleLike = useCallback(
    (projectId: string) => {
      const result = likeService.toggleLike(projectId);
      // Force re-render to update UI
      forceUpdate({});
      return result;
    },
    [likeService],
  );

  const getAllLikes = useCallback(() => {
    return likeService.getAllLikes();
  }, [likeService]);

  return {
    getLikes,
    toggleLike,
    getAllLikes,
  };
};
