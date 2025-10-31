import { Spinner, Skeleton, cn, type SpinnerProps } from "@heroui/react";

type LoadingTileProps = {
  spinnerSize?: SpinnerProps["size"];
  className?: string;
};

export const LoadingTile = ({ className, spinnerSize }: LoadingTileProps) => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 z-[100] flex items-center justify-center">
        <Spinner size={spinnerSize ?? "md"} />
      </div>
      <Skeleton className={cn("h-full w-full rounded-lg", className)} />
    </div>
  );
};
