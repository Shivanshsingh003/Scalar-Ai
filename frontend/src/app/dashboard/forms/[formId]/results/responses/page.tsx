"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/handle-api-error";
import { FormResponse } from "@/types";
import { ResultsPageShell } from "@/components/results/ResultsLayout";
import { ResponsesTableSkeleton } from "@/components/loading/PageSkeletons";
import { ResponsesTable } from "@/components/results/ResponsesTable";
import { transition } from "@/lib/motion";
import { useFormResults } from "@/components/results/FormResultsProvider";

export default function IndividualResponsesPage() {
  const { formId } = useFormResults();
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.forms
      .listResponses(formId)
      .then((data) => {
        if (!cancelled) setResponses(data);
      })
      .catch((error) => {
        if (!cancelled) handleApiError(error, "Failed to load responses");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formId]);

  if (isLoading) {
    return (
      <ResultsPageShell>
        <ResponsesTableSkeleton />
      </ResultsPageShell>
    );
  }

  if (responses.length === 0) {
    return (
      <ResultsPageShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
          className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <p className="text-gray-600 dark:text-gray-400">No individual responses yet.</p>
        </motion.div>
      </ResultsPageShell>
    );
  }

  return (
    <ResultsPageShell>
      <ResponsesTable formId={formId} responses={responses} />
    </ResultsPageShell>
  );
}
