"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Form } from "@/types";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SaveProgress } from "@/components/ui/ProgressBar";
import { Spinner } from "@/components/ui/Spinner";
import { pressable, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface BuilderToolbarProps {
  form: Form;
  formId: string;
  saveStatus: SaveStatus;
  isBusy?: boolean;
  sidebarOpen?: boolean;
  onBack: () => void;
  onOpenPublishModal: () => void;
  onToggleSidebar: () => void;
}

export function BuilderToolbar({
  form,
  formId,
  saveStatus,
  isBusy = false,
  sidebarOpen = false,
  onBack,
  onOpenPublishModal,
  onToggleSidebar,
}: BuilderToolbarProps) {
  const isSaving = saveStatus === "saving";
  const disabled = isBusy || isSaving;

  return (
    <header className="sticky top-0 z-50 shrink-0 bg-white/90 shadow-sm backdrop-blur-md safe-top dark:bg-gray-950/90">
      <div className="flex h-14 min-h-[56px] items-center justify-between gap-2 border-b border-gray-200/80 px-3 sm:h-[60px] sm:px-6 dark:border-gray-800/80">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-5">
          <motion.button
            type="button"
            onClick={onToggleSidebar}
            whileTap={pressable.whileTap}
            aria-label={sidebarOpen ? "Close questions panel" : "Open questions panel"}
            aria-expanded={sidebarOpen}
            className="touch-target flex items-center justify-center rounded-2xl text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              {sidebarOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </motion.button>

          <motion.button
            type="button"
            onClick={onBack}
            aria-label="Back to forms"
            disabled={disabled}
            whileHover={disabled ? undefined : { x: -2 }}
            whileTap={disabled ? undefined : pressable.whileTap}
            transition={transition}
            className="touch-target focus-ring flex shrink-0 items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Forms</span>
          </motion.button>

          <div className="hidden h-6 w-px bg-gray-200 dark:bg-gray-800 sm:block" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-[15px]">
              {form.title}
            </p>
            <SaveIndicator status={saveStatus} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          <ToolbarLink
            href={`/dashboard/forms/${formId}/results`}
            className="hidden md:inline-flex"
            disabled={disabled}
          >
            Results
          </ToolbarLink>
          <motion.button
            type="button"
            onClick={onOpenPublishModal}
            disabled={disabled}
            whileHover={disabled ? undefined : pressable.whileHover}
            whileTap={disabled ? undefined : pressable.whileTap}
            className={cn(
              "touch-target inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold shadow-sm sm:px-4",
              "disabled:cursor-not-allowed disabled:opacity-50",
              form.is_published
                ? "border border-emerald-200/80 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                : "bg-gray-900 text-white shadow-gray-900/20 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            )}
          >
            {isSaving && <Spinner size="xs" className="border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900" />}
            <span className="hidden sm:inline">{form.is_published ? "Share" : "Publish"}</span>
            <span className="sm:hidden">{form.is_published ? "Share" : "Live"}</span>
            {form.is_published && !isSaving && (
              <span className="hidden h-2 w-2 rounded-full bg-emerald-500 sm:inline" />
            )}
          </motion.button>
        </div>
      </div>
      <SaveProgress active={isSaving} />
    </header>
  );
}

function ToolbarLink({
  href,
  children,
  external,
  className,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span
        className={cn(
          "inline-flex cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-600",
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={pressable.whileTap}>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(
          "touch-target inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
          className
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") {
    return (
      <p className="mt-0.5 hidden text-[11px] font-medium text-gray-400 sm:block dark:text-gray-500">
        All changes saved
      </p>
    );
  }

  const config = {
    saving: {
      label: "Saving...",
      dot: "bg-amber-400",
      pulse: true,
      text: "text-gray-500 dark:text-gray-400",
    },
    saved: {
      label: "Saved",
      dot: "bg-emerald-500",
      pulse: false,
      text: "text-emerald-600",
    },
    error: {
      label: "Save failed",
      dot: "bg-red-500",
      pulse: false,
      text: "text-red-600",
    },
  }[status];

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn("mt-0.5 flex items-center gap-1.5 text-[11px] font-medium", config.text)}
    >
      {status === "saving" ? (
        <Spinner size="xs" className="border-amber-200 border-t-amber-500" />
      ) : (
        <motion.span
          className={cn("inline-block h-1.5 w-1.5 rounded-full", config.dot)}
          animate={config.pulse ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
          transition={config.pulse ? { duration: 1, repeat: Infinity } : undefined}
        />
      )}
      <span className="hidden sm:inline">{config.label}</span>
    </p>
  );
}
