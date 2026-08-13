import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-6 text-center dark:bg-gray-950"
    >
      <div className="max-w-md rounded-3xl bg-white p-10 shadow-lg ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="focus-ring touch-target inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="focus-ring touch-target inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
