"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Form } from "@/types";
import { getFormPublicUrl } from "@/lib/url";
import { copyFormLink } from "@/lib/toast";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import { Spinner } from "@/components/ui/Spinner";
import { modalBackdrop, modalContent, pressable, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  form: Form;
  isPublishing?: boolean;
  isUnpublishing?: boolean;
  onPublish: () => Promise<void>;
  onUnpublish: () => Promise<void>;
}

export function PublishModal({
  open,
  onClose,
  form,
  isPublishing = false,
  isUnpublishing = false,
  onPublish,
  onUnpublish,
}: PublishModalProps) {
  const [publicUrl, setPublicUrl] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const isBusy = isPublishing || isUnpublishing;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const publicUrlId = "publish-modal-url";
  const { dialogRef, titleId } = useDialogA11y(open, onClose, {
    initialFocusRef: closeButtonRef,
  });

  useEffect(() => {
    if (open) {
      setPublicUrl(getFormPublicUrl(form.slug));
    }
  }, [open, form.slug]);

  useEffect(() => {
    if (open && form.is_published) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2200);
      return () => clearTimeout(timer);
    }
    if (!form.is_published) {
      setShowSuccess(false);
    }
  }, [open, form.is_published]);

  const handleToggle = async () => {
    if (isBusy) return;
    try {
      if (form.is_published) {
        await onUnpublish();
      } else {
        await onPublish();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2200);
      }
    } catch {
      // Errors are surfaced via toast in the parent handler.
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...modalBackdrop}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            {...modalContent}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-gray-900/20 ring-1 ring-gray-100 safe-bottom sm:max-h-[min(92dvh,720px)] sm:rounded-3xl dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800"
          >
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-emerald-400/20 via-indigo-400/10 to-transparent" />

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="touch-target focus-ring absolute right-3 top-3 z-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-white/80 hover:text-gray-900 sm:right-4 sm:top-4 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Close publish dialog"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            <div className="relative overflow-y-auto px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden dark:bg-gray-700" aria-hidden />
              <SuccessAnimation show={showSuccess && form.is_published} />

              <div className="text-center">
                <StatusBadge published={form.is_published} />
                <h2 id={titleId} className="mt-4 text-xl font-light tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">
                  {form.is_published ? "Your form is live" : "Publish your form"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {form.is_published
                    ? "Share the link or QR code so people can respond."
                    : "Make your form public and start collecting responses."}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {form.is_published ? (
                  <motion.div
                    key="published"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={transition}
                    className="mt-8 space-y-5"
                  >
                    <div>
                      <label htmlFor={publicUrlId} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-gray-400">
                        Public URL
                      </label>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <input
                          id={publicUrlId}
                          type="text"
                          readOnly
                          value={publicUrl}
                          aria-readonly="true"
                          className="min-w-0 flex-1 truncate rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 ring-1 ring-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-800"
                        />
                        <motion.button
                          type="button"
                          onClick={() => copyFormLink(form.slug)}
                          disabled={isBusy}
                          whileHover={isBusy ? undefined : pressable.whileHover}
                          whileTap={isBusy ? undefined : pressable.whileTap}
                          className="touch-target shrink-0 rounded-2xl bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                        >
                          Copy link
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <motion.div whileHover={pressable.whileHover} whileTap={pressable.whileTap} className="flex-1">
                        <Link
                          href={`/f/${form.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="touch-target flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                          Open form
                        </Link>
                      </motion.div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                        QR Code
                      </p>
                      <div className="mx-auto mt-4 flex w-fit rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
                        {publicUrl && (
                          <QRCode value={publicUrl} size={160} level="M" fgColor="#111827" bgColor="#ffffff" />
                        )}
                      </div>
                      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">Scan to open the form on mobile</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="draft"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={transition}
                    className="mt-8"
                  >
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-900/50">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-gray-400 dark:text-gray-500">
                          <path strokeLinecap="round" d="M13.5 6.5L17 10M12 3v6m0 12v-6m-6-6H3m18 0h-3M7 17l-3.5 3.5M17 17l3.5 3.5" />
                        </svg>
                      </div>
                      <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">This form is currently a draft</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Only you can see it until you publish.</p>
                      <motion.button
                        type="button"
                        onClick={handleToggle}
                        disabled={isBusy}
                        whileHover={isBusy ? undefined : pressable.whileHover}
                        whileTap={isBusy ? undefined : pressable.whileTap}
                        className="touch-target mt-6 inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isPublishing && (
                          <Spinner size="sm" className="border-white/30 border-t-white" />
                        )}
                        {isPublishing ? "Publishing..." : "Publish now"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3.5 dark:border-gray-800 dark:bg-gray-900/50">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Published status</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {form.is_published ? "Form is visible to everyone" : "Form is hidden from public"}
                  </p>
                </div>
                <PublishToggle
                  checked={form.is_published}
                  disabled={isBusy}
                  onChange={handleToggle}
                  ariaLabel={form.is_published ? "Unpublish form" : "Publish form"}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        published
          ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80"
          : "bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700"
      )}
    >
      <span
        className={cn("h-2 w-2 rounded-full", published ? "bg-emerald-500" : "bg-gray-400")}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function PublishToggle({
  checked,
  disabled,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      className={cn(
        "touch-target focus-ring relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-emerald-500" : "bg-gray-300"
      )}
    >
      <motion.span
        layout
        transition={transition}
        className={cn(
          "absolute top-0.5 h-7 w-7 rounded-full bg-white shadow-sm",
          checked ? "left-[26px]" : "left-0.5"
        )}
      />
    </motion.button>
  );
}

function SuccessAnimation({ show }: { show: boolean }) {
  return (
    <>
      <div aria-live="polite" className="sr-only">
        {show ? "Form published successfully" : ""}
      </div>
      <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2"
          aria-hidden
        >
          <div className="relative">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: Math.cos((i / 6) * Math.PI * 2) * 48,
                  y: Math.sin((i / 6) * Math.PI * 2) * 48,
                }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400"
              />
            ))}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-8 w-8"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
