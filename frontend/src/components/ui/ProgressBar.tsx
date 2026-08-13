import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value?: number;
  indeterminate?: boolean;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({
  value = 0,
  indeterminate = false,
  className,
  barClassName,
}: ProgressBarProps) {
  return (
    <div
      className={cn("h-1 w-full overflow-hidden bg-gray-100 dark:bg-gray-800", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(value)}
    >
      {indeterminate ? (
        <div className={cn("progress-indeterminate h-full rounded-full bg-gray-900", barClassName)} />
      ) : (
        <div
          className={cn("h-full rounded-full bg-gray-900 transition-[width] duration-300 ease-out", barClassName)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      )}
    </div>
  );
}

interface SaveProgressProps {
  active: boolean;
}

export function SaveProgress({ active }: SaveProgressProps) {
  if (!active) {
    return <div className="h-1 w-full bg-transparent" aria-hidden />;
  }

  return <ProgressBar indeterminate className="bg-gray-100 dark:bg-gray-800" barClassName="bg-emerald-500" />;
}
