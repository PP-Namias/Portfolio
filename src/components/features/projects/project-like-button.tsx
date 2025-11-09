import { useLikes } from "@/hooks/use-likes";
import { Button } from "@heroui/react";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type ProjectLikeButtonProps = {
  projectId: string;
  className?: string;
};

export const ProjectLikeButton = ({
  projectId,
  className = "",
}: ProjectLikeButtonProps) => {
  const { getLikes, toggleLike } = useLikes();
  const [likes, setLikes] = useState(() => getLikes(projectId));
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Update likes when component mounts or projectId changes
    setLikes(getLikes(projectId));
  }, [projectId, getLikes]);

  const handleLike = () => {
    const newLikes = toggleLike(projectId);
    setLikes(newLikes);

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <Button
      size="sm"
      variant="flat"
      color={likes.likedByUser ? "danger" : "default"}
      onPress={handleLike}
      className={`flex items-center gap-1 ${className}`}
      startContent={
        <motion.div
          animate={
            isAnimating
              ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, -10, 10, -10, 0],
                }
              : {}
          }
          transition={{ duration: 0.6 }}
        >
          <Heart
            className={`h-4 w-4 ${likes.likedByUser ? "fill-current" : ""}`}
          />
        </motion.div>
      }
    >
      <span className="font-semibold">{likes.count}</span>
    </Button>
  );
};
