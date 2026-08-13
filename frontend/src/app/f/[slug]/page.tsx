"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Form } from "@/types";
import { FormPlayerSkeleton } from "@/components/loading/PageSkeletons";

const FormPlayer = dynamic(
  () => import("@/components/forms/FormPlayer").then((module) => module.FormPlayer),
  {
    ssr: false,
    loading: () => <FormPlayerSkeleton />,
  }
);

export default function PublicFormPage() {
  const { slug } = useParams<{ slug: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api.public
      .getForm(slug)
      .then((data) => {
        if (!cancelled) setForm(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Form not found");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (form?.title) {
      document.title = `${form.title} — FormFlow`;
    }
    return () => {
      document.title = "FormFlow — Typeform Clone";
    };
  }, [form?.title]);

  if (error) {
    return (
      <main id="main-content" className="fixed inset-0 flex h-[100dvh] items-center justify-center bg-white dark:bg-gray-900">
        <p role="alert" className="px-6 text-center text-lg text-gray-600 dark:text-gray-400">
          {error}
        </p>
      </main>
    );
  }

  if (!form) {
    return <FormPlayerSkeleton />;
  }

  const questions = [...(form.questions ?? [])].sort((a, b) => a.order - b.order);

  return (
    <FormPlayer
      formTitle={form.title}
      formDescription={form.description}
      questions={questions}
      onSubmit={async (answers) => {
        await api.public.submitResponse(slug, { answers });
      }}
    />
  );
}
