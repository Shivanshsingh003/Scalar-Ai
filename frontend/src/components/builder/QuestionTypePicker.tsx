"use client";

import { useId } from "react";
import { QuestionType } from "@/types";
import { QUESTION_TYPES, getQuestionTypeConfig } from "@/lib/questionTypes";
import { QuestionTypeIcon } from "@/components/builder/QuestionTypeIcon";
import { cn } from "@/lib/utils";

interface QuestionTypePickerProps {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
}

export function QuestionTypePicker({ value, onChange }: QuestionTypePickerProps) {
  const selectId = useId();
  const current = getQuestionTypeConfig(value);

  return (
    <div className="relative inline-flex">
      <label htmlFor={selectId} className="sr-only">
        Question type, currently {current.label}
      </label>
      <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-gray-600 dark:text-gray-400" aria-hidden>
        <QuestionTypeIcon type={value} size="sm" />
      </div>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value as QuestionType)}
        className={cn(
          "focus-ring appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10",
          "text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100",
          "transition-all hover:border-gray-300",
          "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-800 dark:hover:border-gray-600"
        )}
      >
        {QUESTION_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" aria-hidden>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
          <path d="M4.5 6.5L8 10l3.5-3.5" />
        </svg>
      </span>
    </div>
  );
}
