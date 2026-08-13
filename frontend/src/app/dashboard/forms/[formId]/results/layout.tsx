import { FormResultsProvider } from "@/components/results/FormResultsProvider";

export default function FormResultsLayout({ children }: { children: React.ReactNode }) {
  return <FormResultsProvider>{children}</FormResultsProvider>;
}
