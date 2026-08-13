"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { fadeInUp, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-md safe-top transition-colors duration-300 dark:border-gray-800/80 dark:bg-gray-950/90">
      <div className="mx-auto flex h-14 min-h-[56px] max-w-6xl items-center justify-between px-4 sm:h-[60px] sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white shadow-sm dark:bg-white dark:text-gray-900">
            F
          </span>
          <span className="truncate text-base font-semibold tracking-tight text-gray-900 sm:text-lg dark:text-gray-100">
            FormFlow
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className={cn(
              "focus-ring touch-target inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white sm:px-3.5",
              "hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            )}
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

export function LandingHero() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
      <motion.h1
        {...fadeInUp}
        transition={{ ...transition, delay: 0.05 }}
        className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100"
      >
        Forms that feel like a conversation
      </motion.h1>
      <motion.p
        {...fadeInUp}
        transition={{ ...transition, delay: 0.12 }}
        className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400"
      >
        Build beautiful, one-question-at-a-time forms. Collect responses effortlessly
        and analyze them in your dashboard.
      </motion.p>
      <motion.div {...fadeInUp} transition={{ ...transition, delay: 0.2 }} className="mt-10">
        <Link
          href="/dashboard"
          className={cn(
            "focus-ring inline-flex items-center justify-center rounded-2xl px-8 py-3.5 text-base font-semibold",
            "bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800",
            "dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          )}
        >
          Create your first form
        </Link>
      </motion.div>
    </section>
  );
}
