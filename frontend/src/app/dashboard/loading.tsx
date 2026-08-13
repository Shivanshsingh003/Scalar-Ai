import { Header } from "@/components/layout/Header";
import { DashboardHeaderSkeleton } from "@/components/loading/PageSkeletons";
import { FormCardSkeleton } from "@/components/forms/DashboardEmptyState";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <Header />
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 safe-top sm:px-6 sm:py-8 lg:px-8">
        <DashboardHeaderSkeleton />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <FormCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
