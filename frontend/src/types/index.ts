export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "dropdown"
  | "yes_no"
  | "checkbox"
  | "email"
  | "number"
  | "rating";

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string | null;
  required: boolean;
  order: number;
  options: string[] | null;
}

export interface Form {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  questions?: Question[];
}

export interface FormSummary {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  is_published: boolean;
  response_count: number;
  created_at: string;
  updated_at: string;
}

export interface AnswerSubmit {
  question_id: string;
  value: string;
}

export interface ResponseSubmit {
  answers: AnswerSubmit[];
}

export interface ApiError {
  detail: string;
}

export interface AnswerCount {
  value: string;
  count: number;
}

export interface TimelinePoint {
  date: string;
  count: number;
}

export interface QuestionAnalytics {
  question_id: string;
  title: string;
  type: string;
  total_answers: number;
  answer_counts: AnswerCount[] | null;
}

export interface FormAnalytics {
  form_id: string;
  title: string;
  total_responses: number;
  total_questions: number;
  completed_responses: number;
  completion_rate: number;
  response_timeline: TimelinePoint[];
  questions: QuestionAnalytics[];
}

export interface FormResponse {
  id: string;
  form_id: string;
  submitted_at: string;
  answers: { id: string; question_id: string; value: string }[];
}
