"use client";

import { motion } from "framer-motion";
import { pressable, transition } from "@/lib/motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export function FormCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-md shadow-gray-200/60 ring-1 ring-gray-100 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800">
      <Skeleton className="h-28 w-full sm:h-32" rounded="none" />
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" rounded="xl" />
          <Skeleton className="h-4 w-full" rounded="lg" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" rounded="md" />
          <Skeleton className="h-4 w-32" rounded="md" />
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-12" rounded="lg" />
            <Skeleton className="h-7 w-16" rounded="lg" />
          </div>
          <Skeleton className="h-8 w-8" rounded="xl" />
        </div>
      </div>
    </div>
  );
}

interface DashboardEmptyStateProps {
  onCreateForm: () => void;
  isCreating?: boolean;
}

export function DashboardEmptyState({ onCreateForm, isCreating }: DashboardEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-md shadow-gray-200/50 ring-1 ring-gray-100 sm:py-24 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...transition, delay: 0.1 }}
        className="relative"
      >
        <EmptyIllustration />
      </motion.div>

      <h2 className="mt-8 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Create your first form</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        Build beautiful conversational forms, collect responses, and analyze results — all in one place.
      </p>

      <motion.button
        type="button"
        onClick={onCreateForm}
        disabled={isCreating}
        whileHover={isCreating ? undefined : pressable.whileHover}
        whileTap={isCreating ? undefined : pressable.whileTap}
        className={cn(
          "mt-8 inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5",
          "text-sm font-semibold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800",
          "disabled:cursor-not-allowed disabled:opacity-50"
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
    </motion.div>
  );
}

function EmptyIllustration() {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-44 w-auto sm:h-48"
      aria-hidden
    >
      <rect x="20" y="30" width="140" height="100" rx="16" fill="#F3F4F6" />
      <rect x="32" y="48" width="80" height="8" rx="4" fill="#E5E7EB" />
      <rect x="32" y="64" width="116" height="6" rx="3" fill="#E5E7EB" />
      <rect x="32" y="78" width="96" height="6" rx="3" fill="#E5E7EB" />
      <rect x="32" y="100" width="48" height="20" rx="10" fill="#111827" />

      <motion.g
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...transition, delay: 0.2 }}
      >
        <rect x="80" y="10" width="140" height="100" rx="16" fill="url(#grad1)" />
        <rect x="92" y="28" width="90" height="8" rx="4" fill="white" fillOpacity="0.9" />
        <rect x="92" y="44" width="116" height="6" rx="3" fill="white" fillOpacity="0.5" />
        <rect x="92" y="58" width="80" height="6" rx="3" fill="white" fillOpacity="0.5" />
        <circle cx="108" cy="88" r="8" stroke="white" strokeWidth="2" fill="none" />
        <rect x="124" y="84" width="60" height="8" rx="4" fill="white" fillOpacity="0.7" />
      </motion.g>

      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...transition, delay: 0.35 }}
        style={{ transformOrigin: "190px 130px" }}
      >
        <circle cx="190" cy="130" r="28" fill="#111827" />
        <path d="M190 118v24M178 130h24" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </motion.g>

      <defs>
        <linearGradient id="grad1" x1="80" y1="10" x2="220" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DashboardNoResults({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-md shadow-gray-200/50 ring-1 ring-gray-100 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100">No forms found</h2>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        No forms match &ldquo;{query}&rdquo;. Try a different search term.
      </p>
    </motion.div>
  );
}
