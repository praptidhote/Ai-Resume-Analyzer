"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function HistoryChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-xl border border-dashed border-zinc-200 text-xs text-zinc-400 dark:border-zinc-800">
        Run multiple analyses to view your ATS score progression over time.
      </div>
    );
  }

  // Format data for Recharts (chronological order)
  const chartData = [...data]
    .reverse()
    .map((item, index) => ({
      index: index + 1,
      date: new Date(item.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      title: item.jobTitle || `Analysis #${index + 1}`,
      Overall: item.scores?.overall || 0,
      Keywords: item.scores?.keywordMatch || 0,
      Relevance: item.scores?.relevance || 0,
    }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              borderRadius: "0.75rem",
              color: "#fff",
              fontSize: "12px",
            }}
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return `${payload[0].payload.title} (${label})`;
              }
              return label;
            }}
          />
          <Line
            type="monotone"
            dataKey="Overall"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4, fill: "#6366f1" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Keywords"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: "#10b981" }}
          />
          <Line
            type="monotone"
            dataKey="Relevance"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: "#f59e0b" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
