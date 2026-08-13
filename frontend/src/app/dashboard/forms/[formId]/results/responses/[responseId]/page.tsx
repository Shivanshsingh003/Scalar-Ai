"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/handle-api-error";
import { Form, FormResponse } from "@/types";
import { ResultsPageShell } from "@/components/results/ResultsLayout";
import { ResponseDetailSkeleton } from "@/components/loading/PageSkeletons";
import { formatDateTime } from "@/lib/format";
import { staggerContainer, transition } from "@/lib/motion";
import { useFormResults } from "@/components/results/FormResultsProvider";

export default function ResponseDetailPage() {
  const { responseId } = useParams<{ formId: string; responseId: string }>();
  const { formId } = useFormResults();
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [response, setResponse] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.forms.get(formId), api.forms.getResponse(formId, responseId)])
      .then(([formData, responseData]) => {
        if (cancelled) return;
        setForm(formData);
        setResponse(responseData);
      })
      .catch((error) => {
        if (cancelled) return;
        handleApiError(error, "Failed to load response");
        router.push(`/dashboard/forms/${formId}/results/responses`);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formId, responseId, router]);

  const questions = useMemo(
    () => [...(form?.questions ?? [])].sort((a, b) => a.order - b.order),
    [form?.questions]
  );

  const answerMap = useMemo(() => {
    if (!response) return {};
    return Object.fromEntries(response.answers.map((a) => [a.question_id, a.value]));
  }, [response]);

  if (isLoading || !form || !response) {
    return (
      <ResultsPageShell>
        <ResponseDetailSkeleton />
      </ResultsPageShell>
    );
  }

  return (
    <ResultsPageShell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition}>
        <Link
          href={`/dashboard/forms/${formId}/results/responses`}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          ← Back to all responses
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
              Submission
            </p>
            <p className="mt-1 font-mono text-sm text-gray-900 dark:text-gray-100" title={response.id}>
              {response.id}
            </p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Submitted {formatDateTime(response.submitted_at)}
          </div>
        </div>

        <motion.dl
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mt-6 space-y-6"
        >
          {questions.map((question, index) => {
            const answer = answerMap[question.id];
            return (
              <motion.div
                key={question.id}
                variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0, transition: { ...transition, delay: index * 0.04 } },
                }}
                className="border-b border-gray-50 pb-6 last:border-0 last:pb-0 dark:border-gray-900"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Question {index + 1} · {question.type.replace("_", " ")}
                </dt>
                <dd className="mt-1 text-base font-medium text-gray-900 dark:text-gray-100">{question.title}</dd>
                <motion.dd
                  whileHover={{ scale: 1.005 }}
                  transition={transition}
                  className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-800 dark:bg-gray-900/50 dark:text-gray-200"
                >
                  {answer ? (
                    answer
                  ) : (
                    <span className="italic text-gray-500 dark:text-gray-400">No answer provided</span>
                  )}
                </motion.dd>
              </motion.div>
            );
          })}
        </motion.dl>
      </motion.div>
    </ResultsPageShell>
  );
}
