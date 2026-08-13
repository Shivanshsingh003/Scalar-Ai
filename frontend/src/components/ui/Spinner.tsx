import { cn } from "@/lib/utils";

type SpinnerSize = "xs" | "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: "h-3.5 w-3.5 border",
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-10 w-10 border-2",
};

export function Spinner({ size = "md", className, label = "Loading" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "animate-spin rounded-full border-gray-200 border-t-gray-900",
        sizeMap[size],
        className
      )}
    />
  );
}

interface LoadingStateProps {
  label?: string;
  className?: string;
  size?: SpinnerSize;
}

export function LoadingState({
  label = "Loading...",
  className,
  size = "md",
}: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12", className)}>
      <Spinner size={size} />
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}
