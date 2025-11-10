import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useThemeContext } from "@/context/theme-context";
import useGithub from "@/hooks/use-github";
import { memo, useMemo, useRef, useState } from "react";
import ActivityCalendar from "react-activity-calendar";

export const GithubActivityCalendar = memo(() => {
  const { theme } = useThemeContext();
  const { queryContributionStats } = useGithub();

  // Drag to scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const {
    data: { contributions } = {},
    isLoading,
    error,
  } = queryContributionStats();

  const filteredContributions = useMemo(() => {
    if (!contributions) return [];
    // Show 2025 contributions from start of year to today only (no future dates)
    const startOf2025 = new Date("2025-01-01").getTime();
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    const endOfToday = today.getTime();

    return contributions
      .map((c) => ({ ...c, timestamp: new Date(c.date).getTime() }))
      .filter((c) => c.timestamp >= startOf2025 && c.timestamp <= endOfToday)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [contributions]);

  const customTheme = {
    light: ["hsl(0, 0%, 92%)", "#12181c"],
    dark: ["hsl(0, 0%, 8%)", "#0070f0"],
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
    scrollContainerRef.current.style.userSelect = "none";
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    scrollContainerRef.current.style.userSelect = "auto";
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    scrollContainerRef.current.style.userSelect = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (isLoading)
    return (
      <div className="bg-background h-[10.8rem] rounded-xl p-[3px]">
        <LoadingTile />
      </div>
    );

  if (error)
    return (
      <div className="bg-background h-[10.8rem] rounded-xl p-[3px]">
        <ErrorTile />
      </div>
    );

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="bg-background relative flex h-[11rem] cursor-grab items-center overflow-x-scroll overflow-y-hidden rounded-xl p-4 active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {filteredContributions && (
          <div className="w-max">
            <ActivityCalendar
              data={filteredContributions}
              theme={customTheme}
              colorScheme={theme as "light" | "dark"}
              fontSize={10}
              blockSize={10}
              hideTotalCount
            />
            <div className="absolute bottom-4 left-4 block text-[10px]">
              Daily coding activity - 2025
            </div>
          </div>
        )}
      </div>
    </>
  );
});
