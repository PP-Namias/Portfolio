import { Button, Input } from "@heroui/react";
import { Search, Image as ImageIcon, Video, FileImage } from "lucide-react";
import { motion } from "framer-motion";

type GalleryFiltersProps = {
  activeFilter: "all" | "image" | "video" | "gif";
  onFilterChange: (filter: "all" | "image" | "video" | "gif") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
};

export const GalleryFilters = ({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
}: GalleryFiltersProps) => {
  const filters = [
    { value: "all" as const, label: "All", icon: FileImage },
    { value: "image" as const, label: "Images", icon: ImageIcon },
    { value: "video" as const, label: "Videos", icon: Video },
    { value: "gif" as const, label: "GIFs", icon: FileImage },
  ];

  return (
    <div className="sticky top-0 z-20 space-y-3 rounded-xl bg-background/95 p-3 backdrop-blur-md">
      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search gallery..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        startContent={<Search size={18} className="text-default-400" />}
        classNames={{
          input: "text-sm",
          inputWrapper:
            "bg-default-100 border border-default-200 hover:bg-default-200 transition-colors",
        }}
      />

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.value;

          return (
            <motion.div
              key={filter.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                onPress={() => onFilterChange(filter.value)}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "border border-default-200 bg-default-100 text-foreground hover:bg-default-200"
                }`}
                startContent={<Icon size={16} />}
              >
                {filter.label}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Count Display */}
      <div className="flex items-center justify-between text-xs text-default-500">
        <span>
          Showing {filteredCount} of {totalCount} items
        </span>
        {searchQuery && (
          <Button
            size="sm"
            variant="light"
            onPress={() => onSearchChange("")}
            className="h-6 text-xs"
          >
            Clear search
          </Button>
        )}
      </div>
    </div>
  );
};
