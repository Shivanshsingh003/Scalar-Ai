"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import { modalBackdrop, modalContent, pressable, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { dialogRef, titleId } = useDialogA11y(open, onCancel, {
    initialFocusRef: cancelRef,
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...modalBackdrop}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={`${titleId}-desc`}
            {...modalContent}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
          >
            <h2 id={titleId} className="text-xl font-light tracking-tight text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <p id={`${titleId}-desc`} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {description}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <motion.button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                whileTap={pressable.whileTap}
                className="focus-ring touch-target rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                type="button"
                onClick={onConfirm}
                whileTap={pressable.whileTap}
                className={cn(
                  "focus-ring touch-target rounded-2xl px-4 py-3 text-sm font-semibold text-white",
                  variant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                )}
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
