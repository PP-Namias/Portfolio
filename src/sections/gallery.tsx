import { GalleryCard } from "@/components/features/gallery/gallery-card";
import { GalleryModal } from "@/components/features/gallery/gallery-modal";
import { GalleryFilters } from "@/components/features/gallery/gallery-filters";
import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";
import type { GalleryItem } from "@/types/gallery";
import { useState, useMemo } from "react";
import Masonry from "react-masonry-css";
import "./gallery.css";

const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/certifications/*.{jpg,png,gif,webp}",
  { eager: true, import: "default", query: "?format=webp&meta&quality=1" },
);

const optimizedVideos: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/videos/gallery/*.{mp4,webm}",
  { eager: true, import: "default" },
);

type MediaFilterType = "all" | "image" | "video" | "gif";

export default function Gallery() {
  const { queryCertifications } = useCore();
  const { data: _data, isLoading, error } = queryCertifications();
  const data = useMemo(() => _data as GalleryItem[] | undefined, [_data]);

  const [activeFilter, setActiveFilter] = useState<MediaFilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Filter and search logic
  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

    // Apply media type filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (item: GalleryItem) => item.mediaType === activeFilter,
      );
    }

    // Apply search filter - now includes issuer
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item: GalleryItem) =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.issuer?.toLowerCase().includes(query) ||
          item.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [data, activeFilter, searchQuery]);

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
      <>
        <GalleryFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={0}
          filteredCount={0}
        />
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
      </>
    );

  if (error)
    return (
      <>
        <GalleryFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={0}
          filteredCount={0}
        />
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
      </>
    );

  return (
    <>
      <GalleryFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={data?.length || 0}
        filteredCount={filteredData.length}
      />

      {filteredData.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-default-200">
          <div className="text-center">
            <p className="text-lg font-semibold text-default-500">
              No items found
            </p>
            <p className="text-sm text-default-400">
              Try adjusting your filters or search query
            </p>
          </div>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
        >
          {filteredData.map((item: GalleryItem, index: number) => {
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
      )}

      {/* Gallery Modal */}
      {selectedIndex !== null && filteredData[selectedIndex] && (
        <GalleryModal
          isOpen={selectedIndex !== null}
          onClose={() => {
            setSelectedIndex(null);
          }}
          item={filteredData[selectedIndex]}
          currentIndex={selectedIndex}
          totalItems={filteredData.length}
          onNavigate={(direction) => {
            if (direction === "prev") {
              setSelectedIndex((prev) => {
                const newIndex = prev === null || prev === 0 ? filteredData.length - 1 : prev - 1;
                return newIndex;
              });
            } else {
              setSelectedIndex((prev) => {
                const newIndex = prev === null || prev === filteredData.length - 1 ? 0 : prev + 1;
                return newIndex;
              });
            }
          }}
        />
      )}
    </>
  );
}
