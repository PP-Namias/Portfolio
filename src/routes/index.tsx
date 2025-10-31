import { RecentExperienceTile } from "@/components/features/experiences/recent-experience-tile";
import { GithubRecentCommitTile } from "@/components/features/github/github-recent-commit-tile";
import { LastFmRecentTrackTile } from "@/components/features/last-fm/lastfm-recent-track-tile";
import { Footer } from "@/components/partials/footer";
import { GithubActivityCalendar } from "@/sections/github-activity-calendar";
import { GithubStats } from "@/sections/github-stats";
import { TabPanel } from "@/sections/tab-panel";
import Technologies from "@/sections/technologies";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/partials/header";
import { Main } from "../sections/main";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-grid lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center">
      <div className="bg-custom-background block h-full w-full space-y-2 p-2 sm:p-4 lg:flex lg:max-h-[1080px] lg:max-w-[1920px] lg:gap-4 lg:space-y-0 lg:rounded-xl">
        <ScrollShadow
          hideScrollBar
          size={100}
          className="space-y-2 scroll-smooth rounded-xl lg:w-5/12 lg:overflow-x-clip lg:overflow-y-auto 2xl:w-4/12"
        >
          <Header />
          <Main />
          <RecentExperienceTile />
          <Technologies />
          <div className="bg-background grid h-[5rem] grid-cols-2 gap-1 rounded-xl p-[3px] sm:hidden lg:grid xl:hidden">
            <GithubRecentCommitTile />
            <LastFmRecentTrackTile />
          </div>
          <GithubStats />
          <GithubActivityCalendar />
          <div className="hidden lg:block">
            <Footer />
          </div>
        </ScrollShadow>

        <div className="scroll-smooth rounded-xl lg:w-7/12 lg:overflow-x-clip lg:overflow-y-auto 2xl:w-8/12">
          <div className="h-full space-y-2 rounded-xl lg:space-y-0">
            <TabPanel />
            <div className="block pb-4 lg:hidden">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
