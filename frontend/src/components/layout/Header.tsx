"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-md safe-top transition-colors duration-300 dark:border-gray-800/80 dark:bg-gray-950/90">
      <div className="mx-auto flex h-14 min-h-[56px] max-w-7xl items-center justify-between px-4 sm:h-[60px] sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white shadow-sm dark:bg-white dark:text-gray-900">
            F
          </span>
          <span className="truncate text-base font-semibold tracking-tight text-gray-900 sm:text-lg dark:text-gray-100">
            FormFlow
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label="Main navigation">
          <Link
            href="/dashboard"
            className="touch-target inline-flex items-center rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 sm:px-3.5 dark:bg-gray-800 dark:text-gray-100"
          >
            <span className="hidden sm:inline">My forms</span>
            <span className="sm:hidden">Forms</span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
