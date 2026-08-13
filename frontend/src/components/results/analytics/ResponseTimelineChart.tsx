"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TimelinePoint } from "@/types";
import { formatDate } from "@/lib/format";
import { useChartTheme } from "@/hooks/useChartTheme";
import { AnalyticsCard } from "@/components/results/analytics/StatCard";

interface ResponseTimelineChartProps {
  data: TimelinePoint[];
}

export function ResponseTimelineChart({ data }: ResponseTimelineChartProps) {
  const chartTheme = useChartTheme();
  const chartData = data.map((point) => ({
    ...point,
    label: formatDate(point.date),
  }));

  return (
    <AnalyticsCard title="Response timeline" subtitle="Submissions over time">
      {chartData.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">No timeline data yet.</p>
      ) : (
        <div className="h-56 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="timelineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartTheme.area.stroke} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={chartTheme.area.stroke} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: chartTheme.tick, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
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
                labelFormatter={(label) => label}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={chartTheme.area.stroke}
                strokeWidth={2.5}
                fill="url(#timelineFill)"
                dot={{ r: 4, fill: chartTheme.area.dot, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: chartTheme.area.activeDot }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}
