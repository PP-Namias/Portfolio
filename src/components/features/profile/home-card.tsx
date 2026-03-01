import { ResumeViewModalContent } from "@/components/common/resume-view-modal-content";
import { CalendlyButton } from "@/components/common/calendly-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PhilippineTime } from "@/components/common/philippine-time";
import { DiscordPresenceCard } from "@/components/features/discord/discord-presence-card";
import { LastFmRecentTrackTile } from "@/components/features/last-fm/lastfm-recent-track-tile";
import { useCore } from "@/hooks/use-core";
import useGithub from "@/hooks/use-github";
import { Button, Image, Modal, useDisclosure } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FolderOpen,
  ImageIcon,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

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

const navLinks = [
  {
    to: "/projects" as const,
    label: "Projects",
    icon: FolderOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    to: "/certifications" as const,
    label: "Certifications",
    icon: Award,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    to: "/gallery" as const,
    label: "Gallery",
    icon: ImageIcon,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export const HomeCard = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { querySocials, queryTechnologies, queryProfile } = useCore();
  const { data: socials } = querySocials();
  const { data: technologies } = queryTechnologies();
  const { data: profile } = queryProfile();
  const { queryBaseUserInformation } = useGithub();
  const { data: githubUser } = queryBaseUserInformation();
  const personalImage = optimizedImages[personalImageKey];

  const [bioExpanded, setBioExpanded] = useState(false);
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

  const highlights = profile?.highlights;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="border-default bg-background/60 relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border shadow-xl backdrop-blur-md transition-shadow hover:shadow-2xl"
      >
        {/* Gradient Banner */}
        <div className="relative flex h-28 items-end justify-start bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 p-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
          <div className="absolute top-3 right-4 z-10">
            <ThemeToggle />
          </div>
        </div>

        {/* Profile Image */}
        <div className="relative z-10 -mt-10 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="border-background size-20 overflow-hidden rounded-full border-4 shadow-lg ring-2 ring-indigo-500/20"
          >
            <Image
              src={personalImage}
              alt="Jhon Keneth Namias"
              className="size-full object-cover"
              removeWrapper
            />
          </motion.div>
        </div>

        {/* Info */}
        <div className="mt-2 px-5 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-lg font-semibold tracking-tight">
              Jhon Keneth Namias
            </h1>
            <BadgeCheck className="size-5 shrink-0 text-indigo-500" />
          </div>
          <p className="text-foreground/60 text-sm">
            Full-Stack Developer &middot; DevOps &middot; QA
          </p>

          {/* Availability Status */}
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/50 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
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

          {/* Bio / Summary */}
          {profile?.summary && (
            <div className="mt-3">
              <p
                className={`text-foreground/60 text-xs leading-relaxed ${
                  !bioExpanded ? "line-clamp-2" : ""
                }`}
              >
                {profile.summary}
              </p>
              <button
                onClick={() => setBioExpanded(!bioExpanded)}
                className="text-foreground/40 hover:text-foreground/60 mt-1 inline-flex items-center gap-0.5 text-[10px] font-medium transition-colors"
              >
                {bioExpanded ? "Show less" : "Read more"}
                <ChevronDown
                  className={`size-3 transition-transform ${
                    bioExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}

          {/* Philippine Time */}
          <div className="text-foreground/50 mt-2 text-xs">
            <PhilippineTime />
          </div>
        </div>

        {/* Highlights / Stats */}
        {highlights && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-5 mt-5 grid grid-cols-3 divide-x divide-default rounded-xl bg-custom-secondary/50 py-3"
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {highlights.yearsExperience}+
              </span>
              <span className="text-foreground/50 text-[10px] uppercase tracking-wider">
                Years Exp
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {highlights.projectsCompleted}+
              </span>
              <span className="text-foreground/50 text-[10px] uppercase tracking-wider">
                Projects
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Briefcase className="size-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-foreground/50 text-[10px] uppercase tracking-wider">
                Full-time
              </span>
            </div>
          </motion.div>
        )}

        {/* Top Skills */}
        {topSkills && topSkills.length > 0 && (
          <div className="mt-5 space-y-2.5 px-5">
            <h2 className="text-foreground/40 text-[10px] font-semibold uppercase tracking-widest">
              Top Skills
            </h2>
            {topSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.06 }}
              >
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
                    className="h-full rounded-full bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.06 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-5 space-y-1.5 px-5">
          <h2 className="text-foreground/40 text-[10px] font-semibold uppercase tracking-widest">
            Explore
          </h2>
          {navLinks.map((link, index) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
            >
              <Link
                to={link.to}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-custom-secondary/80"
              >
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${link.bg}`}
                >
                  <link.icon className={`size-4 ${link.color}`} />
                </div>
                <span className="text-foreground/80 flex-1 text-sm font-medium">
                  {link.label}
                </span>
                <ChevronRight className="text-foreground/30 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap gap-2 px-5 sm:flex-nowrap">
          <Button
            size="sm"
            className="flex-1 bg-zinc-900 font-medium text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
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
                <motion.a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-custom-secondary flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-indigo-500/10"
                  title={social.label}
                >
                  <img
                    width={14}
                    height={14}
                    src={`https://cdn.simpleicons.org/${getSocialIcon(social.name)}/000000/ffffff`}
                    alt={social.name}
                  />
                </motion.a>
              ))}
          </div>
        )}

        {/* Discord Presence */}
        <div className="mt-3 px-3">
          <DiscordPresenceCard />
        </div>

        {/* Last.fm Now Playing */}
        <div className="mt-1 px-1 pb-2">
          <LastFmRecentTrackTile />
        </div>
      </motion.div>

      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ResumeViewModalContent />
      </Modal>
    </>
  );
};
