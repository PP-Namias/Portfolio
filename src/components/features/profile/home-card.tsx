import { ResumeViewModalContent } from "@/components/common/resume-view-modal-content";
import { CalendlyButton } from "@/components/common/calendly-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PhilippineTime } from "@/components/common/philippine-time";
import { DiscordPresenceCard } from "@/components/features/discord/discord-presence-card";
import { LastFmRecentTrackTile } from "@/components/features/last-fm/lastfm-recent-track-tile";
import { useCore } from "@/hooks/use-core";
import useGithub from "@/hooks/use-github";
import { Button, Image, Modal, useDisclosure } from "@heroui/react";
import {
  BadgeCheck,
  Calendar,
  ExternalLink,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";

const optimizedImages: Record<string, string> = import.meta.glob(
  "../../../assets/portfolio-resources/assets/images/*.{jpg,jpeg,JPG,png,webp}",
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

export const HomeCard = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { querySocials, queryTechnologies } = useCore();
  const { data: socials } = querySocials();
  const { data: technologies } = queryTechnologies();
  const { queryBaseUserInformation } = useGithub();
  const { data: githubUser } = queryBaseUserInformation();
  const personalImage = optimizedImages[personalImageKey];

  const isHireable = githubUser?.hireable ?? false;

  // Top 5 skills by proficiency
  const topSkills = technologies
    ?.filter((t) => t.proficiency)
    .sort((a, b) => (b.proficiency ?? 0) - (a.proficiency ?? 0))
    .slice(0, 5);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Jhon Keneth Namias — Portfolio",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="border-default bg-background/60 relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-lg backdrop-blur-md"
      >
        {/* Gradient Banner */}
        <div className="relative flex h-28 items-end justify-start bg-linear-to-br from-indigo-600 to-purple-700 p-4">
          <div className="absolute top-3 right-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Profile Image */}
        <div className="relative z-10 -mt-10 flex justify-center">
          <div className="border-background dark:border-background size-20 overflow-hidden rounded-full border-4 shadow-md">
            <Image
              src={personalImage}
              alt="Jhon Keneth Namias"
              className="size-full object-cover"
              removeWrapper
            />
          </div>
        </div>

        {/* Info */}
        <div className="mt-2 px-5 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-lg font-semibold">Jhon Keneth Namias</h1>
            <BadgeCheck className="text-primary size-5 shrink-0" />
          </div>
          <p className="text-foreground/60 text-sm">
            Full-Stack Developer &middot; DevOps &middot; QA
          </p>

          {/* Availability Status */}
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/50 px-2.5 py-0.5 text-xs text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <div className="relative flex items-center justify-center">
              {isHireable && (
                <div className="absolute size-2 animate-ping rounded-full bg-emerald-500 opacity-75" />
              )}
              <div
                className={`size-1.5 rounded-full ${isHireable ? "bg-emerald-500" : "bg-primary"}`}
              />
            </div>
            <Calendar className="size-3" />
            <span>
              {isHireable
                ? "Available for Remote Projects"
                : "Committed full-time"}
            </span>
          </div>

          {/* Philippine Time */}
          <div className="text-foreground/50 mt-2 text-xs">
            <PhilippineTime />
          </div>
        </div>

        {/* Top Skills */}
        {topSkills && topSkills.length > 0 && (
          <div className="mt-5 space-y-3 px-5">
            {topSkills.map((skill) => (
              <div key={skill.name}>
                <div className="text-foreground/80 mb-1 flex justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <img
                      width={14}
                      height={14}
                      src={`https://cdn.simpleicons.org/${skill.logo}/000000/ffffff`}
                      alt={skill.name}
                    />
                    {skill.name}
                  </span>
                  <span className="text-foreground/40 text-xs">
                    {skill.proficiency}%
                  </span>
                </div>
                <div className="bg-default-200 h-1.5 w-full overflow-hidden rounded-full">
                  <motion.div
                    className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 px-5 sm:flex-nowrap">
          <Button
            size="sm"
            className="flex-1 bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
            onPress={onOpen}
          >
            <ExternalLink className="mr-1.5 size-4" />
            Resume
          </Button>
          <CalendlyButton size="sm" variant="ghost" className="flex-1" />
          <Button
            size="sm"
            variant="light"
            className="text-foreground/70"
            onPress={handleShare}
          >
            <Share2 className="size-4" />
            Share
          </Button>
        </div>

        {/* Social Icons */}
        {socials && (
          <div className="mt-4 flex justify-center gap-2 px-5">
            {socials
              .filter((s) => s.name.toLowerCase() !== "calendly")
              .map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-custom-secondary hover:bg-primary/10 flex size-8 items-center justify-center rounded-lg transition-colors"
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

        {/* Discord Presence */}
        <div className="mt-3 px-3">
          <DiscordPresenceCard />
        </div>

        {/* Last.fm Now Playing */}
        <div className="mt-1 px-1 pb-1">
          <LastFmRecentTrackTile />
        </div>
      </motion.div>

      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ResumeViewModalContent />
      </Modal>
    </>
  );
};
