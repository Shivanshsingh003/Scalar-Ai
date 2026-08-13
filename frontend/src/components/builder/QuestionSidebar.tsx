"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Question } from "@/types";
import { getQuestionTypeConfig } from "@/lib/questionTypes";
import { QuestionTypeIcon } from "@/components/builder/QuestionTypeIcon";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface QuestionSidebarProps {
  questions: Question[];
  activeQuestionId: string | null;
  onSelect: (id: string) => void;
}

export function QuestionSidebar({
  questions,
  activeQuestionId,
  onSelect,
}: QuestionSidebarProps) {
  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 md:px-4">
      {questions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center"
        >
          <p className="text-sm font-medium text-white/70">No questions yet</p>
          <p className="mt-1.5 text-xs text-white/50">Tap + below to add one</p>
        </motion.div>
      ) : (
        <motion.ul layout className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {questions.map((question, index) => (
              <SortableQuestionItem
                key={question.id}
                question={question}
                index={index}
                isActive={question.id === activeQuestionId}
                onSelect={() => onSelect(question.id)}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

function SortableQuestionItem({
  question,
  index,
  isActive,
  onSelect,
}: {
  question: Question;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition: dndTransition, isDragging } =
    useSortable({ id: question.id });

  const typeConfig = getQuestionTypeConfig(question.type);

  return (
    <motion.li
      ref={setNodeRef}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: -24,
        scale: 0.95,
        height: 0,
        marginBottom: 0,
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={transition}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: dndTransition,
      }}
      className={cn(isDragging && "z-10")}
    >
      <motion.div
        animate={
          isActive
            ? {
                borderColor: "rgba(59, 130, 246, 0.95)",
                boxShadow: "0 4px 16px rgba(59, 130, 246, 0.28), 0 0 0 1px rgba(59, 130, 246, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }
            : {
                borderColor: "rgba(255, 255, 255, 0.06)",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
              }
        }
        whileHover={
          !isActive && !isDragging
            ? {
                y: -2,
                borderColor: "rgba(255, 255, 255, 0.14)",
                backgroundColor: "rgba(255, 255, 255, 0.07)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }
            : undefined
        }
        whileTap={!isDragging ? { scale: 0.985 } : undefined}
        transition={transition}
        className={cn(
          "group relative flex min-h-[64px] items-start gap-2.5 rounded-2xl border-2 p-4",
          isDragging && "scale-[1.02] opacity-95 shadow-2xl shadow-black/40"
        )}
      >
        <button
          type="button"
          className="touch-target mt-0.5 flex cursor-grab touch-none items-center justify-center rounded-xl p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/90 active:cursor-grabbing"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
            <circle cx="5" cy="4" r="1.2" />
            <circle cx="11" cy="4" r="1.2" />
            <circle cx="5" cy="8" r="1.2" />
            <circle cx="11" cy="8" r="1.2" />
            <circle cx="5" cy="12" r="1.2" />
            <circle cx="11" cy="12" r="1.2" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onSelect}
          aria-current={isActive ? "true" : undefined}
          className="touch-target flex min-w-0 flex-1 items-start gap-3 py-0.5 text-left"
        >
          <motion.span
            animate={isActive ? { scale: 1.05 } : { scale: 1 }}
            transition={transition}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl transition-colors",
              isActive ? "bg-blue-500/25 text-blue-100" : "bg-white/10 text-white/70"
            )}
          >
            <QuestionTypeIcon type={question.type} size="md" />
          </motion.span>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/55">
                Q{index + 1}
              </span>
              {question.required && (
                <span className="rounded-lg bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/65">
                  Required
                </span>
              )}
            </div>
            <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-white/95">
              {question.title || "Untitled question"}
            </p>
            <p className="mt-1 text-xs text-white/50">{typeConfig.label}</p>
          </div>
        </button>
      </motion.div>
    </motion.li>
  );
}
