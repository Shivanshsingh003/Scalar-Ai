"use client";

import { Spinner } from "@/components/ui/Spinner";
import { pressable, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type SortOption = "updated_desc" | "updated_asc" | "title_asc" | "title_desc";

interface DashboardToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  formCount: number;
  totalResponses: number;
  publishedCount: number;
}

const SORT_LABELS: Record<SortOption, string> = {
  updated_desc: "Last edited",
  updated_asc: "Oldest edited",
  title_asc: "Name A–Z",
  title_desc: "Name Z–A",
};

export function DashboardToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  formCount,
  totalResponses,
  publishedCount,
}: DashboardToolbarProps) {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            id="dashboard-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search forms..."
            aria-label="Search forms"
            className={cn(
              "touch-target w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-10 pr-4",
              "text-sm text-gray-900 shadow-sm ring-1 ring-gray-100 placeholder:text-gray-400",
              "transition-all focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200",
              "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-800 dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-700"
            )}
          />
        </div>

        <div className="relative shrink-0">
          <label htmlFor="dashboard-sort" className="sr-only">
            Sort forms by
          </label>
          <select
            id="dashboard-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={cn(
              "touch-target w-full appearance-none rounded-2xl border border-gray-200 bg-white py-3.5 pl-4 pr-10",
              "text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-100 sm:w-auto",
              "focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200",
              "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-800 dark:focus:border-gray-600 dark:focus:ring-gray-700"
            )}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <option key={key} value={key}>
                Sort: {SORT_LABELS[key]}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          >
            <path d="M4.5 6.5L8 10l3.5-3.5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
        <span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formCount}</span> form
          {formCount !== 1 ? "s" : ""}
        </span>
        <span className="hidden text-gray-300 dark:text-gray-700 sm:inline">·</span>
        <span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{publishedCount}</span> published
        </span>
        <span className="hidden text-gray-300 dark:text-gray-700 sm:inline">·</span>
        <span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{totalResponses}</span> total responses
        </span>
      </div>
    </div>
  );
}

interface CreateFormButtonProps {
  onClick: () => void;
  isCreating: boolean;
  className?: string;
}

export function CreateFormButton({ onClick, isCreating, className }: CreateFormButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isCreating}
      whileHover={isCreating ? undefined : pressable.whileHover}
      whileTap={isCreating ? undefined : pressable.whileTap}
      className={cn(
        "touch-target inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-3.5 sm:w-auto",
        "text-sm font-semibold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {isCreating ? (
        <>
          <Spinner size="sm" className="border-white/30 border-t-white" />
          Creating...
        </>
      ) : (
        <>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10 4.75a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 0110 4.75z" />
          </svg>
          Create new form
        </>
      )}
    </motion.button>
  );
}
