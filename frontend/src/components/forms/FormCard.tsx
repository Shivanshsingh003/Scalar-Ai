"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FormSummary } from "@/types";
import { formatLastEdited, pluralize } from "@/lib/format";
import { useMenuKeyboard } from "@/hooks/useMenuKeyboard";
import { hoverLift, pressable, transition } from "@/lib/motion";
import { copyFormLink } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface FormCardProps {
  form: FormSummary;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  isDuplicating?: boolean;
  isDeleting?: boolean;
  isPublishing?: boolean;
  isUnpublishing?: boolean;
}

const CARD_GRADIENTS = [
  "typeform-gradient-1",
  "typeform-gradient-2",
  "typeform-gradient-3",
  "typeform-gradient-4",
  "typeform-gradient-5",
];

function gradientForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i) * (i + 1)) % CARD_GRADIENTS.length;
  return CARD_GRADIENTS[hash];
}

export function FormCard({
  form,
  onDuplicate,
  onDelete,
  onPublish,
  onUnpublish,
  isDuplicating = false,
  isDeleting = false,
  isPublishing = false,
  isUnpublishing = false,
}: FormCardProps) {
  const isBusy = isDuplicating || isDeleting || isPublishing || isUnpublishing;
  const gradient = gradientForId(form.id);

  return (
    <motion.article
      layout
      {...hoverLift}
      transition={transition}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white",
        "shadow-card hover:shadow-card-hover",
        "dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800 dark:hover:shadow-black/30 dark:hover:ring-gray-700",
        isBusy && "pointer-events-none opacity-60"
      )}
    >
      <Link href={`/dashboard/forms/${form.id}`} className="block">
        <div className={cn("relative h-28 sm:h-32", gradient)}>
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/[0.03]" />
          <span
            className={cn(
              "absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm",
              form.is_published
                ? "bg-white/95 text-emerald-800 shadow-sm"
                : "bg-gray-900/10 text-gray-700 ring-1 ring-gray-900/10 dark:bg-white/10 dark:text-gray-200 dark:ring-white/20"
            )}
          >
            {form.is_published ? "Published" : "Draft"}
          </span>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/60 text-gray-700 ring-1 ring-gray-900/10 dark:bg-gray-900/40 dark:text-gray-200 dark:ring-white/10">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path strokeLinecap="round" d="M4 6h12M4 10h8M4 14h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="line-clamp-2 text-base font-medium tracking-tight text-gray-900 group-hover:text-gray-950 dark:text-gray-100 dark:group-hover:text-white">
            {form.title}
          </h3>
          {form.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{form.description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400 dark:text-gray-500">
                <path d="M10 2a6 6 0 00-6 6v1H3a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1v-8a1 1 0 00-1-1h-1V8a6 6 0 00-6-6zm-4 7V8a4 4 0 118 0v1H6z" />
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-300">{form.response_count}</span>
              {pluralize(form.response_count, "response")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400 dark:text-gray-500">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                  clipRule="evenodd"
                />
              </svg>
              {formatLastEdited(form.updated_at)}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-3 py-3 sm:px-5 dark:border-gray-800">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto sm:gap-1.5">
          <CardActionLink href={`/dashboard/forms/${form.id}`}>Edit</CardActionLink>
          <CardActionLink href={`/dashboard/forms/${form.id}/results`}>Results</CardActionLink>
          {form.is_published && (
            <CardActionLink href={`/f/${form.slug}`} external>
              Live
            </CardActionLink>
          )}
        </div>

        <FormCardMenu
          form={form}
          disabled={isBusy}
          isDuplicating={isDuplicating}
          isDeleting={isDeleting}
          isPublishing={isPublishing}
          isUnpublishing={isUnpublishing}
          onDuplicate={() => onDuplicate(form.id)}
          onDelete={() => onDelete(form.id)}
          onPublish={() => onPublish(form.id)}
          onUnpublish={() => onUnpublish(form.id)}
        />
      </div>
    </motion.article>
  );
}

function CardActionLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={transition}>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={(e) => e.stopPropagation()}
        className="touch-target inline-flex items-center rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      >
        {children}
      </Link>
    </motion.div>
  );
}

function FormCardMenu({
  form,
  disabled,
  isDuplicating,
  isDeleting,
  isPublishing,
  isUnpublishing,
  onDuplicate,
  onDelete,
  onPublish,
  onUnpublish,
}: {
  form: FormSummary;
  disabled?: boolean;
  isDuplicating?: boolean;
  isDeleting?: boolean;
  isPublishing?: boolean;
  isUnpublishing?: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const menuItemCount = form.is_published ? 4 : 3;

  useMenuKeyboard({
    open,
    menuRef,
    triggerRef,
    itemCount: open ? menuItemCount : 0,
    onClose: () => setOpen(false),
  });

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative ml-auto">
      <motion.button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={pressable.whileTap}
        transition={transition}
        aria-label="Form actions"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className={cn(
          "touch-target focus-ring flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 sm:h-8 sm:w-8",
          "hover:bg-gray-100 hover:text-gray-700",
          open && "bg-gray-100 text-gray-700",
          "dark:hover:bg-gray-800 dark:hover:text-gray-300",
          open && "dark:bg-gray-800 dark:text-gray-300"
        )}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Form actions menu"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 z-20 mb-2 w-48 overflow-hidden rounded-2xl bg-white py-1.5 shadow-xl shadow-gray-900/10 ring-1 ring-gray-200 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-700"
          >
            <MenuItem
              onClick={() => {
                onDuplicate();
                setOpen(false);
              }}
              disabled={isDuplicating}
            >
              {isDuplicating ? "Duplicating..." : "Duplicate"}
            </MenuItem>
            {form.is_published ? (
              <>
                <MenuItem
                  onClick={() => {
                    copyFormLink(form.slug);
                    setOpen(false);
                  }}
                >
                  Copy link
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onUnpublish();
                    setOpen(false);
                  }}
                  disabled={isUnpublishing}
                >
                  {isUnpublishing ? "Unpublishing..." : "Unpublish"}
                </MenuItem>
              </>
            ) : (
              <MenuItem
                onClick={() => {
                  onPublish();
                  setOpen(false);
                }}
                disabled={isPublishing}
              >
                {isPublishing ? "Publishing..." : "Publish"}
              </MenuItem>
            )}
            <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
            <MenuItem
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              disabled={isDeleting}
              variant="danger"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </MenuItem>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  onClick,
  disabled,
  variant = "default",
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "focus-ring flex w-full items-center px-3.5 py-3 text-left text-sm font-medium transition-colors disabled:opacity-50 sm:py-2.5",
        variant === "danger"
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
      )}
      role="menuitem"
      tabIndex={-1}
    >
      {children}
    </button>
  );
}
