"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnswerCount } from "@/types";
import { useChartTheme } from "@/hooks/useChartTheme";

interface RatingBarChartProps {
  data: AnswerCount[];
}

export function RatingBarChart({ data }: RatingBarChartProps) {
  const chartTheme = useChartTheme();
  const countMap = Object.fromEntries(data.map((item) => [item.value, item.count]));
  const chartData = [1, 2, 3, 4, 5].map((rating) => ({
    rating: String(rating),
    count: countMap[String(rating)] ?? 0,
  }));

  return (
    <div className="h-56 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
          <XAxis
            dataKey="rating"
            tick={{ fill: chartTheme.tick, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            label={{ value: "Rating", position: "insideBottom", offset: -2, fill: chartTheme.tick }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: chartTheme.tick, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={chartTheme.tooltip}
            formatter={(value) => [`${Number(value ?? 0)} responses`, "Count"]}
            labelFormatter={(label) => `Rating ${label}`}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={chartTheme.barColors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
