"use client";

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { notify } from "@/lib/toast";
import { Spinner } from "@/components/ui/Spinner";
import { Question } from "@/types";
import { MOTION_DURATION_PAGE, MOTION_EASE, pageSlide, pageSlideReduced, pageTransition, transition } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "typeform-gradient-1",
  "typeform-gradient-2",
  "typeform-gradient-3",
  "typeform-gradient-4",
  "typeform-gradient-5",
];

interface FormPlayerProps {
  questions: Question[];
  formTitle?: string;
  formDescription?: string | null;
  onSubmit: (answers: { question_id: string; value: string }[]) => Promise<void>;
}

function isChoiceType(type: Question["type"]) {
  return type === "multiple_choice" || type === "yes_no" || type === "dropdown";
}

export function FormPlayer({
  questions,
  formTitle,
  formDescription,
  onSubmit,
}: FormPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [highlightedOption, setHighlightedOption] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(1);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();
  const slideVariants = reducedMotion ? pageSlideReduced : pageSlide;

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const currentValue = answers[currentQuestion?.id] ?? "";
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const canProceed = !currentQuestion?.required || currentValue.trim().length > 0;

  const goNext = useCallback(
    async (answersOverride?: Record<string, string>) => {
      const payload = answersOverride ?? answers;
      if (!canProceed && !answersOverride) return;
      if (!currentQuestion) return;

      const value = payload[currentQuestion.id] ?? "";
      if (currentQuestion.required && !value.trim()) return;

      if (isLast) {
        setIsSubmitting(true);
        try {
          await onSubmit(
            Object.entries(payload).map(([question_id, v]) => ({
              question_id,
              value: v,
            }))
          );
          setIsComplete(true);
          notify.responseSubmitted();
        } catch {
          notify.error("Failed to submit response");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setDirection(1);
        setCurrentIndex((i) => i + 1);
      }
    },
    [answers, canProceed, currentQuestion, isLast, onSubmit]
  );

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const setAnswer = useCallback(
    (value: string, autoAdvance = false) => {
      if (!currentQuestion) return;
      setAnswers((prev) => {
        const next = { ...prev, [currentQuestion.id]: value };
        if (autoAdvance && value.trim()) {
          if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
          autoAdvanceRef.current = setTimeout(() => {
            if (isLast) {
              goNext(next);
            } else {
              setDirection(1);
              setCurrentIndex((i) => i + 1);
            }
          }, 400);
        }
        return next;
      });
    },
    [currentQuestion, goNext, isLast]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  useEffect(() => {
    setHighlightedOption(0);
    setInputFocused(false);
    const opts = currentQuestion?.options ?? [];
    const idx = opts.findIndex((o) => o === currentValue);
    if (idx >= 0) setHighlightedOption(idx);
  }, [currentIndex, currentQuestion, currentValue]);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 280);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete || !currentQuestion) return;

      const options = currentQuestion.options ?? [];
      const isChoice = isChoiceType(currentQuestion.type);
      const isRating = currentQuestion.type === "rating";

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
        return;
      }

      if (e.key === "ArrowRight" && canProceed) {
        e.preventDefault();
        goNext();
        return;
      }

      if (e.key === "Enter") {
        if (currentQuestion.type === "long_text" && e.shiftKey) return;
        e.preventDefault();
        if (isChoice && options.length > 0 && !currentValue.trim()) {
          setAnswer(options[highlightedOption], true);
          return;
        }
        if (canProceed) goNext();
        return;
      }

      if (isChoice && options.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedOption((i) => Math.min(i + 1, options.length - 1));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedOption((i) => Math.max(i - 1, 0));
          return;
        }
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= options.length) {
          e.preventDefault();
          setAnswer(options[num - 1], true);
          return;
        }
        const letterIndex = e.key.toLowerCase().charCodeAt(0) - 97;
        if (letterIndex >= 0 && letterIndex < options.length) {
          e.preventDefault();
          setAnswer(options[letterIndex], true);
        }
      }

      if (isRating) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 5) {
          e.preventDefault();
          setAnswer(String(num), true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    canProceed,
    currentQuestion,
    currentValue,
    goBack,
    goNext,
    highlightedOption,
    isComplete,
    setAnswer,
  ]);

  const gradientClass = GRADIENTS[currentIndex % GRADIENTS.length];

  if (isComplete) {
    return (
      <div className={cn("fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center", gradientClass)}>
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-3xl text-white shadow-xl"
          >
            ✓
          </motion.div>
          <h2 className="mt-8 text-3xl font-light tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Thanks for your response!
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Your answers have been recorded.</p>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 flex h-[100dvh] items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-lg text-gray-500 dark:text-gray-400">This form has no questions yet.</p>
      </div>
    );
  }

  const enterHintText =
    currentQuestion.type === "long_text"
      ? "Shift + Enter for new line · Enter ↵ to continue"
      : isChoiceType(currentQuestion.type) && currentQuestion.type !== "dropdown"
        ? "↑↓ to navigate · Enter ↵ to select"
        : "Press Enter ↵ to continue";

  const questionTitleId = `question-title-${currentQuestion.id}`;
  const keyboardHintId = `keyboard-hint-${currentQuestion.id}`;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden transition-colors duration-500",
        gradientClass
      )}
    >
      <form
        aria-label={formTitle ? `${formTitle} form` : "Survey form"}
        onSubmit={(e) => {
          e.preventDefault();
          if (canProceed && !isSubmitting) goNext();
        }}
        className="flex min-h-0 flex-1 flex-col"
      >
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 safe-top sm:px-10 sm:py-16 md:px-16">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="space-y-10 sm:space-y-12"
            >
              {currentIndex === 0 && formTitle && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="mb-2"
                >
                  <p className="text-sm font-normal tracking-wide text-gray-600 dark:text-gray-400 sm:text-base">
                    {formTitle}
                  </p>
                  {formDescription && (
                    <p className="mt-2 max-w-2xl text-base font-light text-gray-600 dark:text-gray-400 sm:text-lg">
                      {formDescription}
                    </p>
                  )}
                </motion.div>
              )}

              <div>
                <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400 sm:text-base" aria-hidden>
                  {currentIndex + 1}
                  <span className="mx-2">→</span>
                </p>
                <h2
                  id={questionTitleId}
                  className="text-[2rem] font-light leading-[1.15] tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-[3.25rem]"
                >
                  {currentQuestion.title}
                  {currentQuestion.required && (
                    <>
                      <span className="text-red-600" aria-hidden>
                        {" "}
                        *
                      </span>
                      <span className="sr-only"> (required)</span>
                    </>
                  )}
                </h2>
                {currentQuestion.description && (
                  <p className="mt-4 max-w-2xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400 sm:mt-5 sm:text-xl">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              <motion.div
                animate={inputFocused ? { scale: 1.005 } : { scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <QuestionInput
                  ref={inputRef}
                  question={currentQuestion}
                  value={currentValue}
                  highlightedOption={highlightedOption}
                  onHighlightOption={setHighlightedOption}
                  onChange={setAnswer}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  questionTitleId={questionTitleId}
                  keyboardHintId={keyboardHintId}
                />
              </motion.div>

              <motion.p
                id={keyboardHintId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-gray-600 dark:text-gray-400 sm:text-base"
              >
                {enterHintText}
                <span className="mx-3 hidden text-gray-300 dark:text-gray-600 sm:inline">·</span>
                <span className="hidden text-gray-400 dark:text-gray-500 sm:inline">
                  ← → to navigate
                </span>
              </motion.p>

              <div className="flex flex-wrap items-center gap-3 pt-2 sm:hidden">
                {currentIndex > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="touch-target focus-ring text-sm font-medium text-gray-600 underline-offset-2 hover:underline dark:text-gray-400"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!canProceed || isSubmitting}
                  className="typeform-ok-btn touch-target focus-ring"
                >
                  {isSubmitting && <Spinner size="xs" className="border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900" />}
                  {isSubmitting ? "Submitting..." : isLast ? "Submit" : "OK"}
                </button>
              </div>

              <div className="hidden pt-4 sm:block">
                <button
                  type="submit"
                  disabled={!canProceed || isSubmitting}
                  className="typeform-ok-btn focus-ring"
                >
                  {isSubmitting && <Spinner size="xs" className="border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900" />}
                  {isSubmitting ? "Submitting..." : isLast ? "Submit" : "OK"}
                  <span className="ml-1 text-xs opacity-70">↵</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="shrink-0 safe-bottom">
        <div className="flex items-center justify-between px-4 pb-3 pt-2 sm:px-8">
          <span className="text-xs font-normal text-gray-600 dark:text-gray-400" aria-live="polite">
            {currentIndex + 1} of {questions.length}
          </span>
          <div className="hidden items-center gap-4 sm:flex">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="focus-ring text-xs font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ← Previous
              </button>
            )}
          </div>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Form progress"
          className="h-1 w-full bg-black/[0.06] dark:bg-white/[0.08]"
        >
          <div
            className="h-full bg-gray-900 transition-[width] duration-300 ease-out dark:bg-gray-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      </form>
    </div>
  );
}

interface QuestionInputProps {
  question: Question;
  value: string;
  highlightedOption: number;
  onHighlightOption: (index: number) => void;
  onChange: (value: string, autoAdvance?: boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  questionTitleId: string;
  keyboardHintId: string;
}

const QuestionInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  QuestionInputProps
>(function QuestionInput(
  {
    question,
    value,
    highlightedOption,
    onHighlightOption,
    onChange,
    onFocus,
    onBlur,
    questionTitleId,
    keyboardHintId,
  },
  ref
) {
  const choiceGroupId = useId();
  const sharedInputProps = {
    "aria-labelledby": questionTitleId,
    "aria-describedby": keyboardHintId,
    "aria-required": question.required || undefined,
  };

  switch (question.type) {
    case "long_text":
      return (
        <motion.textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          rows={3}
          placeholder="Type your answer here..."
          initial={false}
          animate={{ borderColor: value ? "rgba(17,24,39,0.5)" : "rgba(17,24,39,0.2)" }}
          className="typeform-input-line resize-none sm:min-h-[120px]"
          {...sharedInputProps}
        />
      );

    case "multiple_choice":
    case "yes_no":
      return (
        <div
          role="radiogroup"
          id={choiceGroupId}
          aria-labelledby={questionTitleId}
          aria-describedby={keyboardHintId}
          aria-required={question.required || undefined}
          className="space-y-3"
        >
          {question.options?.map((option, index) => {
            const isSelected = value === option;
            const isHighlighted = highlightedOption === index;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={option}
                tabIndex={isSelected || isHighlighted ? 0 : -1}
                onMouseEnter={() => onHighlightOption(index)}
                onClick={() => onChange(option, true)}
                onFocus={() => onHighlightOption(index)}
                className={cn(
                  "typeform-choice touch-target focus-ring",
                  (isSelected || isHighlighted) && "typeform-choice-selected"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded border-2 text-sm font-semibold transition-colors duration-200",
                    isSelected
                      ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                      : "border-gray-400 text-gray-600 dark:border-gray-500 dark:text-gray-400"
                  )}
                  aria-hidden
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-lg font-light text-gray-900 dark:text-gray-100 sm:text-xl">{option}</span>
              </button>
            );
          })}
        </div>
      );

    case "dropdown":
      return (
        <motion.select
          value={value}
          onChange={(e) => onChange(e.target.value, !!e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          initial={false}
          animate={{ borderColor: value ? "rgba(17,24,39,0.6)" : "rgba(17,24,39,0.2)" }}
          className="typeform-input-line focus-ring cursor-pointer appearance-none rounded-none pr-8"
          {...sharedInputProps}
        >
          <option value="">Type or select an option</option>
          {question.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </motion.select>
      );

    case "rating":
      return (
        <div
          role="radiogroup"
          aria-labelledby={questionTitleId}
          aria-describedby={keyboardHintId}
          aria-required={question.required || undefined}
          className="flex flex-wrap gap-3 sm:gap-4"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const isSelected = value === String(n);
            return (
              <motion.button
                key={n}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Rate ${n} out of 5`}
                onClick={() => onChange(String(n), true)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  scale: isSelected ? 1.08 : 1,
                  backgroundColor: isSelected ? "rgb(17 24 39)" : "rgba(255,255,255,0.5)",
                  color: isSelected ? "#fff" : "rgb(17 24 39)",
                  borderColor: isSelected ? "rgb(17 24 39)" : "rgba(17,24,39,0.15)",
                }}
                transition={{ duration: 0.2 }}
                className="touch-target focus-ring flex h-14 w-14 items-center justify-center rounded-xl border-2 text-xl font-light sm:h-16 sm:w-16 sm:text-2xl"
              >
                {n}
              </motion.button>
            );
          })}
        </div>
      );

    default:
      return (
        <motion.input
          ref={ref as React.Ref<HTMLInputElement>}
          type={
            question.type === "email"
              ? "email"
              : question.type === "number"
                ? "number"
                : "text"
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={
            question.type === "email" ? "name@example.com" : "Type your answer here..."
          }
          initial={false}
          animate={{
            borderColor: value ? "rgba(17,24,39,0.55)" : "rgba(17,24,39,0.2)",
          }}
          transition={{ duration: 0.25 }}
          className="typeform-input-line"
          {...sharedInputProps}
        />
      );
  }
});
