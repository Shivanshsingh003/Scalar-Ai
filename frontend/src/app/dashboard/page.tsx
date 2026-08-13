"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { notify } from "@/lib/toast";
import { api } from "@/lib/api";
import { FormSummary } from "@/types";
import { Header } from "@/components/layout/Header";
import { DashboardHeaderSkeleton } from "@/components/loading/PageSkeletons";
import { FormCard } from "@/components/forms/FormCard";
import {
  DashboardEmptyState,
  DashboardNoResults,
  FormCardSkeleton,
} from "@/components/forms/DashboardEmptyState";
import { CreateFormButton, DashboardToolbar, SortOption } from "@/components/forms/DashboardToolbar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { staggerContainer, transition } from "@/lib/motion";

type Action = "duplicate" | "delete" | "publish" | "unpublish";

function sortForms(forms: FormSummary[], sort: SortOption): FormSummary[] {
  const sorted = [...forms];
  switch (sort) {
    case "updated_asc":
      return sorted.sort(
        (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      );
    case "title_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title_desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "updated_desc":
    default:
      return sorted.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }
}

function filterForms(forms: FormSummary[], query: string): FormSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return forms;
  return forms.filter(
    (f) =>
      f.title.toLowerCase().includes(q) ||
      (f.description?.toLowerCase().includes(q) ?? false)
  );
}

export default function DashboardPage() {
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [actionId, setActionId] = useState<{ id: string; action: Action } | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("updated_desc");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const loadForms = useCallback(async () => {
    try {
      const data = await api.forms.list();
      setForms(data);
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Failed to load forms");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const filteredForms = useMemo(
    () => sortForms(filterForms(forms, search), sort),
    [forms, search, sort]
  );

  const handleCreateForm = async () => {
    setIsCreating(true);
    try {
      const form = await api.forms.create({ title: "Untitled Form" });
      setForms((prev) => [{ ...form, response_count: 0 }, ...prev]);
      notify.formCreated();
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Failed to create form");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    setActionId({ id, action: "duplicate" });
    try {
      const duplicate = await api.forms.duplicate(id);
      setForms((prev) => [{ ...duplicate, response_count: 0 }, ...prev]);
      notify.formDuplicated();
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Failed to duplicate form");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionId({ id, action: "delete" });
    try {
      await api.forms.delete(id);
      setForms((prev) => prev.filter((f) => f.id !== id));
      notify.formDeleted();
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Failed to delete form");
    } finally {
      setActionId(null);
    }
  };

  const handlePublish = async (id: string) => {
    setActionId({ id, action: "publish" });
    try {
      const updated = await api.forms.publish(id);
      setForms((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, is_published: updated.is_published, updated_at: updated.updated_at }
            : f
        )
      );
      notify.published();
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Failed to publish form");
    } finally {
      setActionId(null);
    }
  };

  const handleUnpublish = async (id: string) => {
    setActionId({ id, action: "unpublish" });
    try {
      const updated = await api.forms.unpublish(id);
      setForms((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, is_published: updated.is_published, updated_at: updated.updated_at }
            : f
        )
      );
      notify.unpublished();
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Failed to unpublish form");
    } finally {
      setActionId(null);
    }
  };

  const totalResponses = forms.reduce((sum, f) => sum + f.response_count, 0);
  const publishedCount = forms.filter((f) => f.is_published).length;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <Header />

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 safe-top sm:px-6 sm:py-8 lg:px-8">
        {isLoading ? (
          <DashboardHeaderSkeleton />
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                Workspace
              </p>
              <h1 className="mt-1 text-3xl font-light tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                My forms
              </h1>
            </div>

            <CreateFormButton onClick={handleCreateForm} isCreating={isCreating} />
          </div>
        )}

        {!isLoading && forms.length > 0 && (
          <DashboardToolbar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            formCount={forms.length}
            totalResponses={totalResponses}
            publishedCount={publishedCount}
          />
        )}

        <section className={forms.length > 0 && !isLoading ? "mt-6" : "mt-8"}>
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <FormCardSkeleton key={i} />
              ))}
            </div>
          ) : forms.length === 0 ? (
            <DashboardEmptyState onCreateForm={handleCreateForm} isCreating={isCreating} />
          ) : filteredForms.length === 0 ? (
            <DashboardNoResults query={search} />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredForms.map((form, index) => (
                <motion.div
                  key={form.id}
                  layout
                  variants={{
                    initial: { opacity: 0, y: 16 },
                    animate: {
                      opacity: 1,
                      y: 0,
                      transition: { ...transition, delay: Math.min(index * 0.03, 0.24) },
                    },
                  }}
                >
                  <FormCard
                    form={form}
                    onDuplicate={handleDuplicate}
                    onDelete={(id) => setPendingDeleteId(id)}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    isDuplicating={actionId?.id === form.id && actionId.action === "duplicate"}
                    isDeleting={actionId?.id === form.id && actionId.action === "delete"}
                    isPublishing={actionId?.id === form.id && actionId.action === "publish"}
                    isUnpublishing={actionId?.id === form.id && actionId.action === "unpublish"}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete form?"
        description={
          pendingDeleteId
            ? `Delete "${forms.find((f) => f.id === pendingDeleteId)?.title ?? "this form"}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="danger"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            void handleDelete(pendingDeleteId);
          }
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}
