import { cn } from "@heroui/theme";
import React from "react";

type TechnologyBadgeProps = {
  className?: string;
  name: string;
  simpleIcon: string;
};

export const TechnologyBadge = React.memo(
  ({ className, name, simpleIcon }: TechnologyBadgeProps) => (
    <div
      className={cn(
        "bg-custom-secondary dark:border-default flex h-full min-h-[2.3rem] items-center gap-2 rounded-lg border border-transparent px-4 text-sm font-bold 2xl:text-base dark:bg-transparent",
        className,
      )}
    >
      <img
        width={14}
        height={14}
        src={`https://cdn.simpleicons.org/${simpleIcon}/000000/0070f0`}
      />
      {name}
    </div>
  ),
);
