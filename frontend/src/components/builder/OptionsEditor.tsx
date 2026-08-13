"use client";

import { AnimatePresence, motion } from "framer-motion";
import { pressable, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface OptionsEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
}

export function OptionsEditor({ options, onChange }: OptionsEditorProps) {
  const updateOption = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    onChange(next);
  };

  const addOption = () => {
    onChange([...options, `Option ${options.length + 1}`]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-8 space-y-2">
      <p id="choices-label" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-gray-400">
        Choices
      </p>
      <AnimatePresence initial={false}>
        {options.map((option, index) => (
          <motion.div
            key={`${index}-${option}`}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10, height: 0 }}
            transition={transition}
            className="group flex items-center gap-3 rounded-2xl bg-gray-50/80 px-3.5 py-2 ring-1 ring-gray-100 dark:bg-gray-900/50 dark:ring-gray-800"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-gray-600 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-700" aria-hidden>
              {String.fromCharCode(65 + index)}
            </span>
            <input
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              aria-labelledby="choices-label"
              aria-label={`Choice ${String.fromCharCode(65 + index)}`}
              className={cn(
                "focus-ring flex-1 border-b-2 border-transparent bg-transparent py-2.5 text-base font-medium text-gray-800 dark:text-gray-200",
                "transition-all duration-200 placeholder:text-gray-400 focus:border-gray-900 dark:placeholder:text-gray-500 dark:focus:border-gray-400"
              )}
              placeholder={`Option ${index + 1}`}
            />
            <motion.button
              type="button"
              onClick={() => removeOption(index)}
              disabled={options.length <= 2}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="focus-ring rounded-2xl p-1.5 text-gray-500 opacity-100 transition-all hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 disabled:opacity-30 sm:opacity-70 sm:hover:opacity-100 dark:text-gray-400 dark:hover:bg-red-950/50"
              aria-label={`Remove choice ${String.fromCharCode(65 + index)}`}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={addOption}
        whileHover={{ x: 2 }}
        whileTap={pressable.whileTap}
        transition={transition}
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 4.75a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 0110 4.75z" />
        </svg>
        Add choice
      </motion.button>
    </div>
  );
}
