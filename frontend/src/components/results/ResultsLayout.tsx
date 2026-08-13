"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { notify } from "@/lib/toast";
import { api } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { ResultsShellSkeleton } from "@/components/loading/PageSkeletons";
import { useFormResults } from "@/components/results/FormResultsProvider";
import { pressable, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ResultsLayoutProps {
  formId: string;
  formTitle: string;
  totalResponses: number;
  completionRate?: number;
  children: React.ReactNode;
}

export function ResultsLayout({
  formId,
  formTitle,
  totalResponses,
  completionRate,
  children,
}: ResultsLayoutProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/forms/${formId}/results`;
  const isSummary = pathname === basePath;
  const isResponses =
    pathname === `${basePath}/responses` ||
    pathname.startsWith(`${basePath}/responses/`);

  const handleExport = () => {
    window.open(api.forms.exportCsvUrl(formId), "_blank");
    notify.csvExported();
  };

  const tabs = [
    { label: "Summary", shortLabel: "Summary", href: basePath, active: isSummary },
    {
      label: "Individual Responses",
      shortLabel: "Responses",
      href: `${basePath}/responses`,
      active: isResponses,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <Header />

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 safe-top sm:px-6 sm:py-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to dashboard
            </Link>
            <h1 className="mt-3 text-2xl font-light tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{formTitle}</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {totalResponses} total response{totalResponses !== 1 ? "s" : ""}
              {completionRate !== undefined && totalResponses > 0 && (
                <span> · {completionRate}% completion rate</span>
              )}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={pressable.whileTap} className="w-full sm:w-auto">
              <Link
                href={`/dashboard/forms/${formId}`}
                className="touch-target inline-flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto sm:py-2.5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Edit form
              </Link>
            </motion.div>
            <motion.button
              type="button"
              onClick={handleExport}
              whileHover={pressable.whileHover}
              whileTap={pressable.whileTap}
              className="touch-target focus-ring w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 sm:w-auto sm:py-2.5"
              aria-label="Export responses as CSV file"
            >
              Export CSV
            </motion.button>
          </div>
        </motion.div>

        <nav
          className="mt-6 border-b border-gray-200 sm:mt-8 dark:border-gray-800"
          aria-label="Results views"
        >
          <div className="flex gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "touch-target relative shrink-0 pb-3 text-sm font-medium transition-colors duration-300",
                  tab.active
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                )}
              >
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.active && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gray-900 dark:bg-gray-100" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

interface ResultsPageShellProps {
  children: React.ReactNode;
}

export function ResultsPageShell({ children }: ResultsPageShellProps) {
  const { analytics, isLoading, formId } = useFormResults();

  if (isLoading || !analytics) {
    return <ResultsShellSkeleton />;
  }

  return (
    <ResultsLayout
      formId={formId}
      formTitle={analytics.title}
      totalResponses={analytics.total_responses}
      completionRate={analytics.completion_rate}
    >
      {children}
    </ResultsLayout>
  );
}
