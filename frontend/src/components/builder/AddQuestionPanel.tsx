"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { QuestionType } from "@/types";
import { QUESTION_TYPES } from "@/lib/questionTypes";
import { QuestionTypeIcon } from "@/components/builder/QuestionTypeIcon";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import { modalBackdrop, modalContent, pressable, staggerContainer, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AddQuestionPanelProps {
  onAdd: (type: QuestionType) => void;
  onClose: () => void;
}

export function AddQuestionPanel({ onAdd, onClose }: AddQuestionPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { dialogRef, titleId } = useDialogA11y(true, onClose, {
    initialFocusRef: closeButtonRef,
  });

  return (
    <motion.div
      key="add-question-backdrop"
      {...modalBackdrop}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:absolute sm:items-start sm:bg-black/30 sm:pt-16"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        {...modalContent}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[min(88dvh,640px)] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-gray-900/10 ring-1 ring-gray-100 safe-bottom sm:max-h-none sm:max-w-2xl sm:rounded-3xl sm:p-8 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 sm:border-0 sm:p-0 dark:border-gray-800">
          <div>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 sm:hidden dark:bg-gray-700" aria-hidden />
            <h2 id={titleId} className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl dark:text-gray-100">
              Add a question
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Choose a question type to get started</p>
          </div>
          <motion.button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={transition}
            className="touch-target focus-ring flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close add question dialog"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </motion.button>
        </div>
        <motion.div
          role="group"
          aria-label="Question types"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-2 overflow-y-auto p-4 sm:mt-8 sm:grid-cols-4 sm:gap-3 sm:p-0"
        >
          {QUESTION_TYPES.map((type) => (
            <motion.button
              key={type.value}
              type="button"
              onClick={() => onAdd(type.value)}
              variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0, transition },
              }}
              whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
              whileTap={pressable.whileTap}
              className={cn(
                "touch-target focus-ring flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 sm:gap-3 sm:p-5",
                "transition-colors hover:border-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              )}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 ring-1 ring-gray-200/80 sm:h-11 sm:w-11 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700" aria-hidden>
                <QuestionTypeIcon type={type.value} size="md" />
              </span>
              <span className="text-center text-[11px] font-semibold leading-tight text-gray-700 sm:text-xs dark:text-gray-300">
                {type.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
