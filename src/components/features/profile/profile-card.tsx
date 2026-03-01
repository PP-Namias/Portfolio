import { ResumeViewModalContent } from "@/components/common/resume-view-modal-content";
import { CalendlyButton } from "@/components/common/calendly-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PhilippineTime } from "@/components/common/philippine-time";
import { DiscordPresenceCard } from "@/components/features/discord/discord-presence-card";
import { LastFmRecentTrackTile } from "@/components/features/last-fm/lastfm-recent-track-tile";
import { useCore } from "@/hooks/use-core";
import useGithub from "@/hooks/use-github";
import { LoadingTile } from "@/components/ui/loading-tile";
import { Button, Image, Modal, useDisclosure } from "@heroui/react";
import { BadgeCheck, Heart, Briefcase } from "lucide-react";

const optimizedImages: Record<string, string> = import.meta.glob(
  "../../assets/portfolio-resources/assets/images/*.{jpg,jpeg,JPG,png,webp}",
  { eager: true, import: "default", query: "?format=webp&meta" },
);

const personalImageKey = Object.keys(optimizedImages).find((key) =>
  key.includes("profile"),
)!;

const getSocialIcon = (name: string) => {
  const slugMap: Record<string, string> = {
    github: "github",
    linkedin: "linkedin",
    facebook: "facebook",
    discord: "discord",
    x: "x",
    instagram: "instagram",
    email: "gmail",
  };
  return slugMap[name.toLowerCase()] || name.toLowerCase();
};

export const ProfileCard = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { querySocials } = useCore();
  const { data: socials, isLoading: socialsLoading } = querySocials();
  const { queryBaseUserInformation } = useGithub();
  const { data: githubUser } = queryBaseUserInformation();
  const personalImage = optimizedImages[personalImageKey];

  const isHireable = githubUser?.hireable ?? false;

  return (
    <>
      <div className="bg-background overflow-hidden rounded-xl">
        {/* Top bar — name + verified + actions */}
        <div className="flex items-center gap-2 p-3 text-sm sm:text-base lg:text-sm xl:text-base">
          <div className="me-auto flex items-center gap-1.5">
            <p className="font-bold">Jhon Keneth Namias</p>
            <BadgeCheck
              data-testid="verified-badge"
              className="text-primary size-5 shrink-0"
              aria-label="Verified"
            />
          </div>
          <div className="flex gap-1">
            <CalendlyButton
              size="sm"
              variant="primary"
              className="hidden sm:flex"
            />
            <Button
              onPress={onOpen}
              size="sm"
              className="bg-custom-secondary rounded-lg text-sm font-bold"
            >
              View resume
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Avatar section */}
        <div className="px-3 sm:px-4">
          <div className="relative overflow-hidden rounded-xl">
            <Heart
              fill="#f472b6"
              className="peer absolute right-[30%] bottom-8 z-50 size-6 text-pink-400 opacity-0 hover:animate-pulse hover:opacity-100"
            />
            <div className="absolute top-0 z-50 flex w-full justify-end p-3 text-sm text-pink-400 opacity-0 peer-hover:animate-pulse peer-hover:opacity-100">
              <p>{"Hey there, jiya :)"}</p>
            </div>
            <Image
              src={personalImage}
              className="aspect-square h-full w-full object-cover"
              removeWrapper
            />
          </div>
        </div>

        {/* Info section */}
        <div className="space-y-3 px-3 pt-3 pb-4 sm:px-4">
          {/* Name + title + availability */}
          <div>
            <h1 className="text-lg font-bold sm:text-xl">
              Jhon Keneth Namias
            </h1>
            <p className="text-foreground/60 text-sm">
              Full-Stack Developer &middot; DevOps &middot; QA &middot; Data
              Science
            </p>
          </div>

          {/* Availability badge */}
          <div
            data-testid="availability-badge"
            className={`flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
              isHireable
                ? "bg-success/15 text-success"
                : "bg-primary/10 text-primary"
            }`}
          >
            <div className="relative flex items-center justify-center">
              {isHireable && (
                <div className="bg-success absolute size-2.5 animate-ping rounded-full opacity-75" />
              )}
              <div
                className={`size-2 rounded-full ${isHireable ? "bg-success" : "bg-primary"}`}
              />
            </div>
            <Briefcase className="size-3" />
            <span>
              {isHireable
                ? "Available for freelance & opportunities"
                : "Committed full-time"}
            </span>
          </div>

          {/* Philippine time + GitHub badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <PhilippineTime />
            <span className="text-foreground/30">&middot;</span>
            <Image
              radius="none"
              className="h-5"
              src="https://img.shields.io/badge/dynamic/json?&label=Stars&color=000000&style=flat&query=%24.stars&url=https://api.github-star-counter.workers.dev/user/PP-Namias"
            />
            <Image
              radius="none"
              className="h-5"
              src="https://komarev.com/ghpvc/?username=PP-Namias&label=Visitors&color=000000&style=flat"
            />
          </div>

          {/* Bio */}
          <p className="text-foreground/80 text-xs leading-relaxed sm:text-sm">
            Philippines-based software engineer specializing in
            <span className="text-primary font-semibold">
              {" "}
              Full-Stack Development, DevOps Engineering, Quality Assurance, and
              Data Science.{" "}
            </span>
            I architect and deliver production-ready solutions that solve
            real-world problems — from building high-performance web applications
            and implementing CI/CD pipelines, to engineering data-driven systems
            and ensuring code quality at scale.
          </p>

          {/* Social icons — compact row */}
          {!socialsLoading && socials && (
            <div className="flex flex-wrap gap-2">
              {socials
                .filter((s) => s.name.toLowerCase() !== "calendly")
                .map((social) => (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-custom-secondary hover:bg-primary/10 dark:border-default flex size-8 items-center justify-center rounded-lg border border-transparent transition-colors"
                    title={social.label}
                  >
                    <img
                      width={14}
                      height={14}
                      src={`https://cdn.simpleicons.org/${getSocialIcon(social.name)}/000000/ffffff`}
                      alt={social.name}
                    />
                  </a>
                ))}
            </div>
          )}
          {socialsLoading && <LoadingTile className="h-8" />}

          {/* Discord presence — compact */}
          <div className="hidden sm:block lg:hidden xl:block">
            <DiscordPresenceCard />
          </div>
        </div>

        {/* Last.fm now playing — compact */}
        <div className="px-1 pb-1">
          <LastFmRecentTrackTile />
        </div>
      </div>

      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ResumeViewModalContent />
      </Modal>
    </>
  );
};
