import { QuestionType } from "@/types";

export interface QuestionTypeConfig {
  value: QuestionType;
  label: string;
  icon: string;
  hasOptions: boolean;
  defaultOptions?: string[];
}

export const QUESTION_TYPES: QuestionTypeConfig[] = [
  { value: "short_text", label: "Short text", icon: "Aa", hasOptions: false },
  { value: "long_text", label: "Long text", icon: "¶", hasOptions: false },
  { value: "email", label: "Email", icon: "@", hasOptions: false },
  { value: "number", label: "Number", icon: "#", hasOptions: false },
  { value: "multiple_choice", label: "Multiple choice", icon: "○", hasOptions: true, defaultOptions: ["Option 1", "Option 2"] },
  { value: "dropdown", label: "Dropdown", icon: "▾", hasOptions: true, defaultOptions: ["Option 1", "Option 2", "Option 3"] },
  { value: "yes_no", label: "Yes / No", icon: "✓", hasOptions: true, defaultOptions: ["Yes", "No"] },
  { value: "rating", label: "Rating", icon: "★", hasOptions: false },
];

export function getQuestionTypeConfig(type: QuestionType): QuestionTypeConfig {
  return QUESTION_TYPES.find((t) => t.value === type) ?? QUESTION_TYPES[0];
}

export function getDefaultOptions(type: QuestionType): string[] | null {
  const config = getQuestionTypeConfig(type);
  return config.defaultOptions ?? null;
}

export function typeHasOptions(type: QuestionType): boolean {
  return getQuestionTypeConfig(type).hasOptions;
}
