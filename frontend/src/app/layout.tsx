import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToasterProvider } from "@/components/providers/ToasterProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeScript } from "@/components/providers/ThemeScript";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FormFlow — Typeform Clone",
  description: "Create beautiful, conversational forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} font-sans transition-colors duration-300`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          {children}
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
