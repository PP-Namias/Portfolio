import { GalleryCard } from "@/components/features/gallery/gallery-card";
import { GalleryModal } from "@/components/features/gallery/gallery-modal";
import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";
import type { GalleryItem } from "@/types/gallery";
import { useState, useMemo } from "react";
import Masonry from "react-masonry-css";

const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/certifications/*.{jpg,png,gif,webp}",
  { eager: true, import: "default", query: "?format=webp&meta&quality=1" },
);

const optimizedVideos: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/videos/gallery/*.{mp4,webm}",
  { eager: true, import: "default" },
);

export default function Gallery() {
  const { queryCertifications } = useCore();
  const { data: _data, isLoading, error } = queryCertifications();
  const data = useMemo(() => _data as GalleryItem[] | undefined, [_data]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
    return (
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {Array(12)
          .fill(0)
          .map((_, index) => (
            <LoadingTile
              key={`GalleryCardLoadingComponent-${index}`}
              className="h-[250px] rounded-lg"
            />
          ))}
      </Masonry>
    );

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
              className="h-[250px] rounded-lg"
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
      {selectedIndex !== null && data && data[selectedIndex] && (
        <GalleryModal
          isOpen={selectedIndex !== null}
          onClose={() => {
            setSelectedIndex(null);
          }}
          item={data[selectedIndex]}
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
      )}
    </>
  );
}
