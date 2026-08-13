"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useFormResults } from "@/components/results/FormResultsProvider";
import { ResultsPageShell } from "@/components/results/ResultsLayout";
import { AnalyticsSummarySkeleton } from "@/components/loading/PageSkeletons";
import { StatCard } from "@/components/results/analytics/StatCard";
import { staggerContainer, transition } from "@/lib/motion";

const ResponseTimelineChart = dynamic(
  () =>
    import("@/components/results/analytics/ResponseTimelineChart").then(
      (module) => module.ResponseTimelineChart
    ),
  { ssr: false, loading: () => <AnalyticsSummarySkeleton /> }
);

const QuestionAnalyticsCard = dynamic(
  () =>
    import("@/components/results/analytics/QuestionAnalyticsCard").then(
      (module) => module.QuestionAnalyticsCard
    ),
  { ssr: false }
);

export default function FormResultsSummaryPage() {
  const { analytics, isLoading } = useFormResults();

  if (isLoading || !analytics) {
    return (
      <ResultsPageShell>
        <AnalyticsSummarySkeleton />
      </ResultsPageShell>
    );
  }

  return (
    <ResultsPageShell>
      {analytics.total_responses === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-400">
            No responses yet. Publish your form and share the link.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div
              variants={{
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0, transition },
              }}
            >
              <StatCard
                label="Total responses"
                value={analytics.total_responses}
                hint="All form submissions"
                icon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path d="M10 2a6 6 0 00-6 6v1H3a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1v-8a1 1 0 00-1-1h-1V8a6 6 0 00-6-6zm-4 7V8a4 4 0 118 0v1H6z" />
                  </svg>
                }
              />
            </motion.div>
            <motion.div
              variants={{
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0, transition: { ...transition, delay: 0.04 } },
              }}
            >
              <StatCard
                label="Completion rate"
                value={`${analytics.completion_rate}%`}
                hint={`${analytics.completed_responses} fully completed`}
                icon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </motion.div>
            <motion.div
              variants={{
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0, transition: { ...transition, delay: 0.08 } },
              }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <StatCard
                label="Questions"
                value={analytics.total_questions}
                hint="Tracked in this form"
                icon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
          >
            <ResponseTimelineChart data={analytics.response_timeline} />
          </motion.div>

          <div className="grid gap-6">
            {analytics.questions.map((question, index) => (
              <QuestionAnalyticsCard key={question.question_id} question={question} index={index} />
            ))}
          </div>
        </div>
      )}
    </ResultsPageShell>
  );
}
