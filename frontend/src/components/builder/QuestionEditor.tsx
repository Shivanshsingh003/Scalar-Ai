"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Question } from "@/types";
import { typeHasOptions } from "@/lib/questionTypes";
import { QuestionTypePicker } from "@/components/builder/QuestionTypePicker";
import { OptionsEditor } from "@/components/builder/OptionsEditor";
import { QuestionPreview } from "@/components/builder/QuestionPreview";
import { fadeInUp, pressable, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  formTitle: string;
  formDescription: string | null;
  onFormTitleChange: (title: string) => void;
  onFormDescriptionChange: (description: string | null) => void;
  onChange: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

export function QuestionEditor({
  question,
  questionIndex,
  formTitle,
  formDescription,
  onFormTitleChange,
  onFormDescriptionChange,
  onChange,
  onDelete,
}: QuestionEditorProps) {
  const showOptions = typeHasOptions(question.type) && question.options;

  return (
    <div className="w-full px-5 py-8 font-sans sm:px-8 md:px-10 lg:px-14 xl:px-16 lg:py-10">
      {questionIndex === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="mb-8 rounded-2xl bg-white p-6 shadow-card ring-1 ring-gray-100 sm:mb-10 sm:p-8 dark:bg-gray-900 dark:ring-gray-800"
        >
          <p id="welcome-screen-label" className="text-typeform-label uppercase text-gray-500 dark:text-gray-400">
            Welcome screen
          </p>
          <label htmlFor="form-title" className="sr-only">
            Form title
          </label>
          <input
            id="form-title"
            type="text"
            value={formTitle}
            onChange={(e) => onFormTitleChange(e.target.value)}
            aria-labelledby="welcome-screen-label"
            className="focus-ring mt-4 w-full rounded-2xl border-none bg-transparent text-3xl font-light tracking-tight text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500 sm:text-4xl"
            placeholder="Form title"
          />
          <label htmlFor="form-description" className="sr-only">
            Form description (optional)
          </label>
          <textarea
            id="form-description"
            value={formDescription ?? ""}
            onChange={(e) => onFormDescriptionChange(e.target.value || null)}
            rows={2}
            className="focus-ring mt-3 w-full resize-none rounded-2xl border-none bg-transparent text-lg font-light leading-relaxed text-gray-600 placeholder:text-gray-400 focus:outline-none dark:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Form description (optional)"
          />
        </motion.div>
      )}

      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-gray-100 sm:p-8 md:p-10 dark:bg-gray-900 dark:ring-gray-800"
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-50/90 p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900/50 dark:ring-gray-800">
          <div className="flex items-center gap-3">
            <span className="flex h-9 min-w-9 items-center justify-center rounded-2xl bg-white px-2.5 text-xs font-bold text-gray-500 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-700">
              {questionIndex + 1}
            </span>
            <QuestionTypePicker
              value={question.type}
              onChange={(type) => {
                const updates: Partial<Question> = { type };
                if (typeHasOptions(type)) {
                  updates.options =
                    question.type === type && question.options
                      ? question.options
                      : type === "yes_no"
                        ? ["Yes", "No"]
                        : ["Option 1", "Option 2"];
                } else {
                  updates.options = null;
                }
                onChange(updates);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
              <span id="required-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Required
              </span>
              <motion.button
                type="button"
                role="switch"
                aria-checked={question.required}
                aria-labelledby="required-label"
                onClick={() => onChange({ required: !question.required })}
                whileTap={{ scale: 0.95 }}
                transition={transition}
                className={cn(
                  "focus-ring relative h-6 w-11 rounded-full transition-colors",
                  question.required ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-200 dark:bg-gray-700"
                )}
              >
                <motion.span
                  layout
                  transition={transition}
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm dark:bg-gray-900",
                    question.required ? "left-[22px]" : "left-0.5"
                  )}
                />
              </motion.button>
            </div>

            <motion.button
              type="button"
              onClick={onDelete}
              whileHover={{ scale: 1.02 }}
              whileTap={pressable.whileTap}
              transition={transition}
              aria-label={`Delete question ${questionIndex + 1}`}
              className="focus-ring rounded-2xl px-3.5 py-2 text-sm font-medium text-red-600 ring-1 ring-transparent hover:bg-red-50 hover:ring-red-100 dark:hover:bg-red-950/50 dark:hover:ring-red-900"
            >
              Delete
            </motion.button>
          </div>
        </div>

        <div className="group relative">
          <label htmlFor={`question-title-${question.id}`} className="sr-only">
            Question title
          </label>
          <textarea
            id={`question-title-${question.id}`}
            value={question.title}
            onChange={(e) => onChange({ title: e.target.value })}
            rows={2}
            className={cn(
              "focus-ring w-full resize-none rounded-2xl border-2 border-transparent bg-transparent px-2 py-3",
              "text-typeform-question font-light text-gray-900 placeholder:text-gray-400",
              "transition-all duration-200 focus:border-blue-200 focus:bg-blue-50/30 sm:text-[2rem]",
              "dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-900 dark:focus:bg-blue-950/20"
            )}
            placeholder="Your question here"
          />

          <label htmlFor={`question-description-${question.id}`} className="sr-only">
            Question description (optional)
          </label>
          <input
            id={`question-description-${question.id}`}
            type="text"
            value={question.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value || null })}
            className={cn(
              "focus-ring mt-2 w-full rounded-2xl border-2 border-transparent bg-transparent px-2 py-2.5",
              "text-base font-light text-gray-600 placeholder:text-gray-400",
              "transition-all duration-200 focus:border-gray-200 focus:bg-gray-50/50",
              "dark:text-gray-400 dark:placeholder:text-gray-500 dark:focus:border-gray-700 dark:focus:bg-gray-900/50"
            )}
            placeholder="Description (optional)"
          />
        </div>

        <AnimatePresence mode="wait">
          {showOptions && question.options && (
            <motion.div key="options" {...fadeInUp}>
              <OptionsEditor
                options={question.options}
                onChange={(options) => onChange({ options })}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition, delay: 0.05 }}
        >
          <QuestionPreview question={question} />
        </motion.div>
      </motion.div>
    </div>
  );
}
