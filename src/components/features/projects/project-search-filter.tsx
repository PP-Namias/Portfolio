import { Input, Select, SelectItem, Button, Chip } from "@heroui/react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/services/core/types";

type ProjectSearchFilterProps = {
  projects: Project[];
  onFilterChange: (filtered: Project[]) => void;
};

export const ProjectSearchFilter = ({
  projects,
  onFilterChange,
}: ProjectSearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique years and tags
  const years = Array.from(
    new Set(projects.map((p) => p.year?.toString()).filter(Boolean))
  ).sort((a, b) => Number(b) - Number(a));

  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags || []))
  ).sort();

  // Filter logic
  const filterProjects = (
    query: string,
    year: string,
    tags: Set<string>
  ) => {
    let filtered = projects;

    // Search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(lowerQuery) ||
          project.description?.toLowerCase().includes(lowerQuery) ||
          project.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Year filter
    if (year) {
      filtered = filtered.filter((p) => p.year?.toString() === year);
    }

    // Tags filter
    if (tags.size > 0) {
      filtered = filtered.filter((project) =>
        project.tags?.some((tag) => tags.has(tag))
      );
    }

    onFilterChange(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    filterProjects(value, selectedYear, selectedTags);
  };

  const handleYearChange = (keys: "all" | Set<React.Key>) => {
    const year = keys === "all" ? "" : (Array.from(keys)[0] as string);
    setSelectedYear(year);
    filterProjects(searchQuery, year, selectedTags);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
    filterProjects(searchQuery, selectedYear, newTags);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedYear("");
    setSelectedTags(new Set());
    onFilterChange(projects);
  };

  const hasActiveFilters =
    searchQuery || selectedYear || selectedTags.size > 0;

  return (
    <div className="sticky top-0 z-20 space-y-3 rounded-xl bg-custom-background p-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          size="sm"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          startContent={<Search className="h-4 w-4" />}
          endContent={
            searchQuery && (
              <button onClick={() => handleSearchChange("")}>
                <X className="h-4 w-4" />
              </button>
            )
          }
          classNames={{
            input: "text-sm",
          }}
        />
        <Button
          size="sm"
          isIconOnly
          variant={showFilters ? "solid" : "bordered"}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button size="sm" color="danger" variant="light" onPress={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-3 rounded-lg bg-custom-secondary p-3">
          <Select
            size="sm"
            label="Filter by Year"
            placeholder="All years"
            selectedKeys={selectedYear ? [selectedYear] : []}
            onSelectionChange={handleYearChange}
          >
            {years.map((year) => (
              <SelectItem key={year!}>
                {year}
              </SelectItem>
            ))}
          </Select>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Filter by Technology:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 20).map((tag) => (
                <Chip
                  key={tag}
                  size="sm"
                  variant={selectedTags.has(tag) ? "solid" : "bordered"}
                  color={selectedTags.has(tag) ? "primary" : "default"}
                  onClick={() => handleTagToggle(tag)}
                  className="cursor-pointer"
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-foreground/60">
          Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
        {selectedTags.size > 0 && (
          <div className="flex flex-wrap gap-1">
            {Array.from(selectedTags).map((tag) => (
              <Chip
                key={tag}
                size="sm"
                variant="flat"
                onClose={() => handleTagToggle(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
