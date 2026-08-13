"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { BuilderSkeleton } from "@/components/loading/PageSkeletons";

const FormBuilder = dynamic(
  () => import("@/components/builder/FormBuilder").then((module) => module.FormBuilder),
  {
    ssr: false,
    loading: () => <BuilderSkeleton />,
  }
);

export default function FormEditorPage() {
  const { formId } = useParams<{ formId: string }>();
  return <FormBuilder formId={formId} />;
}
