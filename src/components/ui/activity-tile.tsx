import { cn } from "@heroui/theme";

type ActivityTileProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

type ActivityTileBodyProps = {
  children: React.ReactNode;
  className?: string;
};

type ActivityTileIconProps = {
  children: React.ReactNode;
  className?: string;
};

type ActivityTileContentProps = {
  children: React.ReactNode;
  className?: string;
};

type ActivityTileContentHeaderProps = {
  children: React.ReactNode;
  className?: string;
};
type ActivityTileContentBodyProps = {
  children: React.ReactNode;
  className?: string;
};
type ActivityTileContentFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export const ActivityTile = ({
  children,
  className,
  style,
}: ActivityTileProps) => (
  <div
    className={cn(
      "bg-custom-secondary flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-transparent p-[3px]",
      className,
    )}
    style={style}
  >
    {children}
  </div>
);

const ActivityTileBody = ({ children, className }: ActivityTileBodyProps) => (
  <div
    className={cn(
      "grid h-full w-full grid-cols-12 sm:gap-6 lg:gap-3",
      className,
    )}
  >
    {children}
  </div>
);

const ActivityTileIcon = ({ children, className }: ActivityTileIconProps) => (
  <div
    className={cn(
      "border-primary bg-primary/5 text-primary dark:border-default hidden h-full w-full items-center justify-center rounded-lg border sm:col-span-3 sm:flex lg:col-span-3 lg:hidden xl:col-span-3 xl:flex",
      className,
    )}
  >
    {children}
  </div>
);

const ActivityTileContent = ({
  children,
  className,
}: ActivityTileContentProps) => (
  <div
    className={cn(
      "col-span-12 my-auto h-max w-full text-center sm:col-span-9 sm:text-start lg:col-span-full lg:text-center xl:col-span-9 xl:text-start",
      className,
    )}
  >
    {children}
  </div>
);

const ActivityTileContentHeader = ({
  children,
  className,
}: ActivityTileContentHeaderProps) => (
  <p className={cn("truncate text-xs lg:text-[10px] xl:text-xs", className)}>
    {children}
  </p>
);

const ActivityTileContentBody = ({
  children,
  className,
}: ActivityTileContentBodyProps) => (
  <p className={cn("truncate text-xs font-bold lg:text-xs", className)}>
    {children}
  </p>
);

const ActivityTileContentFooter = ({
  children,
  className,
}: ActivityTileContentFooterProps) => (
  <p className={cn("truncate text-xs lg:text-[10px] xl:text-xs", className)}>
    {children}
  </p>
);

ActivityTile.Body = ActivityTileBody;
ActivityTile.Icon = ActivityTileIcon;
ActivityTile.Content = ActivityTileContent;
ActivityTile.ContentHeader = ActivityTileContentHeader;
ActivityTile.ContentBody = ActivityTileContentBody;
ActivityTile.ContentFooter = ActivityTileContentFooter;
