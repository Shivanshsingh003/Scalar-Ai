import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#fafafa",
        },
        ink: {
          DEFAULT: "#262627",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "typeform-question": ["2.5rem", { lineHeight: "1.12", fontWeight: "300" }],
        "typeform-body": ["1.125rem", { lineHeight: "1.6", fontWeight: "300" }],
        "typeform-label": [
          "0.6875rem",
          { lineHeight: "1", letterSpacing: "0.12em", fontWeight: "600" },
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
