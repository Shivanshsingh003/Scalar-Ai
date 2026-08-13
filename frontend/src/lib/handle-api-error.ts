import { ApiClientError } from "@/lib/api";
import { notify } from "@/lib/toast";

export function handleApiError(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiClientError) {
    if (error.status === 404) {
      notify.error("Resource not found");
      return;
    }
    notify.error(error.message);
    return;
  }

  notify.error(error instanceof Error ? error.message : fallback);
}
