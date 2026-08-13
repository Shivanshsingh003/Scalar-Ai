"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AnswerCount } from "@/types";
import { useChartTheme } from "@/hooks/useChartTheme";

interface MultipleChoicePieChartProps {
  data: AnswerCount[];
}

export function MultipleChoicePieChart({ data }: MultipleChoicePieChartProps) {
  const chartTheme = useChartTheme();
  const chartData = data.map((item) => ({
    name: item.value,
    value: item.count,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={92}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={chartTheme.pieColors[index % chartTheme.pieColors.length]}
                stroke={chartTheme.isDark ? "#111827" : "white"}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={chartTheme.tooltip}
            formatter={(value, name) => {
              const count = Number(value ?? 0);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return [`${count} (${pct}%)`, String(name)];
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={48}
            formatter={(value) => (
              <span style={{ color: chartTheme.legend }} className="text-sm">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
