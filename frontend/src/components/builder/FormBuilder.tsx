"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toast";
import { api } from "@/lib/api";
import { getDefaultOptions, typeHasOptions } from "@/lib/questionTypes";
import { pressable, transition } from "@/lib/motion";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Form, Question, QuestionType } from "@/types";
import { BuilderToolbar } from "@/components/builder/BuilderToolbar";
import { QuestionSidebar } from "@/components/builder/QuestionSidebar";
import { QuestionEditor } from "@/components/builder/QuestionEditor";
import { AddQuestionPanel } from "@/components/builder/AddQuestionPanel";
import { PublishModal } from "@/components/builder/PublishModal";
import { BuilderSkeleton } from "@/components/loading/PageSkeletons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface FormBuilderProps {
  formId: string;
}

export function FormBuilder({ formId }: FormBuilderProps) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmDeleteQuestionId, setConfirmDeleteQuestionId] = useState<string | null>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (isDesktop) setSidebarOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen, isDesktop]);

  useEffect(() => {
    if (!showAddPanel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showAddPanel]);

  const handleSelectQuestion = (id: string) => {
    setActiveQuestionId(id);
    if (!isDesktop) setSidebarOpen(false);
  };

  useEffect(() => {
    api.forms
      .get(formId)
      .then((data) => {
        setForm(data);
        if (data.questions?.length) {
          setActiveQuestionId(data.questions[0].id);
        }
      })
      .catch(() => router.push("/dashboard"));
  }, [formId, router]);

  const questions = useMemo(
    () => [...(form?.questions ?? [])].sort((a, b) => a.order - b.order),
    [form?.questions]
  );

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) ?? null;

  const markSaving = useCallback(() => setSaveStatus("saving"), []);
  const markSaved = useCallback((options?: { silent?: boolean }) => {
    setSaveStatus("saved");
    if (!options?.silent) {
      notify.formSaved();
    }
  }, []);
  const markError = useCallback((message = "Failed to save changes") => {
    setSaveStatus("error");
    notify.error(message);
  }, []);

  const debouncedSaveForm = useDebouncedCallback(
    async (updates: { title?: string; description?: string | null }) => {
      markSaving();
      try {
        const updated = await api.forms.update(formId, updates);
        setForm((prev) => (prev ? { ...prev, ...updated, questions: prev.questions } : prev));
        markSaved();
      } catch {
        markError();
      }
    },
    600
  );

  const debouncedSaveQuestion = useDebouncedCallback(
    async (questionId: string, updates: Record<string, unknown>) => {
      markSaving();
      try {
        const updated = await api.forms.updateQuestion(formId, questionId, updates);
        setForm((prev) =>
          prev
            ? {
                ...prev,
                questions: prev.questions?.map((q) => (q.id === questionId ? updated : q)),
              }
            : prev
        );
        markSaved();
      } catch {
        markError();
      }
    },
    600
  );

  const saveQuestionNow = useCallback(
    async (questionId: string, updates: Record<string, unknown>) => {
      markSaving();
      try {
        const updated = await api.forms.updateQuestion(formId, questionId, updates);
        setForm((prev) =>
          prev
            ? {
                ...prev,
                questions: prev.questions?.map((q) => (q.id === questionId ? updated : q)),
              }
            : prev
        );
        markSaved();
      } catch {
        markError();
      }
    },
    [formId, markError, markSaved, markSaving]
  );

  const updateFormField = (updates: Partial<Pick<Form, "title" | "description">>) => {
    setForm((prev) => (prev ? { ...prev, ...updates } : prev));
    debouncedSaveForm(updates);
  };

  const updateQuestionLocal = (questionId: string, updates: Partial<Question>) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions?.map((q) =>
              q.id === questionId ? { ...q, ...updates } : q
            ),
          }
        : prev
    );
  };

  const handleQuestionChange = (questionId: string, updates: Partial<Question>) => {
    updateQuestionLocal(questionId, updates);

    const payload: Record<string, unknown> = {};
    if ("title" in updates) payload.title = updates.title;
    if ("description" in updates) payload.description = updates.description;
    if ("required" in updates) payload.required = updates.required;
    if ("options" in updates) payload.options = updates.options;

    if ("type" in updates && updates.type) {
      const type = updates.type;
      const patch: Record<string, unknown> = { type };
      if (typeHasOptions(type)) {
        patch.options = updates.options ?? getDefaultOptions(type);
      } else {
        patch.options = null;
      }
      saveQuestionNow(questionId, patch);
      return;
    }

    if ("required" in updates) {
      saveQuestionNow(questionId, payload);
      return;
    }

    if (Object.keys(payload).length > 0) {
      debouncedSaveQuestion(questionId, payload);
    }
  };

  const handleAddQuestion = async (type: QuestionType) => {
    markSaving();
    try {
      const question = await api.forms.addQuestion(formId, {
        type,
        title: "Your question here. Recall a memory?",
        description: "",
        order: questions.length,
        options: getDefaultOptions(type) ?? undefined,
      });
      setForm((prev) =>
        prev ? { ...prev, questions: [...(prev.questions ?? []), question] } : prev
      );
      setActiveQuestionId(question.id);
      setShowAddPanel(false);
      markSaved({ silent: true });
      notify.questionAdded();
    } catch {
      markError("Failed to add question");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    markSaving();
    try {
      await api.forms.deleteQuestion(formId, questionId);
      const remaining = questions
        .filter((q) => q.id !== questionId)
        .map((q, index) => ({ ...q, order: index }));

      setForm((prev) => (prev ? { ...prev, questions: remaining } : prev));

      if (activeQuestionId === questionId) {
        setActiveQuestionId(remaining[0]?.id ?? null);
      }

      await Promise.all(
        remaining.map((q, index) =>
          api.forms.updateQuestion(formId, q.id, { order: index })
        )
      );
      markSaved({ silent: true });
      notify.questionDeleted();
    } catch {
      markError("Failed to delete question");
    }
  };

  const persistQuestionOrder = async (ordered: Question[]) => {
    markSaving();
    try {
      await Promise.all(
        ordered.map((q, index) => api.forms.updateQuestion(formId, q.id, { order: index }))
      );
      setForm((prev) =>
        prev
          ? {
              ...prev,
              questions: ordered.map((q, index) => ({ ...q, order: index })),
            }
          : prev
      );
      markSaved();
    } catch {
      markError("Failed to reorder questions");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    const reordered = arrayMove(questions, oldIndex, newIndex).map((q, index) => ({
      ...q,
      order: index,
    }));

    setForm((prev) => (prev ? { ...prev, questions: reordered } : prev));
    persistQuestionOrder(reordered);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    markSaving();
    try {
      const updated = await api.forms.publish(formId);
      setForm((prev) => (prev ? { ...prev, is_published: updated.is_published } : prev));
      markSaved({ silent: true });
      notify.published();
    } catch {
      markError("Failed to publish form");
      throw new Error("Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setIsUnpublishing(true);
    markSaving();
    try {
      const updated = await api.forms.unpublish(formId);
      setForm((prev) => (prev ? { ...prev, is_published: updated.is_published } : prev));
      markSaved({ silent: true });
      notify.unpublished();
    } catch {
      markError("Failed to unpublish form");
      throw new Error("Failed to unpublish");
    } finally {
      setIsUnpublishing(false);
    }
  };

  if (!form) {
    return <BuilderSkeleton />;
  }

  const isBusy = saveStatus === "saving" || isPublishing || isUnpublishing;

  return (
    <div className="flex h-[100dvh] flex-col bg-[#fafafa] dark:bg-gray-950">
      <BuilderToolbar
        form={form}
        formId={formId}
        saveStatus={saveStatus}
        isBusy={isBusy}
        sidebarOpen={sidebarOpen}
        onBack={() => router.push("/dashboard")}
        onOpenPublishModal={() => setShowPublishModal(true)}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        form={form}
        isPublishing={isPublishing}
        isUnpublishing={isUnpublishing}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
      />

      <div className={cn("relative flex min-h-0 flex-1", isBusy && "pointer-events-none opacity-95")}>
        <AnimatePresence>
          {sidebarOpen && !isDesktop && (
            <motion.button
              type="button"
              aria-label="Close sidebar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            />
          )}
        </AnimatePresence>

        <aside
          aria-label="Questions sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[min(280px,88vw)] flex-col bg-[#1a1a1a] font-sans text-white shadow-xl shadow-black/25 transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-[280px] lg:shrink-0 lg:translate-x-0",
            sidebarOpen || isDesktop ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="shrink-0 border-b border-white/[0.08] px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="flex items-center justify-between lg:block">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                  Content
                </p>
                <p className="mt-1 text-sm font-medium text-white/90">
                  {questions.length} {questions.length === 1 ? "question" : "questions"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="touch-target flex items-center justify-center rounded-2xl text-white/50 hover:bg-white/10 lg:hidden"
                aria-label="Close questions panel"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                <QuestionSidebar
                  questions={questions}
                  activeQuestionId={activeQuestionId}
                  onSelect={handleSelectQuestion}
                />
              </SortableContext>
            </DndContext>
          </div>

          <div className="shrink-0 border-t border-white/[0.08] px-4 py-5 safe-bottom">
            <div className="flex justify-center">
              <motion.button
                type="button"
                onClick={() => {
                  setShowAddPanel(true);
                  if (!isDesktop) setSidebarOpen(false);
                }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={pressable.whileTap}
                transition={transition}
                className="pointer-events-auto flex h-14 w-14 touch-target items-center justify-center rounded-2xl bg-white text-gray-900 shadow-card-hover ring-1 ring-white/20 hover:bg-gray-50 dark:bg-gray-100 dark:text-gray-900"
                aria-label="Add question"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </motion.button>
            </div>
          </div>
        </aside>

        <main
          id="main-content"
          className="relative min-w-0 flex-1 overflow-y-auto bg-gradient-to-br from-white via-[#fafafa] to-[#f0f0f0] dark:from-gray-900 dark:via-gray-950 dark:to-gray-950"
        >
          <AnimatePresence>
            {showAddPanel && (
              <AddQuestionPanel
                onAdd={handleAddQuestion}
                onClose={() => setShowAddPanel(false)}
              />
            )}
          </AnimatePresence>

          {activeQuestion ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuestion.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <QuestionEditor
                  question={activeQuestion}
                  questionIndex={questions.findIndex((q) => q.id === activeQuestion.id)}
                  formTitle={form.title}
                  formDescription={form.description}
                  onFormTitleChange={(title) => updateFormField({ title })}
                  onFormDescriptionChange={(description) => updateFormField({ description })}
                  onChange={(updates) => handleQuestionChange(activeQuestion.id, updates)}
                  onDelete={() => setConfirmDeleteQuestionId(activeQuestion.id)}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center px-6 py-12 text-center md:px-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
                className="w-full max-w-md rounded-2xl bg-white p-10 shadow-card ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 shadow-sm dark:bg-gray-800 dark:text-gray-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <p className="mt-5 text-xl font-light tracking-tight text-gray-900 dark:text-gray-100">No questions yet</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Use the + button in the sidebar to add your first question.
                </p>
                <motion.button
                  type="button"
                  onClick={() => {
                    if (!isDesktop) setSidebarOpen(true);
                    else setShowAddPanel(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={pressable.whileTap}
                  className="touch-target mt-6 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-card hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  {isDesktop ? "Add question" : "Open sidebar"}
                </motion.button>
              </motion.div>
            </div>
          )}

          {!isDesktop && !sidebarOpen && questions.length > 0 && (
            <motion.button
              type="button"
              onClick={() => setSidebarOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={pressable.whileTap}
              className="fixed bottom-6 left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 touch-target items-center justify-center rounded-2xl bg-gray-900 text-white shadow-card-hover safe-bottom dark:bg-white dark:text-gray-900 lg:hidden"
              aria-label="Open questions sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </motion.button>
          )}
        </main>
      </div>

      <ConfirmDialog
        open={confirmDeleteQuestionId !== null}
        title="Delete question?"
        description={
          confirmDeleteQuestionId
            ? `Delete "${questions.find((q) => q.id === confirmDeleteQuestionId)?.title ?? "this question"}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="danger"
        onCancel={() => setConfirmDeleteQuestionId(null)}
        onConfirm={() => {
          if (confirmDeleteQuestionId) {
            void handleDeleteQuestion(confirmDeleteQuestionId);
          }
          setConfirmDeleteQuestionId(null);
        }}
      />
    </div>
  );
}
