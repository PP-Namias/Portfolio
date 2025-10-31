import { cn, Skeleton } from "@heroui/react";
import { TriangleAlert } from "lucide-react";

type ErrorTileProps = {
  className?: string;
};

export const ErrorTile = ({ className }: ErrorTileProps) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      <Skeleton className="absolute inset-0 z-[1]" />
      <div
        className={cn(
          "bg-danger/5 relative z-[2] flex h-full w-full items-center justify-center",
          className,
        )}
      >
        <TriangleAlert className="text-danger" />
      </div>
    </div>
  );
};
