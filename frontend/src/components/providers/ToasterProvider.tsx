"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ToasterProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="top-right"
      expand={false}
      visibleToasts={4}
      offset={20}
      gap={12}
      richColors
      closeButton
      toastOptions={{
        duration: 3500,
        classNames: {
          toast:
            "group rounded-2xl border border-gray-200/90 bg-white/95 px-4 py-3 shadow-xl shadow-gray-900/10 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95 dark:shadow-black/20",
          title: "text-sm font-semibold text-gray-900 dark:text-gray-100",
          description: "text-xs text-gray-500 dark:text-gray-400",
          success: "border-emerald-200/80 dark:border-emerald-800/80",
          error: "border-red-200/80 dark:border-red-800/80",
          closeButton:
            "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300",
        },
      }}
    />
  );
}
