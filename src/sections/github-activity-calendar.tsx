import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useThemeContext } from "@/context/theme-context";
import useGithub from "@/hooks/use-github";
import { ScrollShadow } from "@heroui/react";
import { memo, useMemo } from "react";
import ActivityCalendar from "react-activity-calendar";

export const GithubActivityCalendar = memo(() => {
  const { theme } = useThemeContext();
  const { queryContributionStats } = useGithub();

  const {
    data: { contributions } = {},
    isLoading,
    error,
  } = queryContributionStats();

  const filteredContributions = useMemo(() => {
    if (!contributions) return [];
    const startDate = new Date("2022-01-02").getTime();
    const now = Date.now();

    return contributions
      .map((c) => ({ ...c, timestamp: new Date(c.date).getTime() }))
      .filter((c) => c.timestamp >= startDate && c.timestamp <= now)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [contributions]);

  const customTheme = {
    light: ["hsl(0, 0%, 92%)", "#12181c"],
    dark: ["hsl(0, 0%, 8%)", "#0070f0"],
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
        className={`bg-background flex h-[11rem] items-center overflow-x-scroll overflow-y-hidden rounded-xl p-4`}
      >
        <ScrollShadow
          orientation="horizontal"
          className="relative h-full w-full"
          size={100}
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
              <div className="absolute bottom-0 block text-[10px] md:bottom-0">
                Github contributions from 2022 - Present
              </div>
            </div>
          )}
        </ScrollShadow>
      </div>
    </>
  );
});
