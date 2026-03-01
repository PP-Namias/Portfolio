import { GalleryCard } from "@/components/features/gallery/gallery-card";
import { GalleryModal } from "@/components/features/gallery/gallery-modal";
import { ErrorTile } from "@/components/ui/error-tile";
import { GallerySkeleton } from "@/components/ui/skeleton-loaders";
import { useCore } from "@/hooks/use-core";
import { usePageSEO } from "@/hooks/use-seo";
import { sectionMetadata } from "@/utilities/seo";
import type { GalleryItem } from "@/services/core/types";
import { useState, useMemo, useCallback } from "react";
import Masonry from "react-masonry-css";

// Optimized images for display (converted to webp)
const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/gallery/*.{png,jpg,jpeg,JPG,JPEG,jfif,gif,webp}",
  { eager: true, import: "default", query: "?format=webp&meta&quality=1" },
);

// Original images for download (not converted)
const originalImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/gallery/*.{png,jpg,jpeg,JPG,JPEG,jfif,gif,webp}",
  { eager: true, import: "default" },
);

const optimizedVideos: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/videos/gallery/*.{mp4,webm}",
  { eager: true, import: "default" },
);

interface GalleryProps {
  limit?: number;
}

export default function Gallery({ limit }: GalleryProps) {
  const { queryGallery } = useCore();
  const { data: _rawData, isLoading, error } = queryGallery();
  const data = useMemo(
    () => {
      const items = _rawData as GalleryItem[] | undefined;
      return limit ? items?.slice(0, limit) : items;
    },
    [_rawData, limit],
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Update SEO for Gallery section
  usePageSEO(sectionMetadata.gallery);

  // Helper function to get media source
  const getMediaSource = useCallback((item: GalleryItem, useOriginal = false) => {
    if (item.mediaType === "video") {
      const videoKey = Object.keys(optimizedVideos).find((key) =>
        key.includes(item.media),
      );
      return videoKey ? optimizedVideos[videoKey] : item.media;
    } else {
      const images = useOriginal ? originalImages : optimizedImages;
      const imageKey = Object.keys(images).find((key) =>
        key.includes(item.media || item.image || ""),
      );
      return imageKey
        ? images[imageKey]
        : item.media || item.image || "";
    }
  }, []);

  // Masonry breakpoints
  const breakpointColumns = {
    default: 4,
    1920: 5,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 2,
  };

  if (isLoading)
    return <GallerySkeleton count={limit ?? 12} />;

  if (error)
    return (
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {Array(12)
          .fill(0)
          .map((_, index) => (
            <ErrorTile
              key={`GalleryCardErrorComponent-${index}`}
              className="h-64 rounded-lg"
            />
          ))}
      </Masonry>
    );

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {data?.map((item: GalleryItem, index: number) => {
            const mediaSource = getMediaSource(item, false);

            return (
              <GalleryCard
                key={`GalleryCard-${item.title}-${index}`}
                title={item.title}
                mediaType={item.mediaType || "image"}
                media={mediaSource}
                thumbnail={item.thumbnail}
                tags={item.tags || []}
                createdAt={item.createdAt || item.issuedAt}
                onClick={() => setSelectedIndex(index)}
              />
            );
          })}
      </Masonry>

      {/* Gallery Modal */}
      {selectedIndex !== null && data && data[selectedIndex] && (() => {
        const selectedItem = data[selectedIndex];
        const displayUrl = getMediaSource(selectedItem, false);
        const downloadUrl = getMediaSource(selectedItem, true);
        
        return (
          <GalleryModal
            isOpen={selectedIndex !== null}
            onClose={() => {
              setSelectedIndex(null);
            }}
            item={selectedItem}
            mediaUrl={displayUrl}
            downloadUrl={downloadUrl}
            currentIndex={selectedIndex}
            totalItems={data.length}
            onNavigate={(direction) => {
              if (direction === "prev") {
                setSelectedIndex((prev) => {
                  const newIndex = prev === null || prev === 0 ? data.length - 1 : prev - 1;
                  return newIndex;
                });
              } else {
                setSelectedIndex((prev) => {
                  const newIndex = prev === null || prev === data.length - 1 ? 0 : prev + 1;
                  return newIndex;
                });
              }
            }}
          />
        );
      })()}
    </>
  );
}
