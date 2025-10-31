import { Chip, ScrollShadow } from "@heroui/react";
import { cn } from "@heroui/theme";
import { Award, Calendar, MapPin, TrendingUp } from "lucide-react";

type ExperienceCardProps = {
  children: React.ReactNode;
  className?: string;
};

type ExperienceCardOverflowIndexProps = {
  children: React.ReactNode;
  classNames?: {
    base?: string;
    wrapper?: string;
    overlay?: string;
    text?: string;
  };
};

type ExperienceCardBodyProps = {
  children: React.ReactNode;
};

type ExperienceCardContentProps = {
  children: React.ReactNode;
};

type ExperienceCardContentHeaderProps = {
  children: React.ReactNode;
};

type ExperienceCardPositionProps = {
  children: React.ReactNode;
};

type ExperienceCardContentSubHeaderProps = {
  children: React.ReactNode;
};

type ExperienceCardDateProps = {
  children: React.ReactNode;
};

type ExperienceCardCompanyModalityProps = {
  children: React.ReactNode;
};

type ExperienceCardContentBodyProps = {
  children: React.ReactNode;
};

type ExperienceCardSummaryProps = {
  children: React.ReactNode;
};

type ExperienceCardHighlightsProps = {
  highlights: string[];
};

type ExperienceCardTechnologiesProps = {
  technologies: string[];
};

export const ExperienceCard = (props: ExperienceCardProps) => (
  <div
    className={cn(
      "border-default hover:border-primary hover:bg-primary/5 relative rounded-xl border p-[3px] transition-all duration-200 ease-in-out sm:p-0",
      props.className,
    )}
  >
    {props.children}
  </div>
);

const ExperienceCardOverflowIndex = (
  props: ExperienceCardOverflowIndexProps,
) => (
  <div
    className={cn("absolute top-[-10px] right-2 z-20", props.classNames?.base)}
  >
    <div className={cn("relative", props.classNames?.wrapper)}>
      <div
        className={cn(
          "border-custom-secondary dark:border-background absolute inset-0 flex h-full w-full rounded-full border",
          props.classNames?.overlay,
        )}
      ></div>
      <p
        className={cn(
          "bg-default-300 dark:bg-custom-secondary text-primary flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-bold",
          props.classNames?.text,
        )}
      >
        {props.children}
      </p>
    </div>
  </div>
);

const ExperienceCardBody = (props: ExperienceCardBodyProps) => (
  <div className="rounded-xl p-4 px-6 text-xs sm:text-base md:p-6 md:px-8 lg:p-5 lg:px-7 xl:text-sm 2xl:p-6 2xl:px-8 2xl:text-base">
    {props.children}
  </div>
);

const ExperienceCardContent = (props: ExperienceCardContentProps) => (
  <div className="space-y-4">{props.children}</div>
);

const ExperienceCardContentHeader = (
  props: ExperienceCardContentHeaderProps,
) => <div className="space-y-2">{props.children}</div>;

const ExperienceCardPosition = (props: ExperienceCardPositionProps) => (
  <p className="text-base font-bold xl:text-lg 2xl:text-xl">{props.children}</p>
);

const ExperienceCardContentSubHeader = (
  props: ExperienceCardContentSubHeaderProps,
) => <div className="space-y-1">{props.children}</div>;

const ExperienceCardDate = (props: ExperienceCardDateProps) => (
  <div className="text-foreground/50 flex items-center gap-2">
    <Calendar size={20} />
    <p className="text-xs sm:text-sm">{props.children}</p>
  </div>
);

const ExperienceCardCompanyModality = (
  props: ExperienceCardCompanyModalityProps,
) => (
  <div className="text-primary flex items-center gap-2">
    <MapPin size={20} />
    <p className="text-xs font-bold sm:text-sm">{props.children}</p>
  </div>
);

const ExperienceCardContentBody = (props: ExperienceCardContentBodyProps) => (
  <div className="space-y-4">{props.children}</div>
);

const ExperienceCardSummary = (props: ExperienceCardSummaryProps) => (
  <p className="text-foreground/50 text-xs sm:text-sm">{props.children}</p>
);

const ExperienceCardHighlights = (props: ExperienceCardHighlightsProps) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <Award size={20} />
      <p className="text-sm font-bold">Key Achievements</p>
    </div>
    <ScrollShadow size={50} className="max-h-[100px]">
      <ul className="list-disc ps-4 text-xs sm:text-sm">
        {props.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </ScrollShadow>
  </div>
);

const ExperienceCardTechnologies = (props: ExperienceCardTechnologiesProps) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <TrendingUp size={20} />
      <p className="text-sm font-bold">Technologies</p>
    </div>
    <ScrollShadow size={50} className="max-h-[80px]">
      <div className="flex flex-wrap gap-1">
        {props.technologies.map((technology, index) => (
          <Chip
            size="sm"
            radius="sm"
            className="bg-custom-secondary text-xs sm:text-sm"
            key={`${index}-${technology}`}
          >
            {technology}
          </Chip>
        ))}
      </div>
    </ScrollShadow>
  </div>
);

ExperienceCard.OverflowIndex = ExperienceCardOverflowIndex;
ExperienceCard.Body = ExperienceCardBody;
ExperienceCard.Content = ExperienceCardContent;
ExperienceCard.ContentHeader = ExperienceCardContentHeader;
ExperienceCard.Position = ExperienceCardPosition;
ExperienceCard.ContentSubHeader = ExperienceCardContentSubHeader;
ExperienceCard.Date = ExperienceCardDate;
ExperienceCard.CompanyModality = ExperienceCardCompanyModality;
ExperienceCard.ContentBody = ExperienceCardContentBody;
ExperienceCard.Summary = ExperienceCardSummary;
ExperienceCard.Highlights = ExperienceCardHighlights;
ExperienceCard.Technologies = ExperienceCardTechnologies;
