import { toast } from "sonner";

const DEFAULT_ERROR = "Something went wrong. Please try again.";

export const notify = {
  formSaved: () =>
    toast.success("Form saved", {
      id: "form-saved",
      description: "Your changes are synced.",
    }),

  questionAdded: () =>
    toast.success("Question added", {
      description: "Start editing in the builder.",
    }),

  questionDeleted: () =>
    toast.success("Question deleted", {
      description: "The question was removed from your form.",
    }),

  published: () =>
    toast.success("Published", {
      description: "Your form is now live.",
    }),

  unpublished: () =>
    toast.success("Unpublished", {
      description: "Your form is no longer public.",
    }),

  responseSubmitted: () =>
    toast.success("Response submitted", {
      description: "Thank you for your feedback.",
    }),

  csvExported: () =>
    toast.success("CSV exported", {
      description: "Your download should begin shortly.",
    }),

  linkCopied: () =>
    toast.success("Link copied", {
      description: "Share it with your audience.",
    }),

  formCreated: () => toast.success("Form created"),

  formDuplicated: () => toast.success("Form duplicated"),

  formDeleted: () => toast.success("Form deleted"),

  error: (message: string = DEFAULT_ERROR) => toast.error(message),
};

import { getFormPublicUrl } from "@/lib/url";

export async function copyFormLink(slug: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(getFormPublicUrl(slug));
    notify.linkCopied();
    return true;
  } catch {
    notify.error("Failed to copy link");
    return false;
  }
}
