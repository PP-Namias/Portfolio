import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@heroui/react";
import { Download, Calendar, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useEffect, useRef } from "react";
import type { GalleryItem } from "../../../types/gallery";

type GalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryItem;
  currentIndex: number;
  totalItems: number;
  onNavigate: (direction: "prev" | "next") => void;
};

export const GalleryModal = ({
  isOpen,
  onClose,
  item,
  currentIndex,
  totalItems,
  onNavigate,
}: GalleryModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get optimized media source
  const optimizedImages: Record<string, string> = import.meta.glob(
    "../../../assets/portfolio-resources/assets/images/certifications/*.{jpg,png,gif,webp}",
    { eager: true, import: "default", query: "?format=webp&meta&quality=1" },
  );

  const optimizedVideos: Record<string, string> = import.meta.glob(
    "../../../assets/portfolio-resources/assets/videos/gallery/*.{mp4,webm}",
    { eager: true, import: "default" },
  );

  // Determine media source
  let mediaSource = "";
  if (item.mediaType === "video") {
    const videoKey = Object.keys(optimizedVideos).find((key) =>
      key.includes(item.media),
    );
    mediaSource = videoKey ? optimizedVideos[videoKey] : item.media;
  } else {
    const imageKey = Object.keys(optimizedImages).find((key) =>
      key.includes(item.media || item.image || ""),
    );
    mediaSource = imageKey
      ? optimizedImages[imageKey]
      : item.media || item.image || "";
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        onNavigate("prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        onNavigate("next");
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [isOpen, onNavigate, onClose]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mediaSource;
    link.download = item.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      size="5xl"
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        base: "bg-background",
        backdrop: "bg-black/80 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  {item.issuer && (
                    <div className="mt-1 flex items-center gap-2 text-sm text-default-500">
                      <Award size={16} />
                      <span>{item.issuer}</span>
                    </div>
                  )}
                </div>
                {totalItems > 1 && (
                  <span className="text-sm text-default-500">
                    {currentIndex + 1} / {totalItems}
                  </span>
                )}
              </div>
            </ModalHeader>
            <ModalBody className="relative p-0">
              {/* Navigation Buttons - HIGH CONTRAST for visibility on all backgrounds */}
              {totalItems > 1 && (
                <>
                  {/* LEFT ARROW BUTTON - Dark with bright accent */}
                  <Button
                    isIconOnly
                    size="lg"
                    className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-gradient-to-br from-gray-900 to-black border-2 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] backdrop-blur-md transition-all hover:border-blue-300 hover:text-blue-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:scale-125 active:scale-110"
                    onPress={() => onNavigate("prev")}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={32} strokeWidth={3} />
                  </Button>
                  
                  {/* RIGHT ARROW BUTTON - Dark with bright accent */}
                  <Button
                    isIconOnly
                    size="lg"
                    className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-gradient-to-br from-gray-900 to-black border-2 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] backdrop-blur-md transition-all hover:border-blue-300 hover:text-blue-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:scale-125 active:scale-110"
                    onPress={() => onNavigate("next")}
                    aria-label="Next image"
                  >
                    <ChevronRight size={32} strokeWidth={3} />
                  </Button>
                  
                  {/* Keyboard Hint Overlay - High contrast */}
                  <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-gradient-to-r from-gray-900 to-black border border-blue-400 px-4 py-2 text-xs text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)] backdrop-blur-md">
                    Use ← → arrow keys to navigate
                  </div>
                </>
              )}

              <div className="space-y-4 p-6">
                {/* Media Display */}
                <div className="overflow-hidden rounded-xl">
                  {item.mediaType === "video" ? (
                    <video
                      ref={videoRef}
                      src={mediaSource}
                      controls
                      className="h-auto w-full"
                      autoPlay
                    />
                  ) : (
                    <Image
                      src={mediaSource}
                      alt={item.title}
                      className="h-auto w-full object-contain"
                      classNames={{
                        wrapper: "w-full",
                      }}
                    />
                  )}
                </div>

                {/* Description */}
                {item.description && (
                  <div className="rounded-lg bg-default-100 p-4">
                    <p className="text-sm text-default-700">{item.description}</p>
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-default-500">
                  {(item.createdAt || item.issuedAt) && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(item.createdAt || item.issuedAt)}</span>
                    </div>
                  )}
                  {item.dimensions && (
                    <span>
                      {item.dimensions.width} × {item.dimensions.height} •{" "}
                      {item.dimensions.aspectRatio}
                    </span>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="flat"
                onPress={handleDownload}
                startContent={<Download size={16} />}
              >
                Download
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
