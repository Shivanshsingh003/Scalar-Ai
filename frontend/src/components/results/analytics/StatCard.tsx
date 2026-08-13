import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white p-5 shadow-card ring-1 ring-gray-100 sm:p-6",
        "dark:bg-gray-900 dark:ring-gray-800",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-light tracking-tight text-gray-900 dark:text-gray-100">{value}</p>
          {hint && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
        </div>
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function AnalyticsCard({
  title,
  subtitle,
  badge,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl bg-white p-6 shadow-card ring-1 ring-gray-100 sm:p-8",
        "dark:bg-gray-900 dark:ring-gray-800",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {subtitle && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
              {subtitle}
            </p>
          )}
          <h2 className={cn("font-light tracking-tight text-gray-900 dark:text-gray-100", subtitle ? "mt-1 text-lg" : "text-lg")}>
            {title}
          </h2>
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
