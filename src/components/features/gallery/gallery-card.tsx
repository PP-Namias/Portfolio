import { Eye, Play } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type GalleryCardProps = {
  title: string;
  mediaType: "image" | "video" | "gif";
  media: string;
  thumbnail?: string;
  tags: string[];
  createdAt?: string;
  onClick: () => void;
};

export const GalleryCard = (props: GalleryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMediaIcon = () => {
    switch (props.mediaType) {
      case "video":
        return <Play size={32} className="text-white" />;
      case "gif":
        return <Eye size={32} className="text-white" />;
      default:
        return <Eye size={32} className="text-white" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={props.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl"
    >
      {/* Media Display */}
      <div className="relative overflow-hidden bg-default-100">
        <img
          src={props.thumbnail || props.media}
          alt={props.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Media Type Badge */}
        {props.mediaType !== "image" && (
          <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {props.mediaType.toUpperCase()}
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      >
        <div className="mb-3">{getMediaIcon()}</div>
        <h3 className="mb-2 text-center text-lg font-bold text-white">
          {props.title}
        </h3>
        {props.createdAt && (
          <p className="text-xs text-white/80">{formatDate(props.createdAt)}</p>
        )}
      </motion.div>
    </motion.div>
  );
};
