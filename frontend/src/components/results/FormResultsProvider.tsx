"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { handleApiError } from "@/lib/handle-api-error";
import { FormAnalytics } from "@/types";

interface FormResultsContextValue {
  formId: string;
  analytics: FormAnalytics | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const FormResultsContext = createContext<FormResultsContextValue | null>(null);

export function FormResultsProvider({ children }: { children: React.ReactNode }) {
  const { formId } = useParams<{ formId: string }>();
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.forms.getAnalytics(formId);
      setAnalytics(data);
    } catch (error) {
      handleApiError(error, "Failed to load form results");
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <FormResultsContext.Provider
      value={{
        formId,
        analytics,
        isLoading,
        refresh: load,
      }}
    >
      {children}
    </FormResultsContext.Provider>
  );
}

export function useFormResults() {
  const context = useContext(FormResultsContext);
  if (!context) {
    throw new Error("useFormResults must be used within FormResultsProvider");
  }
  return context;
}
