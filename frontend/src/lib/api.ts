import {
  FormAnalytics,
  FormResponse,
  FormSummary,
  Form as FormType,
  Question,
} from "@/types";
import { cached, invalidateCache } from "@/lib/api-cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new ApiClientError(error.detail ?? "Request failed", response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function invalidateFormCaches(formId?: string) {
  invalidateCache("forms:");
  if (formId) {
    invalidateCache(`form:${formId}`);
  }
}

export const api = {
  forms: {
    list: (): Promise<FormSummary[]> =>
      cached("forms:list", () => request<FormSummary[]>("/forms")),

    get: (id: string): Promise<FormType> =>
      cached(`form:${id}:detail`, () => request<FormType>(`/forms/${id}`)),

    create: async (data: { title: string; description?: string }): Promise<FormType> => {
      const form = await request<FormType>("/forms", { method: "POST", body: JSON.stringify(data) });
      invalidateFormCaches();
      return form;
    },

    update: async (
      id: string,
      data: { title?: string; description?: string | null; is_published?: boolean }
    ): Promise<FormType> => {
      const form = await request<FormType>(`/forms/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      invalidateFormCaches(id);
      return form;
    },

    delete: async (id: string) => {
      await request<void>(`/forms/${id}`, { method: "DELETE" });
      invalidateFormCaches(id);
    },

    duplicate: async (id: string): Promise<FormType> => {
      const form = await request<FormType>(`/forms/${id}/duplicate`, { method: "POST" });
      invalidateFormCaches();
      return form;
    },

    publish: (id: string): Promise<FormType> =>
      api.forms.update(id, { is_published: true }),

    unpublish: (id: string): Promise<FormType> =>
      api.forms.update(id, { is_published: false }),

    addQuestion: async (
      formId: string,
      data: {
        type: string;
        title: string;
        description?: string;
        required?: boolean;
        order?: number;
        options?: string[];
      }
    ): Promise<Question> => {
      const question = await request<Question>(`/forms/${formId}/questions`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      invalidateFormCaches(formId);
      return question;
    },

    updateQuestion: async (
      formId: string,
      questionId: string,
      data: Record<string, unknown>
    ): Promise<Question> => {
      const question = await request<Question>(`/forms/${formId}/questions/${questionId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      invalidateFormCaches(formId);
      return question;
    },

    deleteQuestion: async (formId: string, questionId: string) => {
      await request<void>(`/forms/${formId}/questions/${questionId}`, { method: "DELETE" });
      invalidateFormCaches(formId);
    },

    listResponses: (formId: string): Promise<FormResponse[]> =>
      cached(`form:${formId}:responses`, () => request<FormResponse[]>(`/forms/${formId}/responses`)),

    getResponse: (formId: string, responseId: string): Promise<FormResponse> =>
      cached(`form:${formId}:response:${responseId}`, () =>
        request<FormResponse>(`/forms/${formId}/responses/${responseId}`)
      ),

    getAnalytics: (formId: string): Promise<FormAnalytics> =>
      cached(`form:${formId}:analytics`, () => request<FormAnalytics>(`/forms/${formId}/analytics`)),

    exportCsvUrl: (formId: string) => `${API_URL}/forms/${formId}/responses/export`,
  },

  public: {
    getForm: (slug: string): Promise<FormType> =>
      cached(`public:${slug}`, () => request<FormType>(`/public/forms/${slug}`)),

    submitResponse: async (
      slug: string,
      data: { answers: { question_id: string; value: string }[] }
    ) => {
      const result = await request(`/public/forms/${slug}/responses`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      invalidateCache("forms:");
      invalidateCache("form:");
      invalidateCache("public:");
      return result;
    },
  },
};
