import { Question } from "@/types";
import { cn } from "@/lib/utils";

interface QuestionPreviewProps {
  question: Question;
}

export function QuestionPreview({ question }: QuestionPreviewProps) {
  return (
    <div className="mt-10 border-t border-gray-100 pt-10 dark:border-gray-800">
      <p className="mb-6 text-typeform-label uppercase text-gray-500 dark:text-gray-400">Live preview</p>
      <PreviewInput question={question} />
    </div>
  );
}

function PreviewInput({ question }: { question: Question }) {
  switch (question.type) {
    case "long_text":
      return (
        <div className="typeform-input-line text-gray-400 dark:text-gray-500">Type your answer here...</div>
      );

    case "email":
      return <div className="typeform-input-line text-gray-400 dark:text-gray-500">name@example.com</div>;

    case "number":
      return <div className="typeform-input-line text-gray-400 dark:text-gray-500">42</div>;

    case "multiple_choice":
    case "yes_no":
    case "checkbox":
      return (
        <div className="space-y-3">
          {(question.options ?? []).map((option, index) => (
            <div key={option} className="typeform-choice cursor-default">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded border-2 border-gray-400 text-sm font-semibold text-gray-600 dark:border-gray-500 dark:text-gray-400"
                aria-hidden
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-lg font-light text-gray-900 dark:text-gray-100">{option}</span>
            </div>
          ))}
        </div>
      );

    case "dropdown":
      return (
        <div className="typeform-input-line flex items-center justify-between text-gray-400 dark:text-gray-500">
          <span>Type or select an option</span>
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path d="M4.5 6.5L8 10l3.5-3.5" />
          </svg>
        </div>
      );

    case "rating":
      return (
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl border-2 border-gray-900/15",
                "bg-white text-xl font-light text-gray-900 dark:border-gray-100/15 dark:bg-gray-900 dark:text-gray-100"
              )}
            >
              {n}
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="typeform-input-line text-gray-400 dark:text-gray-500">Type your answer here...</div>
      );
  }
}
