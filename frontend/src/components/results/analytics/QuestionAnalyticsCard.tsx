"use client";

import { motion } from "framer-motion";
import { QuestionAnalytics } from "@/types";
import { AnalyticsCard } from "@/components/results/analytics/StatCard";
import { MultipleChoicePieChart } from "@/components/results/analytics/MultipleChoicePieChart";
import { RatingBarChart } from "@/components/results/analytics/RatingBarChart";
import { fadeInUp, transition } from "@/lib/motion";

const PIE_TYPES = new Set(["multiple_choice", "dropdown", "yes_no"]);
const BAR_TYPES = new Set(["rating"]);

interface QuestionAnalyticsCardProps {
  question: QuestionAnalytics;
  index: number;
}

export function QuestionAnalyticsCard({ question, index }: QuestionAnalyticsCardProps) {
  const typeLabel = question.type.replace(/_/g, " ");
  const hasChartData = question.answer_counts && question.answer_counts.length > 0;

  return (
    <motion.div {...fadeInUp} transition={{ ...transition, delay: index * 0.04 }}>
      <AnalyticsCard
        subtitle={`Question ${index + 1} · ${typeLabel}`}
        title={question.title}
        badge={`${question.total_answers} answers`}
      >
        {!hasChartData ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {question.total_answers === 0
              ? "No responses yet for this question."
              : "Open-text responses — view under Individual Responses or export CSV."}
          </p>
        ) : PIE_TYPES.has(question.type) ? (
          <MultipleChoicePieChart data={question.answer_counts!} />
        ) : BAR_TYPES.has(question.type) ? (
          <RatingBarChart data={question.answer_counts!} />
        ) : (
          <MultipleChoicePieChart data={question.answer_counts!} />
        )}
      </AnalyticsCard>
    </motion.div>
  );
}
