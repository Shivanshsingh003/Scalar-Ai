"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FormResponse } from "@/types";
import { formatDateTime, shortId } from "@/lib/format";
import { pressable, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

interface ResponsesTableProps {
  formId: string;
  responses: FormResponse[];
}

export function ResponsesTable({ formId, responses }: ResponsesTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return responses;
    return responses.filter((response) => {
      const haystack = [
        response.id,
        formatDateTime(response.submitted_at),
        ...response.answers.map((a) => a.value),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [responses, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-md shadow-gray-200/50 ring-1 ring-gray-100 dark:bg-gray-900 dark:shadow-black/20 dark:ring-gray-800">
      <div className="border-b border-gray-100 p-4 sm:p-6 dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Individual responses
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} of {responses.length} submissions
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              id="response-search"
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search responses..."
              aria-label="Search responses"
              className={cn(
                "w-full rounded-2xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm",
                "shadow-sm ring-1 ring-gray-100 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200",
                "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-800 dark:focus:border-gray-600 dark:focus:ring-gray-700"
              )}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="divide-y divide-gray-100 sm:hidden dark:divide-gray-800" aria-label="Responses list">
          {paginated.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No responses match your search.
            </p>
          ) : (
            paginated.map((response) => (
              <div key={response.id} className="flex flex-col gap-3 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-medium text-gray-700 dark:text-gray-300" title={response.id}>
                      {shortId(response.id)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {formatDateTime(response.submitted_at)}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {response.answers.length} answers
                  </span>
                </div>
                <Link
                  href={`/dashboard/forms/${formId}/results/responses/${response.id}`}
                  className="touch-target inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  View response
                </Link>
              </div>
            ))
          )}
        </div>

        <table className="hidden w-full min-w-[720px] text-left text-sm sm:table">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-900/50">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-gray-400">
                Submission
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-gray-400">
                Submitted
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-gray-400">
                Answers
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No responses match your search.
                </td>
              </tr>
            ) : (
              paginated.map((response) => (
                <motion.tr
                  key={response.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={transition}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-medium text-gray-700 dark:text-gray-300" title={response.id}>
                      {shortId(response.id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{formatDateTime(response.submitted_at)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {response.answers.length} answers
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <motion.div whileHover={pressable.whileHover} whileTap={pressable.whileTap}>
                      <Link
                        href={`/dashboard/forms/${formId}/results/responses/${response.id}`}
                        className="touch-target inline-flex rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        View
                      </Link>
                    </motion.div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <PaginationButton
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            <PaginationButton
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </div>
        </div>
      )}
    </div>
  );
}

function PaginationButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "touch-target rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 sm:px-3.5 sm:py-2",
        "hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40",
        "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
      )}
    >
      {children}
    </button>
  );
}
