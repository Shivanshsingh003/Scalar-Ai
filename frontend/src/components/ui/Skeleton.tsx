import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "none";
}

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
  none: "rounded-none",
};

export function Skeleton({ className, rounded = "lg", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-200/90 dark:bg-gray-800/90",
        roundedMap[rounded],
        className
      )}
      aria-hidden
      {...props}
    >
      <div className="skeleton-shimmer absolute inset-0" />
    </div>
  );
}

export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-4/5" : "w-full")}
        />
      ))}
    </div>
  );
}
