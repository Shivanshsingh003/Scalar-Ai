import { QuestionType } from "@/types";
import { cn } from "@/lib/utils";

interface QuestionTypeIconProps {
  type: QuestionType;
  className?: string;
  size?: "sm" | "md";
}

export function QuestionTypeIcon({ type, className, size = "sm" }: QuestionTypeIconProps) {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  const icons: Record<QuestionType, React.ReactNode> = {
    short_text: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h12M4 12h8M4 17h10"
      />
    ),
    long_text: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h14M4 10h14M4 14h10M4 18h12"
      />
    ),
    email: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 8l6 4 6-4M4 16V8a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2z"
      />
    ),
    number: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 12h8M8 17h5" />
    ),
    multiple_choice: (
      <>
        <circle cx="8" cy="8" r="2.5" />
        <path strokeLinecap="round" d="M13 8h5M8 13v5" />
      </>
    ),
    dropdown: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h8M6 13h5M14 16l3-3-3-3" />
    ),
    yes_no: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12l3 3 7-7" />
    ),
    checkbox: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h10M6 8h6" />
    ),
    rating: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4l1.4 3.6H17l-2.8 2.1 1 3.5L12 11.8 8.8 13.2l1-3.5L7 7.6h3.6L12 4z"
      />
    ),
  };

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={cn(sizeClass, className)}
      aria-hidden
    >
      {icons[type]}
    </svg>
  );
}
