import type { Project } from "@/services/core";
import { Button, Image, ScrollShadow } from "@heroui/react";
import { cn } from "@heroui/theme";
import { Github, Settings2, Globe } from "lucide-react";
import { ProjectGithubMetrics } from "./project-github-metrics";

type ProjectCardProps = {
  children: React.ReactNode;
  className?: string;
};

type ProjectCardImageViewProps = {
  className?: string;
  imageUrl: string;
};

type ProjectCardBodyProps = {
  children: React.ReactNode;
  className?: string;
};

type ProjectCardContentProps = {
  children: React.ReactNode;
  className?: string;
};

type ProjectCardContentBodyProps = {
  children: React.ReactNode;
  className?: string;
};

type ProjectCardContentTagsProps = {
  tags: Project["tags"];
  className?: string;
};

type ProjectCardContentFooterProps = {
  children: React.ReactNode;
  className?: string;
};

type ProjectCardGithubMetricsProps = {
  githubRepo?: string;
  className?: string;
};

type ProjectCardRepositoryButtonProps = {
  url: string | null;
  className?: string;
};
type ProjectCardProcessButtonProps = {
  url: string | null;
  className?: string;
};
type ProjectCardLiveButtonProps = {
  url: string | null;
  className?: string;
};

type ProjectCardImageProps = {
  imageUrl: string;
};

type ProjectCardTitleProps = {
  className?: string;
  title: string;
  year: number;
};

type ProjectCardDescriptionProps = {
  classNames?: {
    container?: string;
    description?: string;
  };
  children: React.ReactNode;
};

export const ProjectCard = ({ children, className }: ProjectCardProps) => (
  <div
    className={cn(
      "group bg-background hover:border-primary hover:bg-primary/5 border-default relative h-full overflow-hidden rounded-xl border transition-all duration-200 ease-in-out sm:h-[350px]",
      className,
    )}
  >
    {children}
  </div>
);

const ProjectCardImageView = ({
  className,
  imageUrl,
}: ProjectCardImageViewProps) => (
  <div
    className={cn(
      `pointer-events-none absolute z-[5] h-full w-full rounded-xl bg-cover bg-center opacity-0 transition-all duration-300 ease-in-out`,
      className,
    )}
    style={{ backgroundImage: `url(${imageUrl})` }}
  >
    <Image
      radius={"none"}
      src={imageUrl}
      classNames={{
        wrapper:
          "object-scale-down h-full mx-auto rounded-xl backdrop-blur-[12px]",
        img: "object-scale-down h-full mx-auto rounded-xl backdrop-blur-[12px]",
      }}
    />
  </div>
);

const ProjectCardBody = ({ children, className }: ProjectCardBodyProps) => (
  <div
    className={cn("grid h-full w-full grid-cols-12 overflow-hidden", className)}
  >
    {children}
  </div>
);

const ProjectCardImage = ({ imageUrl }: ProjectCardImageProps) => (
  <div
    className={cn(
      "relative col-span-12 h-full w-full overflow-hidden sm:col-span-6",
    )}
  >
    <Image
      radius="none"
      isBlurred
      src={imageUrl}
      removeWrapper
      className="h-full w-full object-cover"
    />
  </div>
);

const ProjectCardContent = ({
  children,
  className,
}: ProjectCardContentProps) => (
  <div
    className={cn(
      "col-span-12 flex h-full w-full flex-col p-6 sm:col-span-6",
      className,
    )}
  >
    {children}
  </div>
);

const ProjectCardContentBody = ({
  children,
  className,
}: ProjectCardContentBodyProps) => (
  <div className={cn("h-full", className)}>{children}</div>
);

const ProjectCardTitle = ({
  title,
  year,
  className,
}: ProjectCardTitleProps) => (
  <p className={cn("mb-2 text-sm font-bold 2xl:text-base", className)}>
    {title} {"･"} {year}
  </p>
);

const ProjectCardDescription = ({
  children,
  classNames,
}: ProjectCardDescriptionProps) => (
  <ScrollShadow
    hideScrollBar
    size={50}
    className={cn("max-h-[120px] text-xs lg:max-h-[150px] 2xl:text-base")}
  >
    <p className={cn("", classNames?.description)}>{children}</p>
  </ScrollShadow>
);

const ProjectCardContentTags = ({
  tags,
  className,
}: ProjectCardContentTagsProps) => (
  <ScrollShadow size={30} className="max-h-[100px]">
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {tags.map((tag, index) => (
        <div
          className="border-default rounded-lg border px-2 py-1"
          key={`ProjectTag-${tag}-${index}`}
        >
          <p className="text-xs">{tag}</p>
        </div>
      ))}
    </div>
  </ScrollShadow>
);

const ProjectCardContentFooter = ({
  children,
  className,
}: ProjectCardContentFooterProps) => (
  <div className={cn("mt-auto flex flex-wrap gap-2", className)}>
    {children}
  </div>
);

const ProjectCardRepositoryButton = ({
  url,
  className,
}: ProjectCardRepositoryButtonProps) => {
  if (!url) return;
  return (
    <a href={url} target="_blank">
      <Button
        size="sm"
        color="primary"
        startContent={<Github size={15} />}
        className={cn("", className)}
      >
        See repository
      </Button>
    </a>
  );
};

const ProjectCardProcessButton = ({
  url,
  className,
}: ProjectCardProcessButtonProps) => {
  if (!url) return;
  return (
    <a href={url} target="_blank">
      <Button
        size="sm"
        variant="flat"
        startContent={<Settings2 size={15} />}
        className={cn("", className)}
      >
        See process
      </Button>
    </a>
  );
};

const ProjectCardLiveButton = ({
  url,
  className,
}: ProjectCardLiveButtonProps) => {
  if (!url) return;
  return (
    <a href={url} target="_blank">
      <Button
        size="sm"
        variant="flat"
        startContent={<Globe size={15} />}
        className={cn("", className)}
      >
        See live
      </Button>
    </a>
  );
};

const ProjectCardGithubMetrics = ({
  githubRepo,
  className,
}: ProjectCardGithubMetricsProps) => {
  if (!githubRepo) return null;
  return <ProjectGithubMetrics githubRepo={githubRepo} className={className} />;
};

ProjectCard.ImageView = ProjectCardImageView;
ProjectCard.Body = ProjectCardBody;
ProjectCard.Content = ProjectCardContent;
ProjectCard.ContentBody = ProjectCardContentBody;
ProjectCard.ContentTags = ProjectCardContentTags;
ProjectCard.ContentFooter = ProjectCardContentFooter;
ProjectCard.RepositoryButton = ProjectCardRepositoryButton;
ProjectCard.ProcessButton = ProjectCardProcessButton;
ProjectCard.LiveButton = ProjectCardLiveButton;
ProjectCard.Image = ProjectCardImage;
ProjectCard.Title = ProjectCardTitle;
ProjectCard.Description = ProjectCardDescription;
ProjectCard.GithubMetrics = ProjectCardGithubMetrics;
