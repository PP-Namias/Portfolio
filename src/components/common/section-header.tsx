import { Button } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export const SectionHeader = ({
  title,
  viewAllHref,
  viewAllLabel = "View All",
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-foreground text-xl font-bold sm:text-2xl">{title}</h2>
      {viewAllHref && (
        <Button
          as={Link}
          to={viewAllHref}
          size="sm"
          variant="light"
          className="text-primary gap-1 font-semibold"
          endContent={<ChevronRight className="size-4" />}
        >
          {viewAllLabel}
        </Button>
      )}
    </div>
  );
};
