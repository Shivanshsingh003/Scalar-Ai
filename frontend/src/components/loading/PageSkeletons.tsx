import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/Skeleton";

export function BuilderSkeleton() {
  return (
    <div className="flex h-[100dvh] flex-col bg-[#fafafa] dark:bg-gray-950">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200/80 bg-white px-3 sm:h-[60px] sm:px-6 dark:border-gray-800/80 dark:bg-gray-900">
        <div className="flex items-center gap-2 sm:gap-4">
          <Skeleton className="h-10 w-10 rounded-xl sm:hidden" rounded="xl" />
          <Skeleton className="h-4 w-16" rounded="md" />
          <Skeleton className="hidden h-6 w-px sm:block" rounded="none" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 sm:w-36" rounded="md" />
            <Skeleton className="hidden h-3 w-24 sm:block" rounded="md" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="hidden h-9 w-16 md:block" rounded="xl" />
          <Skeleton className="h-9 w-20 sm:w-24" rounded="xl" />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[280px] shrink-0 flex-col bg-[#1a1a1a] lg:flex">
          <div className="border-b border-white/10 px-5 py-4">
            <Skeleton className="h-3 w-16 bg-white/10" rounded="md" />
            <Skeleton className="mt-2 h-4 w-24 bg-white/10" rounded="md" />
          </div>
          <div className="space-y-3 px-3 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[76px] w-full bg-white/10" rounded="2xl" />
            ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          <div className="w-full space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-gray-100 sm:p-8 dark:bg-gray-900 dark:ring-gray-800">
              <Skeleton className="h-10 w-2/3" rounded="2xl" />
              <Skeleton className="mt-4 h-6 w-full" rounded="xl" />
              <Skeleton className="mt-8 h-12 w-full" rounded="2xl" />
              <Skeleton className="mt-4 h-8 w-3/4" rounded="xl" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function ResultsShellSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" rounded="md" />
            <Skeleton className="h-9 w-56" rounded="2xl" />
            <Skeleton className="h-4 w-40" rounded="md" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" rounded="2xl" />
            <Skeleton className="h-10 w-28" rounded="2xl" />
          </div>
        </div>
        <Skeleton className="mt-8 h-12 w-full max-w-sm" rounded="2xl" />
        <div className="mt-8">
          <AnalyticsSummarySkeleton />
        </div>
      </main>
    </div>
  );
}

export function AnalyticsSummarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white p-6 shadow-md shadow-gray-200/50 ring-1 ring-gray-100 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800"
          >
            <Skeleton className="h-3 w-24" rounded="md" />
            <Skeleton className="mt-4 h-9 w-20" rounded="2xl" />
            <Skeleton className="mt-2 h-4 w-32" rounded="md" />
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-md shadow-gray-200/50 ring-1 ring-gray-100 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800">
        <Skeleton className="h-4 w-36" rounded="md" />
        <Skeleton className="mt-6 h-72 w-full" rounded="2xl" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-white p-8 shadow-md shadow-gray-200/50 ring-1 ring-gray-100 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800"
        >
          <Skeleton className="h-3 w-28" rounded="md" />
          <Skeleton className="mt-2 h-6 w-2/3" rounded="xl" />
          <Skeleton className="mt-6 h-64 w-full" rounded="2xl" />
        </div>
      ))}
    </div>
  );
}

export function ResponsesTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-md shadow-gray-200/50 ring-1 ring-gray-100 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800">
      <div className="border-b border-gray-100 p-6 dark:border-gray-800">
        <Skeleton className="h-6 w-48" rounded="xl" />
        <Skeleton className="mt-2 h-4 w-32" rounded="md" />
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-6 py-4">
            <Skeleton className="h-4 w-20" rounded="md" />
            <Skeleton className="h-4 w-40" rounded="md" />
            <Skeleton className="h-6 w-16" rounded="full" />
            <Skeleton className="ml-auto h-8 w-14" rounded="xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResponseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-36" rounded="md" />
      <div className="rounded-3xl bg-white p-6 shadow-md shadow-gray-200/50 ring-1 ring-gray-100 sm:p-8 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:justify-between dark:border-gray-800">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" rounded="md" />
            <Skeleton className="h-5 w-48" rounded="md" />
          </div>
          <Skeleton className="h-4 w-40" rounded="md" />
        </div>
        <div className="mt-6 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 border-b border-gray-50 pb-6 last:border-0 dark:border-gray-900">
              <Skeleton className="h-3 w-32" rounded="md" />
              <Skeleton className="h-5 w-3/4" rounded="xl" />
              <Skeleton className="h-12 w-full" rounded="2xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormPlayerSkeleton() {
  return (
    <main className="fixed inset-0 flex h-[100dvh] flex-col typeform-gradient-1">
      <div className="h-1 w-full bg-gray-900/10">
        <div className="h-full w-1/4 bg-gray-900/40 transition-all" />
      </div>
      <div className="flex flex-1 flex-col justify-center px-6 sm:px-12">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-900/10" />
          <div className="h-12 w-full max-w-xl animate-pulse rounded bg-gray-900/10" />
          <div className="h-6 w-3/4 max-w-lg animate-pulse rounded bg-gray-900/10" />
          <div className="mt-6 space-y-3">
            <div className="h-14 w-full animate-pulse rounded bg-gray-900/[0.07]" />
            <div className="h-14 w-full animate-pulse rounded bg-gray-900/[0.07]" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" rounded="md" />
        <Skeleton className="h-10 w-48" rounded="2xl" />
      </div>
      <Skeleton className="h-11 w-40" rounded="2xl" />
    </div>
  );
}
