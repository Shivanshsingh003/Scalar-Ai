"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export function useChartTheme() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return {
    isDark,
    grid: isDark ? "#374151" : "#f0f0f0",
    tick: isDark ? "#9ca3af" : "#9ca3af",
    axis: isDark ? "#6b7280" : "#9ca3af",
    tooltip: {
      backgroundColor: isDark ? "#111827" : "#ffffff",
      border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
      borderRadius: "12px",
      boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.35)" : "0 10px 30px rgba(0,0,0,0.08)",
      color: isDark ? "#f3f4f6" : "#111827",
    },
    area: {
      stroke: isDark ? "#818cf8" : "#6366f1",
      fillStart: isDark ? "rgba(129, 140, 248, 0.35)" : "rgba(99, 102, 241, 0.35)",
      fillEnd: isDark ? "rgba(129, 140, 248, 0.02)" : "rgba(99, 102, 241, 0.02)",
      dot: isDark ? "#818cf8" : "#6366f1",
      activeDot: isDark ? "#a5b4fc" : "#4f46e5",
    },
    pieColors: isDark
      ? ["#818cf8", "#a78bfa", "#f472b6", "#fbbf24", "#34d399", "#60a5fa", "#2dd4bf"]
      : ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#14b8a6"],
    barColors: isDark
      ? ["#f87171", "#fb923c", "#facc15", "#4ade80", "#818cf8"]
      : ["#fca5a5", "#fdba74", "#fde047", "#86efac", "#6366f1"],
    legend: isDark ? "#d1d5db" : "#4b5563",
  };
}
