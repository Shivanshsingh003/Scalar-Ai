import { LandingHeader, LandingHero } from "@/components/layout/LandingHeader";

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-muted transition-colors duration-300">
      <LandingHeader />
      <LandingHero />

      <section className="border-t border-gray-200 bg-white py-16 sm:py-20 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:grid-cols-3 sm:gap-8">
          {[
            {
              title: "Conversational UX",
              description: "One question at a time keeps respondents engaged.",
            },
            {
              title: "Easy builder",
              description: "Add questions, publish, and share a link in minutes.",
            },
            {
              title: "Response tracking",
              description: "View all submissions from your dashboard.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card ring-1 ring-gray-100 dark:border-gray-800 dark:bg-gray-900/50 dark:ring-gray-800"
            >
              <h3 className="font-medium tracking-tight text-gray-900 dark:text-gray-100">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
