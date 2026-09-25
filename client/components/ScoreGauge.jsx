"use client";

import React from "react";

export default function ScoreGauge({ score = 0, size = 180, strokeWidth = 14, title = "Overall ATS Score" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = "text-rose-500";
  let strokeColor = "#f43f5e";
  let badgeText = "Needs Work";
  let badgeBg = "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";

  if (clampedScore >= 80) {
    colorClass = "text-emerald-500";
    strokeColor = "#10b981";
    badgeText = "Excellent Match";
    badgeBg = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  } else if (clampedScore >= 65) {
    colorClass = "text-amber-500";
    strokeColor = "#f59e0b";
    badgeText = "Competitive Match";
    badgeBg = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  } else if (clampedScore >= 50) {
    colorClass = "text-yellow-500";
    strokeColor = "#eab308";
    badgeText = "Fair Match";
    badgeBg = "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-zinc-200 dark:text-zinc-800"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            {clampedScore}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            out of 100
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-1">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeBg}`}>
          {badgeText}
        </span>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {title}
        </span>
      </div>
    </div>
  );
}
